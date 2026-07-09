import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Transaccion, Categoria } from './FinanzasTypes';
import BottomNav from '../components/BottomNav';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Movimientos'>;

interface Props {
    navigation: NavigationProp;
}

export default function MovimientosScreen({ navigation }: Props) {
    const { colores } = useTema();
    const db = useSQLiteContext();
    
    const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState<number | null>(null);
    const [filtroTipo, setFiltroTipo] = useState<'todos' | 'gasto' | 'ingreso'>('todos');
    const [refrescando, setRefrescando] = useState(false);
    const [cargando, setCargando] = useState(true);

    // Cargar datos al montar el screen. Esta metido dentro del useEffect para evitar que se ejecute cada vez que se actualice el estado de busqueda o filtros, lo cual causaria un loop infinito de renderizados. El useFocusEffect se encarga de recargar los datos cada vez que el screen recibe foco, lo cual es util para reflejar cambios realizados en otros screens (como agregar o editar transacciones) sin necesidad de recargar manualmente.
    useEffect(() => {
        cargarDatos();
    }, []);

    // Recargar datos cada vez que el screen recibe enfoque, lo cual es útil para reflejar cambios realizados en otros screens (como agregar o editar transacciones) sin necesidad de recargar manualmente. El useFocusEffect se encarga de ejecutar la función cada vez que el screen recibe foco, y el React.useCallback evita que se cree una nueva función en cada renderizado, lo cual optimiza el rendimiento.
    useFocusEffect(
        React.useCallback(() => {
            cargarDatos();
        }, [])
    );

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const transRes = await db.getAllAsync<Transaccion>(
                'SELECT * FROM transacciones ORDER BY fecha DESC'
            );
            const catRes = await db.getAllAsync<Categoria>(
                'SELECT * FROM categorias'
            );
            setTransacciones(transRes);
            setCategorias(catRes);
        } catch (err) {
            console.log('Error al cargar datos:', err);
        } finally {
            setCargando(false);
        }
    };


    const transaccionesFiltradas = transacciones.filter(t => {
        const coincideBusqueda = t.descripcion.toLowerCase().includes(busqueda.toLowerCase());
        const coincideTipo = filtroTipo === 'todos' || t.tipo === filtroTipo;

        return coincideBusqueda && coincideTipo;
    });

    const handleRefresh = async () => {
        setRefrescando(true);
        await cargarDatos();
        setRefrescando(false);
    };

    const obtenerColorCategoria = (categoriaId: number): string => {
        const cat = categorias.find(c => c.id === categoriaId);
        return cat?.color || '#C7CEEA';
    };

    const obtenerNombreCategoria = (categoriaId: number): string => {
        const cat = categorias.find(c => c.id === categoriaId);
        return cat?.nombre || 'Sin categoría';
    };

    return (
        <View style={[styles.container, { backgroundColor: colores.fondo, paddingTop: 50 }]}>
            
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.titulo, { color: colores.textoPrimario }]}>Movimientos</Text>
                <Pressable
                    style={[styles.botonAgregar, { backgroundColor: colores.boton }]}
                    onPress={() => navigation.navigate('AgregarTransaccion')}
                >
                    <Ionicons name="add" size={24} color="white" />
                </Pressable>
            </View>

            {/* Búsqueda de movimientos */}
            <View style={[styles.buscador, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}>
                <Ionicons name="search" size={18} color={colores.texto} style={{ marginRight: 8 }} />
                <TextInput
                    placeholder="Buscar movimiento..."
                    placeholderTextColor={colores.texto}
                    style={[styles.input, { color: colores.texto }]}
                    value={busqueda}
                    onChangeText={setBusqueda}
                />
            </View>

            {/* Filtros */}
            <View style={[styles.filtros, {justifyContent: 'center', alignItems: 'center'}]}>
                {/* Botón "Todos" */}
                <Pressable style={[styles.botonFiltro, filtroTipo === 'todos' && { backgroundColor: '#E5E7EB' }]}
                    onPress={() => setFiltroTipo('todos')}>
                    <Text style={[styles.textoFiltro, filtroTipo === 'todos' && { color: 'black', fontWeight: 'bold' }]}>
                        Todos
                    </Text>
                </Pressable>

                {/* Botón "Ingresos" */}
                <Pressable style={[styles.botonFiltro, filtroTipo === 'ingreso' && { backgroundColor: '#4dce7f' }]}
                    onPress={() => setFiltroTipo('ingreso')}>
                    <Text style={[styles.textoFiltro, filtroTipo === 'ingreso' && { color: 'white', fontWeight: 'bold' }]}>
                        Ingresos
                    </Text>
                </Pressable>

                {/* Botón "Gastos" */}
                <Pressable style={[styles.botonFiltro, filtroTipo === 'gasto' && { backgroundColor: '#FF6B6B' }]}
                    onPress={() => setFiltroTipo('gasto')}>
                    <Text style={[styles.textoFiltro, filtroTipo === 'gasto' && { color: 'white', fontWeight: 'bold' }]}>
                        Gastos
                    </Text>
                </Pressable>

            </View>

            {/* Lista de movimientos */}
            {transaccionesFiltradas.length === 0 ? (
                <View style={styles.vacio}>
                    <Ionicons name="list-outline" size={48} color={colores.texto} style={{ opacity: 0.3 }} />
                    <Text style={[styles.textoVacio, { color: colores.texto }]}>
                        No hay movimientos para mostrar
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={transaccionesFiltradas}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        /* Tarjetas del detalle de la transaccion --> es un botón */
                        <Pressable style={[styles.itemMovimiento, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}
                            onPress={() => navigation.navigate('DetalleTransaccion', { id: item.id })}
                        >
                            <View style={[styles.iconoCategoria, { backgroundColor: obtenerColorCategoria(item.categoria_id) }]}>
                                <Text style={styles.textoIcono}>
                                    {item.tipo === 'ingreso' ? '↘' : '↗'}
                                </Text>
                            </View>
                            <View style={styles.infoMovimiento}>
                                <Text style={[styles.descripcion, { color: colores.texto }]}>
                                    {item.descripcion}
                                </Text>
                                <Text style={[styles.categoria, { color: colores.texto, opacity: 0.6 }]}>
                                    {obtenerNombreCategoria(item.categoria_id)} • {item.fecha.split('T')[0]}
                                </Text>
                            </View>
                            <Text style={[styles.monto, { color: item.tipo === 'ingreso' ? '#4dce7f' : '#FF6B6B' }]}>
                                {item.tipo === 'ingreso' ? '+' : '-'}${item.monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Text>
                        </Pressable>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refrescando}
                            onRefresh={handleRefresh}
                            tintColor={colores.textoPrimario}
                        />
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
            <BottomNav current="Movimientos" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    botonAgregar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buscador: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 14,
    },
    filtros: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 8, // espaciado entre botones
        justifyContent: 'center',
        alignItems: 'center',
    },
    botonFiltro: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ccc',
        //los achicamos verticalmente
        height: 50,
        //Alineamos su contenido al centro
        justifyContent: 'center',
    },
    textoFiltro: {
        fontSize: 13,
        color: '#666',
    },
    itemMovimiento: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 8,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    iconoCategoria: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textoIcono: {
        fontSize: 18,
    },
    infoMovimiento: {
        flex: 1,
    },
    descripcion: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    categoria: {
        fontSize: 12,
    },
    monto: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    vacio: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoVacio: {
        fontSize: 16,
        marginTop: 12,
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
