import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import PagoItem, { PagoLocal } from '../components/PagoItem';
import { getPagos, guardarPago, actualizarPago, eliminarPago } from '../services/pagos';
import { useSQLiteContext } from 'expo-sqlite';
import BottomNav from '../components/BottomNav';
import { useTema } from '../context/TemaContext';


export default function PagosPendientesScreen() {

    //Para el modo oscuro
    const { colores } = useTema();

    const db = (() => {
        try {
            return useSQLiteContext();
        } catch {
            return null as any;
        }
    })();

    const [pagos, setPagos] = useState<PagoLocal[]>([]);
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [fechaVto, setFechaVto] = useState('');

    useEffect(() => {
        cargar();
    }, [])

    async function cargar(){
        const datos = await getPagos();
        setPagos(datos);
    }

    async function onAgregar() {
        if(!descripcion.trim() || !monto.trim() || !fechaVto.trim()) {
            Alert.alert('Error', 'Completa todos los campos');
            return;
        }

        const montoNum = parseFloat(monto);
        if (isNaN(montoNum) || montoNum <= 0) {
            Alert.alert('Error', 'Monto inválido');
            return;
        }

        const pagoTemporal: PagoLocal = {
            id: Date.now(),
            descripcion: descripcion.trim(),
            monto: montoNum,
            fechaVencimiento: fechaVto.trim(),
            pagado: false,
            pagoFecha: null,
        };

        setPagos(prev => [...prev, pagoTemporal]);
        setDescripcion('');
        setMonto('');
        setFechaVto('');

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

    async function onTogglePaid(p: PagoLocal) {
        const pagadoAhora = !p.pagado;
        const pagoFecha = pagadoAhora ? new Date().toISOString() : null;
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