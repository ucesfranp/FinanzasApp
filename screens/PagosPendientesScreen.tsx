import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import PagoItem, { PagoLocal } from '../components/PagoItem';
import { getPagos, guardarPago, actualizarPago, eliminarPago } from '../services/pagos';
import { useSQLiteContext } from 'expo-sqlite';
import BottomNav from '../components/BottomNav';
import { useTema } from '../context/TemaContext';
import { showAlert } from '../services/alertUtils';


export default function PagosPendientesScreen() {

    //Para el modo oscuro
    const { colores } = useTema();

    // Conexión con SQLite para actualizar el presupuesto mensual cuando se marca un pago como pagado o se desmarca
    const db = (() => {
        try {
            return useSQLiteContext();
        } catch {
            return null as any;
        }
    })();

    // Estado para manejar los pagos y los inputs del formulario
    const [pagos, setPagos] = useState<PagoLocal[]>([]);
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [fechaVto, setFechaVto] = useState('');

    useEffect(() => {
        cargar();
    }, [])

    // Cuando seleccionamos la pantalla de pagos pendientes, useEffect llama a cargar() que espera el resultado de getPagos(),  el cual lee AsyncStorage y luego setPagos() actualiza el estado de pagos con los datos obtenidos por getPagos(). Y React vuelve a renderizar la lista.
    async function cargar(){
        const datos = await getPagos(); //Uso await porque AsyncStorage deuvelve una promesa.
        setPagos(datos);
    }

    // 3 etapas: Validar, Crear el objeto y guardarlo.
    async function onAgregar() {

        //Eliminamos los espacios al principio y final o detectamos si es el campo viene vacio
        if(!descripcion.trim() || !monto.trim() || !fechaVto.trim()) {
            showAlert('Error', 'Completa todos los campos');
            return;
        }

        //Validamos el monto ingresado por el usuario
        const montoNum = parseFloat(monto);
        if (isNaN(montoNum) || montoNum <= 0) {
            showAlert('Error', 'Monto inválido');
            return;
        }

        // Creamos el objeto de pagoTemporal con los datos ingresados por el usuario y un id único basado en la fecha actual (Date.now())
        const pagoTemporal: PagoLocal = {
            id: Date.now(),
            descripcion: descripcion.trim(),
            monto: montoNum,
            fechaVencimiento: fechaVto.trim(),
            pagado: false,
            pagoFecha: null, //Null ya que todavía no tiene fecha de pago
        };

        // Actualizamos la interfaz
        // Creamos un nuevo array con los pagos existentes y el nuevo
        setPagos(prev => [...prev, pagoTemporal]);
        //Limpiamos el formulario
        setDescripcion('');
        setMonto('');
        setFechaVto('');

        // Persistencia: llamamos al servicio de pagos -> guardarPago() para que escriba el pago en AsyncStorage. No uso await ya que la persistencia la intentamos en segundo plano para que el usuario vea inmediatamente el pago al agregarlo.
        guardarPago({
            descripcion: pagoTemporal.descripcion,
            monto: pagoTemporal.monto,
            fechaVencimiento: pagoTemporal.fechaVencimiento,
            pagado: pagoTemporal.pagado,
            pagoFecha: pagoTemporal.pagoFecha,
        }).catch((error) => {
            console.log('Error al guardar pago:', error);
        });
    }

    // Función para alternar el estado del pago a saldado o pendiente.
    async function onTogglePaid(p: PagoLocal) {
        const pagadoAhora = !p.pagado; //Invierte el estado del pago.
        const pagoFecha = pagadoAhora ? new Date().toISOString() : null; //Si se marca como pagado, guardamos la fecha actual; si se desmarca, ponemos null.
        const actualizado: PagoLocal = { ...p, pagado: pagadoAhora, pagoFecha };

        await actualizarPago(actualizado);
        setPagos(prev => prev.map(x => (x.id === actualizado.id ? actualizado : x)));

        //Si se marcó como pagado, restamos del presupuesto mensual; y en caso que se desmarque como pagado, sumamos nuevamente al presupuesto mensual. Esto es para mantener el presupuesto actualizado según los pagos realizados.
        if (pagadoAhora && db && db.runAsync) {
            try {
                    //leemos el presupuesto actual
                    const pref = await db.getFirstAsync("select valor from preferencias where clave = 'presupuesto_mensual'") as { valor: string } | undefined;
                if (pref && pref.valor) {
                    const actual = parseFloat(pref.valor) || 0;
                    const nuevoPresupuesto = actual - actualizado.monto;
                    await db.runAsync("insert or replace into preferencias (clave, valor) values ('presupuesto_mensual', ?)", [nuevoPresupuesto.toString()])
                }
            } catch (err) {
                console.log('No se pudo actualizar el presupuesto:', err);
            }
        } else if (!pagadoAhora && db && db.runAsync) {
            try {
                //leemos el presupuesto actual
                const pref = await db.getFirstAsync("select valor from preferencias where clave = 'presupuesto_mensual'") as { valor: string } | undefined;
                if (pref && pref.valor) {
                    const actual = parseFloat(pref.valor) || 0;
                    const nuevoPresupuesto = actual + actualizado.monto;
                    await db.runAsync("insert or replace into preferencias (clave, valor) values ('presupuesto_mensual', ?)", [nuevoPresupuesto.toString()])
                }
            } catch (err) {
                console.log('No se pudo actualizar el presupuesto:', err);
            }
        }
    }

    // Función para eliminar un pago. Llama a eliminarPago() del servicio de pagos para que borre el pago de AsyncStorage y luego actualiza el estado de pagos para reflejar el cambio en la interfaz.
    async function onEliminar(id: number) {
        await eliminarPago(id);
        setPagos(prev => prev.filter(x => x.id !== id));
    }


    return (

        <View style={{ flex: 1, paddingTop: 50, backgroundColor: colores.fondo }}>
            <View style={[styles.form, {margin: 20, marginTop: 30}]}>
                <TextInput 
                    accessibilityLabel="input-descripcion"
                    placeholder="Descripción"
                    placeholderTextColor={colores.texto}
                    value={descripcion}
                    onChangeText={setDescripcion}
                    style={[styles.input, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder, color: colores.texto }]}
                />
                <TextInput
                    accessibilityLabel="input-monto"
                    placeholder="Monto"
                    placeholderTextColor={colores.texto}
                    value={monto}
                    onChangeText={setMonto}
                    keyboardType="decimal-pad"
                    style={[styles.input, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder, color: colores.texto }]}
                />
                <TextInput
                    accessibilityLabel="input-fecha"
                    placeholder="Fecha venc. (YYYY-MM-DD)"
                    placeholderTextColor={colores.texto}
                    value={fechaVto}
                    onChangeText={setFechaVto}
                    style={[styles.input, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder, color: colores.texto }]}
                />
                <Pressable accessibilityLabel="btn-agregar" style={[styles.btn, { backgroundColor: colores.boton }]} onPress={onAgregar}>
                    <Text style={styles.btnText}>Agregar pago</Text>
                </Pressable>
            </View>

            <ScrollView style={{ flex: 1, backgroundColor: colores.fondo }}>
                {pagos.length === 0 ? (
                    <Text style={{ padding: 16, color: colores.texto, textAlign: 'center' }}>No hay pagos pendientes</Text>
                ) : (
                    pagos.map(p => (
                        <PagoItem 
                            key={p.id}
                            pago={p}
                            colores={colores}
                            onTogglePaid={onTogglePaid}
                            onEliminar={onEliminar}
                        />
                    ))
                )} 
            </ScrollView>
            {/* Agrego bottom nav para poder seguir navegando entre pantallas */}
            <BottomNav current="PagosPendientes" />
        </View>
    )
}


const styles = StyleSheet.create({
    form: { padding: 12 },
    input: { borderWidth: 1, borderRadius: 6, padding: 8, marginBottom: 8 },
    btn: { padding: 12, borderRadius: 6, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '700' },
});