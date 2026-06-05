import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTema } from '../context/TemaContext';

// URL utilizada por los ejercicios
const url = 'https://jsonplaceholder.typicode.com/posts/1';

// Ejercicio 1: saludo async
async function saludar() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Hola!');
}

export default function EjerciciosScreen() {
    // estado para el ejercicio 4
    const [titulo, setTitulo] = useState<string>('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { colores } = useTema();

    // función única para cargar el título (usada por los botones Ej 2/3 y Ej 4)
    async function cargarTitulo() {
        setCargando(true);
        setError(null);
        setTitulo('');
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Error en la respuesta');
            const data = await res.json();
            console.log('Título recibido:', data.title);
            setTitulo(data.title ?? 'Sin título');
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
        } finally {
            setCargando(false);
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: colores.fondo }]}>
            <Text style={[styles.titulo, { color: colores.textoPrimario }]}>Ejercicios</Text>

            <Pressable style={[styles.boton, { backgroundColor: colores.boton }]} onPress={saludar}>
                <Text style={styles.botonTxt}>Ej 1</Text>
            </Pressable>

            <Pressable style={[styles.boton, { backgroundColor: colores.boton }]} onPress={cargarTitulo}>
                <Text style={styles.botonTxt}>Ej 2 & 3</Text>
            </Pressable>

            <Pressable style={[styles.boton, { backgroundColor: colores.boton }]} onPress={cargarTitulo}>
                <Text style={styles.botonTxt}>Ej 4 - Cargar</Text>
            </Pressable>

            {cargando && <ActivityIndicator size="large" color={colores.textoPrimario} style={{ marginTop: 20 }} />}
            {error && <Text style={[styles.error, { color: '#ff6b6b' }]}>{error}</Text>}

            {!cargando && !error && titulo !== '' && (
                <ScrollView style={styles.lista}>
                    <Text style={[styles.resumen, { color: colores.texto }]}>Título recibido:</Text>
                    <Text style={{ color: colores.texto }}>{titulo}</Text>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  boton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 8,
  },
  botonTxt: { color: '#fff', fontSize: 16,  fontWeight: 'bold' },
  error: { textAlign: 'center', marginTop: 12 },
  lista: { flex: 1, marginTop: 12, width: '100%' },
  resumen: { fontWeight: '600', marginBottom: 8 },
});
