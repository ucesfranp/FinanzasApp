import { useEffect, useState } from "react";
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import { guardarPrefs, leerPrefs } from "../services/preferencias";
import { useTema } from "../context/TemaContext";

export default function AjustesScreen() {

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

    async function handleNombreChange(text: string) {
        setNombre(text);
        await guardarPrefs({ nombre: text, temaOscuro: oscuro } as any);
    }

    return (
        <View style={[styles.container, { backgroundColor: colores.fondo }]}>
            <Text style={[styles.label, { color: colores.texto }]}>Nombre</Text>
            <TextInput
                style={[styles.input, { borderColor: colores.inputBorder, backgroundColor: colores.inputBg, color: colores.texto }]}
                value={nombre}
                onChangeText={handleNombreChange}
                placeholder="Ingresa tu nombre"
                placeholderTextColor={oscuro ? '#999' : '#666'}
            />

            <View style={styles.row}>
                <Text style={[styles.label, { color: colores.texto }]}>Tema oscuro</Text>
                <Switch value={oscuro} onValueChange={handleToggle} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    label: { fontSize: 16, marginBottom: 8 },
    input: { borderWidth: 1, padding: 8, borderRadius: 4, marginBottom: 16 },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});