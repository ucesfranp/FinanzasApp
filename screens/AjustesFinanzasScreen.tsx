import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { useFinanzas } from '../context/FinanzasContext';
import { useState, useEffect } from 'react';

export default function AjustesFinanzasScreen() {
    const { colores } = useTema();
    const { presupuesto, establecerPresupuesto } = useFinanzas();
    
    const [presupuestoNuevo, setPresupuestoNuevo] = useState(presupuesto.toString());
    const [editandoPresupuesto, setEditandoPresupuesto] = useState(false);
    const [guardando, setGuardando] = useState(false);
    // Estado local para animar el switch sin cambiar el tema global
    const [oscuro, setOscuro] = useState(false);

    useEffect(() => {
        setPresupuestoNuevo(presupuesto.toString());
    }, [presupuesto]);

    const handleGuardarPresupuesto = async () => {
        const monto = parseFloat(presupuestoNuevo);
        if (isNaN(monto) || monto <= 0) {
            Alert.alert('Error', 'Por favor ingresa un monto válido');
            return;
        }

        try {
            setGuardando(true);
            await establecerPresupuesto(monto);
            Alert.alert('Éxito', 'Presupuesto actualizado');
            setEditandoPresupuesto(false);
        } catch (err) {
            Alert.alert('Error', 'No se pudo actualizar el presupuesto');
        } finally {
            setGuardando(false);
        }
    };

    const handleCancelarPresupuesto = () => {
        setPresupuestoNuevo(presupuesto.toString());
        setEditandoPresupuesto(false);
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colores.fondo }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.titulo, { color: colores.textoPrimario }]}>Ajustes</Text>
            </View>

            {/* Sección Apariencia */}
            <View style={[styles.seccion, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}>
                <Text style={[styles.tituloSeccion, { color: colores.textoPrimario }]}>Apariencia</Text>
                
                <View style={styles.filaOpcion}>
                    <View>
                        <Text style={[styles.etiqueta, { color: colores.texto }]}>Modo oscuro</Text>
                        <Text style={[styles.descripcion, { color: colores.texto, opacity: 0.6 }]}>
                            {oscuro ? 'Activado' : 'Desactivado'}
                        </Text>
                    </View>
                    <Switch
                        value={oscuro}
                        onValueChange={(valor) => setOscuro(valor)}
                        trackColor={{ false: '#ccc', true: colores.boton }}
                        thumbColor={oscuro ? colores.textoPrimario : '#f4f3f4'}
                    />
                </View>
            </View>

            {/* Sección Presupuesto */}
            <View style={[styles.seccion, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}>
                <View style={styles.headerSeccion}>
                    <Text style={[styles.tituloSeccion, { color: colores.textoPrimario }]}>Presupuesto Mensual</Text>
                    {!editandoPresupuesto && (
                        <Pressable 
                            onPress={() => setEditandoPresupuesto(true)}
                        >
                            <Ionicons name="pencil" size={20} color={colores.textoPrimario} />
                        </Pressable>
                    )}
                </View>

                {editandoPresupuesto ? (
                    <>
                        <View style={[styles.inputMonto, { borderColor: colores.inputBorder }]}>
                            <Text style={[styles.simbolo, { color: colores.texto }]}>$</Text>
                            <TextInput
                                placeholder="0.00"
                                placeholderTextColor={colores.texto}
                                style={[
                                    styles.inputNumero,
                                    { color: colores.texto }
                                ]}
                                value={presupuestoNuevo}
                                onChangeText={setPresupuestoNuevo}
                                keyboardType="decimal-pad"
                                editable={!guardando}
                            />
                        </View>
                        
                        <View style={[styles.botonesMonto, { marginTop: 12 }]}>
                            <Pressable 
                                style={[styles.botonMonto, { backgroundColor: colores.inputBorder }]}
                                onPress={handleCancelarPresupuesto}
                                disabled={guardando}
                            >
                                <Text style={[styles.textoBotonMonto, { color: colores.texto }]}>Cancelar</Text>
                            </Pressable>
                            <Pressable 
                                style={[styles.botonMonto, { backgroundColor: colores.boton }]}
                                onPress={handleGuardarPresupuesto}
                                disabled={guardando}
                            >
                                <Text style={styles.textoBotonMontoGuardar}>
                                    {guardando ? 'Guardando...' : 'Guardar'}
                                </Text>
                            </Pressable>
                        </View>
                    </>
                ) : (
                    <View>
                        <Text style={[styles.montoActual, { color: colores.texto }]}>
                            {/* Para que el presupuesto se muestre con 500.000 en lugar de 500000 */}
                            $ {presupuesto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            {/* ${presupuesto.toFixed(2)} */}
                        </Text>
                        <Text style={[styles.descripcion, { color: colores.texto, opacity: 0.6 }]}>
                            Este es tu presupuesto mensual. Los gastos se comparan contra este monto.
                        </Text>
                    </View>
                )}
            </View>

            {/* Sección Datos */}
            <View style={[styles.seccion, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}>
                <Text style={[styles.tituloSeccion, { color: colores.textoPrimario }]}>Datos</Text>
                
                <Pressable style={styles.filaOpcion}>
                    <View>
                        <Text style={[styles.etiqueta, { color: colores.texto }]}>Privacidad y seguridad</Text>
                        <Text style={[styles.descripcion, { color: colores.texto, opacity: 0.6 }]}>
                            Tu información se guarda localmente
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colores.texto} />
                </Pressable>
            </View>

            <View style={{ height: 20 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    seccion: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
    },
    headerSeccion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    tituloSeccion: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    filaOpcion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    etiqueta: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    descripcion: {
        fontSize: 12,
    },
    inputMonto: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    simbolo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 4,
    },
    inputNumero: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        fontWeight: 'bold',
    },
    montoActual: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    botonesMonto: {
        flexDirection: 'row',
        gap: 10,
    },
    botonMonto: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoBotonMonto: {
        fontSize: 13,
        fontWeight: '600',
    },
    textoBotonMontoGuardar: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
    },
});
