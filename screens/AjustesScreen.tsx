import { useEffect, useState } from "react";
import { View, Text, TextInput, Switch, StyleSheet, Pressable } from 'react-native';
import { guardarPrefs, leerPrefs } from "../services/preferencias";
import { useTema } from "../context/TemaContext";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<
  RootStackParamList, 'Ajustes'
>;

export default function AjustesScreen(
    { navigation }: Props
) {

    const [nombre, setNombre] = useState('');
    const { oscuro, toggleTema, colores } = useTema();

    useEffect(() => {

        async function cargar() {
            const prefs = await leerPrefs();
            if (prefs) {
                setNombre(prefs.nombre);
            }
        }

        cargar();
        
    }, []);

    async function handleToggle(valor: boolean) {
        await toggleTema(valor);
    }

    async function handleNombre(text: string) {
        setNombre(text);
        await guardarPrefs({ nombre: text, temaOscuro: oscuro } as any);
    }

    return (
        <View style={[styles.container, { backgroundColor: colores.fondo }]}>
            <Text style={[styles.titulo, { color: colores.texto}]}>Base de Datos Local</Text>
            <Text style={[styles.label, { color: colores.texto }]}>Nombre</Text>
            <TextInput
                style={[styles.input, { borderColor: colores.inputBorder, backgroundColor: colores.inputBg, color: colores.texto }]}
                value={nombre}
                onChangeText={handleNombre}
                placeholder="Ingresa tu nombre"
                placeholderTextColor={oscuro ? '#999' : '#666'}
            />

            <View style={styles.row}>
                <Text style={[styles.label, { color: colores.texto }]}>Tema oscuro</Text>
                <Switch value={oscuro} onValueChange={handleToggle} />
            </View>

            <Pressable
                style={[styles.boton, { marginTop: 20,backgroundColor: colores.boton }]}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.botonTxt}>Volver</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    label: { fontSize: 16, marginBottom: 8 },
    input: { borderWidth: 1, padding: 8, borderRadius: 4, marginBottom: 16 },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
    titulo: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 8,
      alignSelf: 'center',
    },
});