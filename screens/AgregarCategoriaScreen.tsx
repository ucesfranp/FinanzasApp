import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { useTema } from '../context/TemaContext';
import { useFinanzas } from '../context/FinanzasContext';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AgregarCategoriaStackParamList = {
    AgregarCategoria: undefined;
};

type NavigationProp = NativeStackNavigationProp<AgregarCategoriaStackParamList, 'AgregarCategoria'>;

interface Props {
    navigation: NavigationProp;
}

const COLORES_DISPONIBLES = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', 
    '#FF8C94', '#C7CEEA', '#FDDB92', '#A8E6CF',
    '#FFD3B6', '#FFAAA5', '#AA96DA', '#FCBAD3'
];

export default function AgregarCategoriaScreen({ navigation }: Props) {
    const { colores } = useTema();
    const { agregarCategoria } = useFinanzas();
    
    const [nombre, setNombre] = useState('');
    const [colorSeleccionado, setColorSeleccionado] = useState(COLORES_DISPONIBLES[0]);
    const [guardando, setGuardando] = useState(false);

    const handleGuardar = async () => {
        if (!nombre.trim()) {
            Alert.alert('Error', 'Por favor ingresa un nombre para la categoría');
            return;
        }

        try {
            setGuardando(true);
            await agregarCategoria({
                nombre: nombre.trim(),
                color: colorSeleccionado,
            });

            Alert.alert('Éxito', 'Categoría creada');
            navigation.goBack();
        } catch (err: any) {
            if (err.message.includes('UNIQUE')) {
                Alert.alert('Error', 'Esta categoría ya existe');
            } else {
                Alert.alert('Error', 'No se pudo crear la categoría');
            }
        } finally {
            setGuardando(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colores.fondo }]}>
            {/* Nombre */}
            <View style={styles.seccion}>
                <Text style={[styles.label, { color: colores.textoPrimario }]}>Nombre</Text>
                <TextInput
                    placeholder="Ej: Café"
                    placeholderTextColor={colores.texto}
                    style={[
                        styles.input,
                        { backgroundColor: colores.inputBg, borderColor: colores.inputBorder, color: colores.texto }
                    ]}
                    value={nombre}
                    onChangeText={setNombre}
                    editable={!guardando}
                />
            </View>

            {/* Color */}
            <View style={styles.seccion}>
                <Text style={[styles.label, { color: colores.textoPrimario }]}>Color</Text>
                
                {/* Preview */}
                <View style={[
                    styles.preview,
                    { backgroundColor: colorSeleccionado }
                ]}>
                    <Text style={styles.previewTexto}>Vista previa</Text>
                </View>

                {/* Selector de colores */}
                <View style={styles.selectoreColores}>
                    {COLORES_DISPONIBLES.map((color) => (
                        <Pressable
                            key={color}
                            style={[
                                styles.botonColor,
                                { backgroundColor: color },
                                colorSeleccionado === color && { borderWidth: 3, borderColor: colores.textoPrimario }
                            ]}
                            onPress={() => setColorSeleccionado(color)}
                            disabled={guardando}
                        />
                    ))}
                </View>
            </View>

            {/* Botones */}
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
                    <Text style={styles.textoBotonGuardar}>
                        {guardando ? 'Guardando...' : 'Crear'}
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
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 14,
    },
    preview: {
        paddingVertical: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    previewTexto: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    selectoreColores: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    botonColor: {
        width: 50,
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent',
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
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoBotonGuardar: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
