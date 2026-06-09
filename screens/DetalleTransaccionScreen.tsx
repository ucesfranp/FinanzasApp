import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { useFinanzas } from '../context/FinanzasContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { Transaccion } from './FinanzasTypes';
import { showAlert } from '../services/alertUtils';
import { formatDateString } from '../services/dateUtils';

export default function DetalleTransaccionScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { colores } = useTema();
    const { transacciones, categorias, editarTransaccion, eliminarTransaccion } = useFinanzas();

    const transaccionId = (route.params as any)?.id;
    const transaccion = transacciones.find(t => t.id === transaccionId);

    const [editando, setEditando] = useState(false);
    const [descripcion, setDescripcion] = useState(transaccion?.descripcion || '');
    const [monto, setMonto] = useState(transaccion?.monto.toString() || '');
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (transaccion) {
            setDescripcion(transaccion.descripcion);
            setMonto(transaccion.monto.toString());
        }
    }, [transaccion]);

    if (!transaccion) {
        return (
            <View style={[styles.container, { backgroundColor: colores.fondo, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={[styles.tituloVacio, { color: colores.texto }]}>No encontrado</Text>
            </View>
        );
    }

    const categoria = categorias.find(c => c.id === transaccion.categoria_id);

    const handleGuardar = async () => {
        if (!descripcion.trim()) {
            Alert.alert('Error', 'La descripción no puede estar vacía');
            return;
        }

        const montoNum = parseFloat(monto);
        if (isNaN(montoNum) || montoNum <= 0) {
            Alert.alert('Error', 'Ingresa un monto válido');
            return;
        }

        try {
            setGuardando(true);
            await editarTransaccion(transaccion.id, {
                descripcion: descripcion.trim(),
                monto: montoNum,
                tipo: transaccion.tipo,
                categoria_id: transaccion.categoria_id,
                fecha: transaccion.fecha,
                api_id: transaccion.api_id,
            });
            Alert.alert('Éxito', 'Transacción actualizada');
            setEditando(false);
        } catch (err) {
            Alert.alert('Error', 'No se pudo actualizar');
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = () => {
        showAlert(
            'Eliminar transacción',
            '¿Estás seguro?',
            [
                { text: 'Cancelar', onPress: () => {} },
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        try {
                            await eliminarTransaccion(transaccion.id);
                            Alert.alert('Éxito', 'Transacción eliminada');
                            navigation.goBack();
                        } catch (err) {
                            Alert.alert('Error', 'No se pudo eliminar');
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const fecha = transaccion.fecha;
    const fechaFormato = formatDateString(fecha, 'datetime');

    return (
        <ScrollView style={[styles.container, { backgroundColor: colores.fondo, paddingTop: 80 }]}>
            {/* Monto grande */}
            <View style={[styles.tarjeta, { backgroundColor: categoria?.color || '#C7CEEA' }]}>
                <Text style={styles.tipo}>
                    {transaccion.tipo === 'ingreso' ? 'INGRESO' : 'GASTO'}
                </Text>
                <Text style={styles.montoGrande}>
                    {transaccion.tipo === 'ingreso' ? '+' : '-'}${transaccion.monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
                <Text style={styles.categoria}>{categoria?.nombre}</Text>
            </View>

            {/* Información */}
            <View style={[styles.seccion, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}>
                <Text style={[styles.label, { color: colores.textoPrimario }]}>Descripción</Text>
                {editando ? (
                    <TextInput
                        style={[
                            styles.input,
                            { backgroundColor: colores.fondo, borderColor: colores.inputBorder, color: colores.texto }
                        ]}
                        value={descripcion}
                        onChangeText={setDescripcion}
                        editable={!guardando}
                    />
                ) : (
                    <Text style={[styles.valor, { color: colores.texto }]}>{transaccion.descripcion}</Text>
                )}
            </View>

            <View style={[styles.seccion, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}>
                <Text style={[styles.label, { color: colores.textoPrimario }]}>Monto</Text>
                {editando ? (
                    <View style={[styles.inputMonto, { borderColor: colores.inputBorder }]}>
                        <Text style={[styles.simbolo, { color: colores.texto }]}>$</Text>
                        <TextInput
                            style={[
                                styles.inputNumero,
                                { color: colores.texto }
                            ]}
                            value={monto}
                            onChangeText={setMonto}
                            keyboardType="decimal-pad"
                            editable={!guardando}
                        />
                    </View>
                ) : (
                    <Text style={[styles.valor, { color: colores.texto }]}>${transaccion.monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                )}
            </View>

            <View style={[styles.seccion, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}>
                <Text style={[styles.label, { color: colores.textoPrimario }]}>Fecha</Text>
                <Text style={[styles.valor, { color: colores.texto }]}>{fechaFormato}</Text>
            </View>

            {/* Botones */}
            <View style={styles.botones}>
                {!editando ? (
                    <>
                        <Pressable 
                            style={[styles.boton, { backgroundColor: colores.boton }]}
                            onPress={() => setEditando(true)}
                        >
                            <Ionicons name="pencil" size={18} color="white" />
                            <Text style={styles.textoBoton}>Editar</Text>
                        </Pressable>

                        <Pressable 
                            style={[styles.boton, { backgroundColor: '#FF6B6B' }]}
                            onPress={handleEliminar}
                        >
                            <Ionicons name="trash" size={18} color="white" />
                            <Text style={styles.textoBoton}>Eliminar</Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Pressable 
                            style={[styles.boton, { backgroundColor: colores.boton }]}
                            onPress={handleGuardar}
                            disabled={guardando}
                        >
                            <Ionicons name="checkmark" size={18} color="white" />
                            <Text style={styles.textoBoton}>
                                {guardando ? 'Guardando...' : 'Guardar'}
                            </Text>
                        </Pressable>

                        <Pressable 
                            style={[styles.boton, { backgroundColor: colores.inputBorder }]}
                            onPress={() => {
                                setEditando(false);
                                setDescripcion(transaccion.descripcion);
                                setMonto(transaccion.monto.toString());
                            }}
                            disabled={guardando}
                        >
                            <Ionicons name="close" size={18} color={colores.texto} />
                            <Text style={[styles.textoBoton, { color: colores.texto }]}>Cancelar</Text>
                        </Pressable>
                    </>
                )}
            </View>

            <View style={{ height: 20 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    tituloVacio: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    tarjeta: {
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
    },
    tipo: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        opacity: 0.8,
        marginBottom: 8,
    },
    montoGrande: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    categoria: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    seccion: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    valor: {
        fontSize: 16,
        marginVertical: 4,
    },
    input: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 6,
        borderWidth: 1,
        fontSize: 14,
    },
    inputMonto: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 10,
    },
    simbolo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 4,
    },
    inputNumero: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    botones: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 24,
    },
    boton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    textoBoton: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

import { TextInput } from 'react-native';
