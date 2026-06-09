import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { useFinanzas } from '../context/FinanzasContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { showAlert } from '../services/alertUtils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Categorias'>;

interface Props {
    navigation: NavigationProp;
}

export default function CategoriasScreen({ navigation }: Props) {
    const { colores } = useTema();
    const { categorias, eliminarCategoria } = useFinanzas();

    const handleEliminar = (id: number, nombre: string) => {
        showAlert(
            'Eliminar categoría',
            `¿Estás seguro de que quieres eliminar "${nombre}"?`,
            [
                { text: 'Cancelar', onPress: () => { } },
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        try {
                            await eliminarCategoria(id);
                            Alert.alert('Éxito', 'Categoría eliminada');
                        } catch (err) {
                            Alert.alert('Error', 'No se pudo eliminar la categoría');
                        }
                    },
                    style: 'destructive',
                },
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


            <View style={[styles.container, { backgroundColor: colores.fondo }]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.titulo, { color: colores.textoPrimario }]}>Categorías</Text>
                    <Pressable
                        style={[styles.botonAgregar, { backgroundColor: colores.boton }]}
                        onPress={() => navigation.navigate('AgregarCategoria')}
                    >
                        <Ionicons name="add" size={24} color="white" />
                    </Pressable>
                </View>

                {/* Lista de categorías */}
                {categorias.length === 0 ? (
                    <View style={styles.vacio}>
                        <Ionicons name="pricetag-outline" size={48} color={colores.texto} style={{ opacity: 0.3 }} />
                        <Text style={[styles.textoVacio, { color: colores.texto }]}>
                            No hay categorías
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={categorias}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={[
                                styles.itemCategoria,
                                { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }
                            ]}>
                                <View
                                    style={[
                                        styles.colorBox,
                                        { backgroundColor: item.color }
                                    ]}
                                />
                                <Text style={[styles.nombre, { color: colores.texto }]}>
                                    {item.nombre}
                                </Text>
                                <View style={styles.botones}>
                                    <Pressable
                                        style={[styles.botonAccion, { backgroundColor: colores.boton }]}
                                        onPress={() => navigation.navigate('EditarCategoria', { id: item.id })}
                                    >
                                        <Ionicons name="pencil" size={16} color="white" />
                                    </Pressable>
                                    <Pressable
                                        style={[styles.botonAccion, { backgroundColor: '#FF6B6B' }]}
                                        onPress={() => handleEliminar(item.id, item.nombre)}
                                    >
                                        <Ionicons name="trash" size={16} color="white" />
                                    </Pressable>
                                </View>
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    itemCategoria: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 8,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    colorBox: {
        width: 32,
        height: 32,
        borderRadius: 6,
        marginRight: 12,
    },
    nombre: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    botones: {
        flexDirection: 'row',
        gap: 8,
    },
    botonAccion: {
        width: 36,
        height: 36,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
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
