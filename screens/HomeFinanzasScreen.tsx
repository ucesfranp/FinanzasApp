import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { useSQLiteContext } from 'expo-sqlite';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { leerPrefs } from '../services/preferencias';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { transaccionesApi } from '../services/transaccionesApi';
import { showAlert } from '../services/alertUtils';
import { Transaccion, Categoria } from './FinanzasTypes';
import BottomNav from '../components/BottomNav';

//Función de presupuesto importado de services/presupuestoUtils.ts
import { calcularResumenPresupuesto } from '../services/presupuestoUtils';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
    navigation: NavigationProp;
}

export default function HomeFinanzasScreen({ navigation }: Props) {
    const { colores } = useTema();
    const db = useSQLiteContext();
    
    const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [presupuesto, setPresupuesto] = useState(0);
    const [movimientosCargados, setMovimientosCargados] = useState(false);
    const [cargandoMovimientos, setCargandoMovimientos] = useState(false);
    const [nombre, setNombre] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    // Recargar datos cada vez que el screen recibe enfoque --> Esto es útil para reflejar cambios realizados en otras pantallas (ej: agregar transacción, cambiar nombre, etc.)
    useFocusEffect(
        React.useCallback(() => {
            cargarDatos();
            // Recargar nombre también
            leerPrefs().then(prefs => {
                if (prefs && prefs.nombre) {
                    setNombre(prefs.nombre);
                } else {
                    setNombre('');
                }
            });
            // Recargar estado del botón --> Una vez que se cargan los movimientos, el botón se oculta. Si el usuario vuelve a la pantalla, queremos mantener ese estado.
            AsyncStorage.getItem('movimientosCargados').then(estado => {
                if (estado !== null) {
                    setMovimientosCargados(JSON.parse(estado));
                } else {
                    setMovimientosCargados(false);
                }
            });
        }, [db])
    );

    const cargarDatosIniciales = async () => {
        try {
            setCargando(true);
            // Cargar estado del botón desde AsyncStorage
            const estadoBoton = await AsyncStorage.getItem('movimientosCargados');
            if (estadoBoton !== null) {
                setMovimientosCargados(JSON.parse(estadoBoton));
            }
            
            // Cargar datos de la BD
            await cargarDatos();
            
            // Cargar nombre
            const prefs = await leerPrefs();
            if (prefs && prefs.nombre) {
                setNombre(prefs.nombre);
            }
        } catch (err) {
            console.log('Error al cargar datos iniciales:', err);
        } finally {
            setCargando(false);
        }
    };

    const cargarDatos = async () => {
        try {
            //Esto es lo que aprendimos de expo SQLite: para obtener datos, no se puede usar el método "all" del DB, sino que hay que ejecutar una consulta SQL y luego mapear los resultados. Por eso hacemos tres consultas: una para transacciones, otra para categorías y otra para el presupuesto.
            const transRes = await db.getAllAsync<Transaccion>(
                'SELECT * FROM transacciones ORDER BY fecha DESC'
            );
            const catRes = await db.getAllAsync<Categoria>(
                'SELECT * FROM categorias'
            );
            const presupuestoRes = await db.getFirstAsync<{ valor: string }>(
                "SELECT valor FROM preferencias WHERE clave = 'presupuesto_mensual'"
            );
            
            setTransacciones(transRes);
            setCategorias(catRes);
            if (presupuestoRes) {
                setPresupuesto(parseFloat(presupuestoRes.valor));
            }
        } catch (err) {
            console.log('Error al cargar datos:', err);
        }
    };


    //Esta función fue tachada (debería ser borrada) porque ahora uso la función importada de services/presupuestoUtils.ts para calcular el resumen del presupuesto. La dejo comentada por si acaso, pero debería ser eliminada en el futuro.
    // Función para calcular el resumen del mes (total ingresos, total gastos, presupuesto y disponible)
    /* const obtenerResumen = () => {
        const totalIngresos = transacciones
            .filter(t => t.tipo === 'ingreso')
            .reduce((sum, t) => sum + t.monto, 0);

        const totalGastos = transacciones
            .filter(t => t.tipo === 'gasto')
            .reduce((sum, t) => sum + t.monto, 0);

        const disponible = presupuesto + totalIngresos - totalGastos;

        return {
            totalIngresos,
            totalGastos,
            presupuesto,
            disponible,
        };
    }; */

    const resumen = calcularResumenPresupuesto(transacciones, presupuesto); // Usamos la función importada de services/presupuestoUtils.ts para calcular el resumen del presupuesto.
    const ultimos5 = transacciones.slice(0, 5);

    //Esto es para cambiar el color de fondo de la tarjeta principal según el porcentaje del presupuesto disponible. Si el disponible es negativo, rojo. Si el disponible es menor al 20% del presupuesto, amarillo. Si el disponible es mayor al 20% del presupuesto, verde.
    const porcentajeColor = resumen.disponible < 0 ? '#FF6B6B' : resumen.disponible < presupuesto * 0.2 ? '#FFE66D' : '#4ECDC4';

    const handleCargarMovimientos = async () => {
        try {
            // Evitar múltiples cargas simultáneas
            setCargandoMovimientos(true);
            
            // Obtener transacciones del mockapi
            const response = await transaccionesApi.getAll();
            const datosDelAPI = response.data;
            
            // Guardar cada transacción en la BD local
            for (const transaccion of datosDelAPI) {
                try {
                    await db.runAsync(
                        `INSERT OR IGNORE INTO transacciones (descripcion, monto, tipo, categoria_id, fecha, api_id) 
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [
                            transaccion.descripcion,
                            transaccion.monto,
                            transaccion.tipo,
                            transaccion.categoria_id,
                            transaccion.fecha,
                            transaccion.id,
                        ]
                    );
                } catch (err) {
                    console.log('Error al insertar transacción:', err);
                }
            }
            
            // Recargar datos
            await cargarDatos();
            setMovimientosCargados(true);
            
            // Guardar estado en AsyncStorage
            await AsyncStorage.setItem('movimientosCargados', JSON.stringify(true));
            
        } catch (error) {
            console.log('Error al cargar movimientos:', error);
            showAlert('Error', 'No se pudieron cargar los movimientos');
        } finally {
            setCargandoMovimientos(false);
        }
    };

    return (
        <View style={[{ flex: 1, backgroundColor: colores.fondo, paddingTop: 50 }]}>
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.titulo, { color: colores.textoPrimario }]}>Mi Dinero</Text>
                    <Pressable
                        style={[styles.botonFlotante, { backgroundColor: colores.boton }]}
                        onPress={() => navigation.navigate('AgregarTransaccion')}
                    >
                        <Ionicons name="add" size={24} color="white" />
                    </Pressable>
                </View>

                {/* Tarjeta principal - Disponible */}
                <View style={[styles.tarjetaPrincipal, { backgroundColor: porcentajeColor }]}>
                    <Text style={[styles.titulo, { color: colores.textoPrimario }]}>
                        {nombre ? `¡Hola ${nombre}!` : 'Pantalla Home'} {/* Si nombre tiene algo, mostramos "¡Hola {nombre}!", sino mostramos "Pantalla Home" */}
                    </Text>
                    <Text style={styles.etiqueta}>Tu disponible de este mes</Text>
                    <Text style={styles.monto}>${resumen.disponible.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    <Text style={styles.subTexto}>
                        Presupuesto: ${presupuesto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                </View>

                {/* Alerta si supera presupuesto */}
                {/* esto lo que hace es mostrar una alerta si el disponible es negativo. El "&&" es para que se muestre solo si la condición es verdadera */}
                {resumen.disponible < 0 && (
                    <View style={[styles.alerta, { backgroundColor: 'rgba(255, 107, 107, 0.1)', borderColor: '#FF6B6B' }]}>
                        <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
                        <Text style={[styles.alertaTexto, { color: '#FF6B6B' }]}>
                            ⚠️ ¡Has superado tu presupuesto!
                        </Text>
                    </View>
                )}

                {/* Resumen del mes */}
                <View style={[styles.seccion, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}>
                    <Text style={[styles.tituloSeccion, { color: colores.textoPrimario }]}>Resumen de Mes</Text>

                    <View style={styles.resumenGrid}>
                        <View style={styles.resumenItem}>
                            <Text style={[styles.resumenLabel, { color: colores.texto }]}>Ingresos</Text>
                            <Text style={[styles.resumenMonto, { color: '#4ECDC4' }]}>
                                +${resumen.totalIngresos.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Text>
                        </View>
                        <View style={styles.resumenItem}>
                            <Text style={[styles.resumenLabel, { color: colores.texto }]}>Gastos</Text>
                            <Text style={[styles.resumenMonto, { color: '#FF6B6B' }]}>
                                -${resumen.totalGastos.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Últimos movimientos */}
                <View style={styles.seccion}>
                    <Text style={[styles.tituloSeccion, { color: colores.textoPrimario }]}>Últimos 5 Movimientos</Text>

                    {!movimientosCargados ? (
                        <Pressable
                            style={[styles.botonCargar, { backgroundColor: colores.boton }]}
                            onPress={handleCargarMovimientos}
                            disabled={cargandoMovimientos}
                        >
                            {cargandoMovimientos ? (
                                <>
                                    <ActivityIndicator size="small" color="white" />
                                    <Text style={styles.textoBotonCargar}>Cargando movimientos...</Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="download-outline" size={20} color="white" />
                                    <Text style={styles.textoBotonCargar}>Cargar últimos movimientos</Text>
                                </>
                            )}
                        </Pressable>
                    ) : (
                        <>
                            {ultimos5.length === 0 ? (
                                <Text style={[styles.textoVacio, { color: colores.texto }]}>No hay movimientos este mes</Text>
                            ) : (
                                ultimos5.map((transaccion) => (
                                    <Pressable
                                        key={transaccion.id}
                                        style={[styles.movimiento, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}
                                        onPress={() => navigation.navigate('DetalleTransaccion', { id: transaccion.id })}
                                    >
                                        <View style={styles.movimientoInfo}>
                                            <Text style={[styles.movimientoDesc, { color: colores.texto }]}>
                                                {transaccion.descripcion}
                                            </Text>
                                            <Text style={[styles.movimientoFecha, { color: colores.texto, opacity: 0.6 }]}>
                                                {transaccion.fecha.split('T')[0]}
                                            </Text>
                                        </View>
                                        <Text style={[
                                            styles.movimientoMonto,
                                            { color: transaccion.tipo === 'ingreso' ? '#4ECDC4' : '#FF6B6B' }
                                        ]}>
                                            {transaccion.tipo === 'ingreso' ? '+' : '-'}${transaccion.monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </Text>
                                    </Pressable>
                                ))
                            )}
                        </>
                    )}
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>
            <BottomNav current="Home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 22,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    botonFlotante: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tarjetaPrincipal: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        alignItems: 'center',
    },
    etiqueta: {
        color: 'white',
        fontSize: 14,
        opacity: 0.8,
    },
    monto: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    subTexto: {
        color: 'white',
        fontSize: 12,
        opacity: 0.7,
    },
    alerta: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 16,
    },
    alertaTexto: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    seccion: {
        marginBottom: 20,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    tituloSeccion: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    resumenGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    resumenItem: {
        alignItems: 'center',
    },
    resumenLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    resumenMonto: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressTexto: {
        fontSize: 12,
        textAlign: 'right',
    },
    textoVacio: {
        textAlign: 'center',
        fontSize: 14,
        marginVertical: 20,
    },
    movimiento: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
    },
    movimientoInfo: {
        flex: 1,
    },
    movimientoDesc: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    movimientoFecha: {
        fontSize: 12,
    },
    movimientoMonto: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    botonCargar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 8,
        gap: 8,
    },
    textoBotonCargar: {
        color: 'white',
        fontSize: 16,
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
});