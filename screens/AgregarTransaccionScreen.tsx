import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { useFinanzas } from '../context/FinanzasContext';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getCurrentDateString } from '../services/dateUtils';
import { showAlert } from '../services/alertUtils';

type AgregarStackParamList = {
    AgregarTransaccion: undefined;
};

type NavigationProp = NativeStackNavigationProp<AgregarStackParamList, 'AgregarTransaccion'>;

interface Props {
    navigation: NavigationProp;
}

export default function AgregarTransaccionScreen({ navigation }: Props) {
    const { colores } = useTema();
    const { categorias, agregarTransaccion } = useFinanzas();
    
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [tipo, setTipo] = useState<'gasto' | 'ingreso'>('gasto');
    const [categoriaId, setCategoriaId] = useState<number>(categorias[0]?.id || 1);
    const [guardando, setGuardando] = useState(false);

    /* Función para guardar la transacción */
    const handleGuardar = async () => {
        if (!descripcion.trim()) {
            /* Para que salte el alert debemos hacer */
            showAlert('Error', 'Por favor ingresa una descripción');
            return;
        }

        if (!monto.trim()) {
            showAlert('Error', 'Por favor ingresa un monto');
            return;
        }

        const montoNum = parseFloat(monto);
        if (isNaN(montoNum) || montoNum <= 0) {
            showAlert('Error', 'Por favor ingresa un monto válido');
            return;
        }

        try {
            setGuardando(true);
            await agregarTransaccion({
                descripcion: descripcion.trim(),
                monto: montoNum,
                tipo,
                categoria_id: categoriaId,
                fecha: getCurrentDateString(),
            });

            showAlert('Éxito', 'Transacción guardada');
            navigation.goBack();
        } catch (err) {
            showAlert('Error', 'No se pudo guardar la transacción');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colores.fondo, paddingTop: 70 }]}>
            {/* Tipo de transacción */}
            <View style={styles.seccion}>
                <Text style={[styles.label, { color: colores.textoPrimario }]}>Tipo de movimiento</Text>
                <View style={styles.botonesTipo}>
                    {/* Botones para seleccionar el tipo de transacción */}
                    <Pressable style={[styles.botonTipo, tipo === 'gasto' && { backgroundColor: '#FF6B6B' }, { borderColor: colores.inputBorder }]}
                        onPress={() => setTipo('gasto')}>
                        <Ionicons name="arrow-up" size={20} color={tipo === 'gasto' ? 'white' : colores.texto} />
                        <Text style={[styles.textoBotonTipo, tipo === 'gasto' && { color: 'white' }]}>
                            Gasto
                        </Text>
                    </Pressable>

                    <Pressable style={[styles.botonTipo, tipo === 'ingreso' && { backgroundColor: '#4dce7f' }, { borderColor: colores.inputBorder }]}
                        onPress={() => setTipo('ingreso')}>
                        <Ionicons name="arrow-down" size={20} color={tipo === 'ingreso' ? 'white' : colores.texto} />
                        <Text style={[styles.textoBotonTipo, tipo === 'ingreso' && { color: 'white' }]}>
                            Ingreso
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Input Descripción */}
            <View style={styles.seccion}>
                <Text style={[styles.label, { color: colores.textoPrimario }]}>Descripción</Text>
                <TextInput
                    placeholder="Ej: Compra en supermercado"
                    placeholderTextColor={colores.texto}
                    style={[styles.input, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder, color: colores.texto }]}
                    value={descripcion}
                    onChangeText={setDescripcion}
                    editable={!guardando}
                />
            </View>

            {/* Input Monto */}
            <View style={styles.seccion}>
                <Text style={[styles.label, { color: colores.textoPrimario }]}>Monto</Text>
                <View style={[styles.inputMonto, { borderColor: colores.inputBorder }]}>
                    <Text style={[styles.simbolo, { color: colores.texto }]}>$</Text>
                    <TextInput
                        placeholder="0.00"
                        placeholderTextColor={colores.texto}
                        style={[styles.inputNumero,{ color: colores.texto }]}
                        value={monto}
                        onChangeText={setMonto}
                        keyboardType="decimal-pad"
                        editable={!guardando}
                    />
                </View>
            </View>

            {/* Selección de Categoría */}
            <View style={styles.seccion}>
                <Text style={[styles.label, { color: colores.textoPrimario }]}>Categoría</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasScroll}>
                    {categorias.map((cat) => (
                        <Pressable
                            key={cat.id}
                            style={[styles.botonCategoria, categoriaId === cat.id && { borderWidth: 2, borderColor: colores.textoPrimario }, { backgroundColor: cat.color }]}
                            onPress={() => setCategoriaId(cat.id)}
                            disabled={guardando}
                        >
                            <Text style={styles.textoCategoria}>{cat.nombre}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Botones para cancelar o guardar el movimiento realizado */}
            <View style={styles.botones}>
                <Pressable 
                    style={[styles.botonCancelar, { borderColor: colores.inputBorder }]}
                    onPress={() => navigation.goBack()}
                    disabled={guardando}
                >
                    <Text style={[styles.textoBotonCancelar, { color: colores.texto }]}>Cancelar</Text>
                </Pressable>

                <Pressable 
                    style={[styles.botonGuardar, { backgroundColor: colores.boton }]}
                    onPress={handleGuardar}
                    disabled={guardando}
                >
                    <Ionicons name={guardando ? "hourglass" : "checkmark"} size={18} color="white" />
                    <Text style={styles.textoBotonGuardar}>
                        {guardando ? 'Guardando...' : 'Guardar'}
                    </Text>
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
    seccion: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    botonesTipo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    botonTipo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginHorizontal: 4,
    },
    textoBotonTipo: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },
    input: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 14,
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
    categoriasScroll: {
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    botonCategoria: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    textoCategoria: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13,
    },
    botones: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 20,
    },
    botonCancelar: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoBotonCancelar: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    botonGuardar: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoBotonGuardar: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 6,
    },
});
