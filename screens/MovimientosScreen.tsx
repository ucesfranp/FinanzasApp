import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { useFinanzas } from '../context/FinanzasContext';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Transaccion } from './FinanzasTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Movimientos'>;

interface Props {
    navigation: NavigationProp;
}

export default function MovimientosScreen({ navigation }: Props) {
    const { colores } = useTema();
    const { transacciones, categorias, sincronizar } = useFinanzas();
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState<number | null>(null);
    const [filtroTipo, setFiltroTipo] = useState<'todos' | 'gasto' | 'ingreso'>('todos');
    const [refrescando, setRefrescando] = useState(false);

    const transaccionesFiltradas = transacciones.filter(t => {
        const coincideBusqueda = t.descripcion.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = filtroCategoria === null || t.categoria_id === filtroCategoria;
        const coincideTipo = filtroTipo === 'todos' || t.tipo === filtroTipo;

        return coincideBusqueda && coincideCategoria && coincideTipo;
    });

    const handleRefresh = async () => {
        setRefrescando(true);
        await sincronizar();
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
                    onPress={() => navigation.navigate('Categorias')}
                >
                    <Text style={styles.botonTxt}>Categorias</Text>
                </Pressable>
                <Pressable
                    style={[styles.boton, { marginTop: 20, backgroundColor: colores.boton }]}
                    onPress={() => navigation.navigate('Ajustes')}
                >
                    <Text style={styles.botonTxt}>Ajustes</Text>
                </Pressable>
            </View>



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

            {/* Búsqueda */}
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
            <View
                style={[
                    styles.filtros,
                    {
                        justifyContent: 'center',
                        alignItems: 'center'
                    }
                ]}
            >
                <Pressable
                    style={[
                        styles.botonFiltro,
                        filtroTipo === 'todos' && { backgroundColor: colores.textoPrimario }
                    ]}
                    onPress={() => setFiltroTipo('todos')}
                >
                    <Text style={[
                        styles.textoFiltro,
                        filtroTipo === 'todos' && { color: 'white', fontWeight: 'bold' }
                    ]}>
                        Todos
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.botonFiltro,
                        filtroTipo === 'ingreso' && { backgroundColor: '#4ECDC4' }
                    ]}
                    onPress={() => setFiltroTipo('ingreso')}
                >
                    <Text style={[
                        styles.textoFiltro,
                        filtroTipo === 'ingreso' && { color: 'white', fontWeight: 'bold' }
                    ]}>
                        Ingresos
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.botonFiltro,
                        filtroTipo === 'gasto' && { backgroundColor: '#FF6B6B' }
                    ]}
                    onPress={() => setFiltroTipo('gasto')}
                >
                    <Text style={[
                        styles.textoFiltro,
                        filtroTipo === 'gasto' && { color: 'white', fontWeight: 'bold' }
                    ]}>
                        Gastos
                    </Text>
                </Pressable>

                {filtroCategoria !== null && (
                    <Pressable
                        style={[
                            styles.botonFiltro,
                            { backgroundColor: obtenerColorCategoria(filtroCategoria), opacity: 0.8 }
                        ]}
                        onPress={() => setFiltroCategoria(null)}
                    >
                        <Text style={[styles.textoFiltro, { color: 'white', fontWeight: 'bold' }]}>
                            ✕ {obtenerNombreCategoria(filtroCategoria)}
                        </Text>
                    </Pressable>
                )}
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
                        <Pressable
                            style={[
                                styles.itemMovimiento,
                                { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }
                            ]}
                            onPress={() => navigation.navigate('DetalleTransaccion', { id: item.id })}
                        >
                            <View style={[
                                styles.iconoCategoria,
                                { backgroundColor: obtenerColorCategoria(item.categoria_id) }
                            ]}>
                                <Text style={styles.textoIcono}>
                                    {item.tipo === 'ingreso' ? '📥' : '📤'}
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
                            <Text style={[
                                styles.monto,
                                { color: item.tipo === 'ingreso' ? '#4ECDC4' : '#FF6B6B' }
                            ]}>
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
