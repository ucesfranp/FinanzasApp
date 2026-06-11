import { View, Text, StyleSheet, Pressable, ScrollView, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { useSQLiteContext } from 'expo-sqlite';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { Transaccion, Categoria } from './FinanzasTypes';
import { showAlert } from '../services/alertUtils';
import { transaccionesApi } from '../services/transaccionesApi';

export default function DetalleTransaccionScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { colores } = useTema();
    const db = useSQLiteContext();

    const transaccionId = (route.params as any)?.id;
    
    const [transaccion, setTransaccion] = useState<Transaccion | null>(null);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [editando, setEditando] = useState(false);
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const transRes = await db.getFirstAsync<Transaccion>(
                'SELECT * FROM transacciones WHERE id = ?',
                [transaccionId]
            );
            const catRes = await db.getAllAsync<Categoria>(
                'SELECT * FROM categorias'
            );
            if (transRes) {
                setTransaccion(transRes);
                setDescripcion(transRes.descripcion);
                setMonto(transRes.monto.toString());
            }
            setCategorias(catRes);
        } catch (err) {
            console.log('Error al cargar datos:', err);
        } finally {
            setCargando(false);
        }
    };

    if (cargando || !transaccion) {
        return (
            <View style={[styles.container, { backgroundColor: colores.fondo, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={[styles.tituloVacio, { color: colores.texto }]}>
                    {cargando ? 'Cargando...' : 'No encontrado'}
                </Text>
            </View>
        );
    }

    const categoria = categorias.find(c => c.id === transaccion.categoria_id);

    const handleGuardar = async () => {
        if (!descripcion.trim()) {
            showAlert('Error', 'La descripción no puede estar vacía');
            return;
        }

        const montoNum = parseFloat(monto);
        if (isNaN(montoNum) || montoNum <= 0) {
           showAlert('Error', 'Ingresa un monto válido');
            return;
        }

        try {
            setGuardando(true);
            
            // Actualizar en BD local
            await db.runAsync(
                `UPDATE transacciones SET descripcion = ?, monto = ?, tipo = ?, categoria_id = ?, fecha = ? 
                 WHERE id = ?`,
                [descripcion.trim(), montoNum, transaccion.tipo, transaccion.categoria_id, transaccion.fecha, transaccion.id]
            );
            
            // Sincronizar con mockAPI (sin bloquear)
            if (transaccion.api_id) {
                const transaccionActualizada = {
                    descripcion: descripcion.trim(),
                    monto: montoNum,
                    tipo: transaccion.tipo,
                    categoria_id: transaccion.categoria_id,
                    fecha: transaccion.fecha,
                    api_id: transaccion.api_id,
                };
                transaccionesApi.update(transaccion.api_id, transaccionActualizada).catch(err => {
                    console.log('Error al sincronizar con mockAPI:', err);
                });
            }
            
            showAlert('Éxito', 'Transacción actualizada');
            setEditando(false);
            await cargarDatos();
        } catch (err) {
            showAlert('Error', 'No se pudo actualizar');
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
                            // Obtener api_id antes de eliminar
                            const apiId = transaccion.api_id;
                            
                            // Eliminar de BD local
                            await db.runAsync('DELETE FROM transacciones WHERE id = ?', [transaccion.id]);
                            
                            // Sincronizar con mockAPI (sin bloquear)
                            if (apiId) {
                                transaccionesApi.remove(apiId).catch(err => {
                                    console.log('Error al sincronizar eliminación con mockAPI:', err);
                                });
                            }
                            
                            showAlert('Éxito', 'Transacción eliminada');
                            navigation.goBack();
                        } catch (err) {
                            showAlert('Error', 'No se pudo eliminar');
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

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

            {/* Descripción */}
            <View style={[styles.seccion, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}>
                <Text style={[styles.label, { color: colores.textoPrimario }]}>Descripción</Text>
                {editando ? (
                    <TextInput
                        style={[styles.input, { backgroundColor: colores.fondo, borderColor: colores.inputBorder, color: colores.texto }]}
                        value={descripcion}
                        onChangeText={setDescripcion}
                        editable={!guardando}
                    />
                ) : (
                    <Text style={[styles.valor, { color: colores.texto }]}>{transaccion.descripcion}</Text>
                )}
            </View>

            {/* Monto */}
            <View style={[styles.seccion, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}>
                <Text style={[styles.label, { color: colores.textoPrimario }]}>Monto</Text>
                {editando ? (
                    <View style={[styles.inputMonto, { borderColor: colores.inputBorder }]}>
                        <Text style={[styles.simbolo, { color: colores.texto }]}>$</Text>
                        <TextInput
                            style={[styles.inputNumero, { color: colores.texto }]}
                            value={monto}
                            onChangeText={setMonto}
                            keyboardType="decimal-pad"
                            editable={!guardando}
                        />
                    </View>
                ) : (
                    <Text style={[styles.valor, { color: colores.texto }]}>$ {transaccion.monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                )}
            </View>

            <View style={[styles.seccion, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}>
                <Text style={[styles.label, { color: colores.textoPrimario }]}>Fecha</Text>
                <Text style={[styles.valor, { color: colores.texto }]}>{transaccion.fecha}</Text>
            </View>

            {/* Botones */}
            <View style={styles.botones}>
                {!editando ? (
                    <>
                        <Pressable style={[styles.boton, { backgroundColor: colores.boton }]}
                            onPress={() => setEditando(true)}
                        >
                            <Ionicons name="pencil" size={18} color="white" />
                            <Text style={styles.textoBoton}>Editar</Text>
                        </Pressable>

                        <Pressable style={[styles.boton, { backgroundColor: '#FF6B6B' }]}
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

            {/* Vamos a agregar un botón para volver a la pantalla de movimientos */}
            <View style={{ alignItems: 'center' }}>
                <Pressable style={[styles.boton, { backgroundColor: colores.inputBorder, marginTop: 20, width: '40%' }]} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={18} color={colores.texto} />
                    <Text style={[styles.textoBoton, { color: colores.texto }]}>Volver</Text>
                </Pressable>
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
