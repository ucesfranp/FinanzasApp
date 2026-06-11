import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { useSQLiteContext } from 'expo-sqlite';
import { useState, useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { NavigationProp } from '@react-navigation/native';
import { guardarPrefs, leerPrefs } from "../services/preferencias";
import { showAlert } from '../services/alertUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaccion, Categoria } from './FinanzasTypes';

type Props = {
    navigation: NavigationProp<RootStackParamList>;
};

export default function AjustesFinanzasScreen({ navigation }: Props) {
    const { colores } = useTema();
    const db = useSQLiteContext();

    const [presupuesto, setPresupuesto] = useState(5000);
    const [presupuestoNuevo, setPresupuestoNuevo] = useState('5000');
    const [editandoPresupuesto, setEditandoPresupuesto] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [oscuro, setOscuro] = useState(false);
    const [nombre, setNombre] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const presupuestoRes = await db.getFirstAsync<{ valor: string }>(
                "SELECT valor FROM preferencias WHERE clave = 'presupuesto_mensual'"
            );
            if (presupuestoRes) {
                const val = parseFloat(presupuestoRes.valor);
                setPresupuesto(val);
                setPresupuestoNuevo(val.toString());
            }
            
            const prefs = await leerPrefs();
            if (prefs && prefs.nombre) {
                setNombre(prefs.nombre);
            }
        } catch (err) {
            console.log('Error al cargar datos:', err);
        } finally {
            setCargando(false);
        }
    };

    const handleGuardarPresupuesto = async () => {
        const monto = parseFloat(presupuestoNuevo);
        if (isNaN(monto) || monto <= 0) {
            showAlert('Error', 'Por favor ingresa un monto válido');
            return;
        }

        try {
            setGuardando(true);
            await db.runAsync(
                "INSERT OR REPLACE INTO preferencias (clave, valor) VALUES ('presupuesto_mensual', ?)",
                [monto.toString()]
            );
            setPresupuesto(monto);
            showAlert('Éxito', 'Presupuesto actualizado');
            setEditandoPresupuesto(false);
        } catch (err) {
            showAlert('Error', 'No se pudo actualizar el presupuesto');
        } finally {
            setGuardando(false);
        }
    };

    const handleCancelarPresupuesto = () => {
        setPresupuestoNuevo(presupuesto.toString());
        setEditandoPresupuesto(false);
    };

    async function handleNombre(text: string) {
        setNombre(text);
        await guardarPrefs({ nombre: text, temaOscuro: oscuro } as any);
    }

    /* Metodo para el botón de resetear de fabrico */
    const handleResetearAplicacion = () => {
        showAlert(
            'Confirmar',
            '¿Estás seguro de que quieres resetear la aplicación? Se eliminarán todas tus transacciones y ajustes.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Resetear',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            /* Eliminamos el nombre ingresado, el presupuesto ingresado, las categorías ingresadas y los movimientos ingresados */
                            await guardarPrefs({ nombre: '', temaOscuro: false } as any);
                            
                            // Resetear presupuesto a 5000 (valor por defecto)
                            await db.runAsync(
                                "INSERT OR REPLACE INTO preferencias (clave, valor) VALUES ('presupuesto_mensual', ?)",
                                ['5000']
                            );
                            
                            // Eliminar todas las transacciones
                            await db.runAsync('DELETE FROM transacciones');
                            
                            // Eliminar solo las categorías creadas por el usuario
                            const CATEGORIAS_PREDEFINIDAS_NOMBRES = ['Alimentos', 'Transporte', 'Entretenimiento', 'Servicios', 'Salud', 'Otros'];
                            const categorias = await db.getAllAsync<Categoria>('SELECT * FROM categorias');
                            
                            for (const categoria of categorias) {
                                if (!CATEGORIAS_PREDEFINIDAS_NOMBRES.includes(categoria.nombre)) {
                                    await db.runAsync('DELETE FROM categorias WHERE id = ?', [categoria.id]);
                                }
                            }
                            
                    // Resetear estado del botón de movimientos cargados
                            await AsyncStorage.setItem('movimientosCargados', JSON.stringify(false));
                            
                            // Actualizar estado local
                            setPresupuesto(5000);
                            setPresupuestoNuevo('5000');
                            setNombre('');
                            
                            // En web, recargar la página fuerza que todos los estados se reinicien correctamente
                            if (typeof window !== 'undefined' && window.location) {
                                window.alert('Éxito\nAplicación reseteada');
                                window.location.reload();
                            } else {
                                showAlert('Éxito', 'Aplicación reseteada');
                                // Pequeño delay para asegurar que la BD se actualice completamente
                                await new Promise(resolve => setTimeout(resolve, 500));
                                navigation.navigate('Home');
                            }
                        } catch (error) {
                            showAlert('Error', 'No se pudieron resetear las preferencias');
                        }
                    }
                }
            ]
        );
    };


    return (
        <View style={[{ flex: 1, backgroundColor: colores.fondo, paddingTop: 50 }]}>
            
            {/* Botones de navegación */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
                <Pressable
                    style={[styles.boton, { marginTop: 20, backgroundColor: colores.boton }]}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.botonTxt}>Home</Text>
                </Pressable>
                <Pressable
                    style={[styles.boton, { marginTop: 20, backgroundColor: colores.boton }]}
                    onPress={() => navigation.navigate('Movimientos')}
                >
                    <Text style={styles.botonTxt}>Movimientos</Text>
                </Pressable>
                <Pressable
                    style={[styles.boton, { marginTop: 20, backgroundColor: colores.boton }]}
                    onPress={() => navigation.navigate('Ajustes')}
                >
                    <Text style={styles.botonTxt}>Ajustes</Text>
                </Pressable>
            </View>


            <ScrollView style={[styles.container, { backgroundColor: colores.fondo }]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.titulo, { color: colores.textoPrimario }]}>Ajustes</Text>
                </View>

                {/* Sección del Input Nombre */}
                <View style={[styles.seccion, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}>
                    <Text style={[styles.tituloSeccion, { color: colores.textoPrimario }]}>Nombre</Text>
                    <TextInput
                        style={[styles.input, { borderColor: colores.inputBorder, backgroundColor: colores.inputBg, color: colores.texto }]}
                        value={nombre}
                        onChangeText={handleNombre}
                        placeholder="Ingresa tu nombre"
                        placeholderTextColor={oscuro ? '#999' : '#666'}
                    />
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
                                    style={[styles.inputNumero, { color: colores.texto }]}
                                    value={presupuestoNuevo}
                                    onChangeText={setPresupuestoNuevo}
                                    /* keyboardType="decimal-pad" /* esto es para que aparezca el teclado con el punto decimal */ 
                                    editable={!guardando}
                                />
                            </View>

                            {/* Botones para guardar o cancelar */}
                            <View style={[styles.botonesMonto, { marginTop: 12 }]}>
                                <Pressable style={[styles.botonMonto, { backgroundColor: colores.inputBorder }]}
                                    onPress={handleCancelarPresupuesto}
                                    disabled={guardando}>
                                    <Text style={[styles.textoBotonMonto, { color: colores.texto }]}>Cancelar</Text>
                                </Pressable>

                                <Pressable style={[styles.botonMonto, { backgroundColor: colores.boton }]}
                                    onPress={handleGuardarPresupuesto}
                                    disabled={guardando}>
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

                    {/* Botón para resetear la aplicación */}
                    <Pressable style={styles.botonReset} onPress={handleResetearAplicacion}>
                        <Ionicons name="trash" size={20} color={colores.texto} />
                        <View>
                            <Text style={[styles.etiqueta, { color: colores.texto }]}>Resetear aplicación</Text>
                            <Text style={[styles.descripcion, { color: colores.texto, opacity: 0.6 }]}>
                                Elimina todos los datos y preferencias
                            </Text>
                        </View>
                    </Pressable>
                </View>

                
                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
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
    boton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    botonTxt: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    label: { fontSize: 16, marginBottom: 8 },
    input: { borderWidth: 1, padding: 8, borderRadius: 4, marginBottom: 16 },
    botonReset: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,        borderWidth: 1,
        borderColor: 'transparent',
        marginTop: 12,
        gap: 20,
        /* Color de fondo rojo */
        backgroundColor: '#ff6d6d',
    },
});