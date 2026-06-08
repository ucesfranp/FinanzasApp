import { useState, useEffect } from 'react';
import {
    View, Text, FlatList,
    TextInput, Pressable, StyleSheet
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { TareaLocal } from './Tipos';


export default function TareasLocalScreen() {

    const db = useSQLiteContext();
    const [tareas, setTareas] = useState<TareaLocal[]>([]);
    const [nuevaTarea, setNuevaTarea] = useState('');

    useEffect(() => {
        void cargar();
    }, [db]);

    // cargar / agregar / completar / eliminar
    // ...

    async function cargar() {
        const resultado = await db.getAllAsync<TareaLocal>(
            'SELECT * FROM tareas ORDER BY id DESC'
        );
        setTareas(resultado);
    }

    // Un solo registro
    /* const t = await db.getFirstAsync<TareaLocal>(
        'SELECT * FROM tareas WHERE id = ?', [id]
    ); */

    async function agregar() {
        if (!nuevaTarea.trim()) return;
        await db.runAsync(
            'INSERT INTO tareas (task) VALUES (?)',
            [nuevaTarea]
        );
        setNuevaTarea(''); // limpiar input
        await cargar(); // recargar lista
    }

    async function toggleCompletar(tarea: TareaLocal) {
        const nuevoEstado = tarea.completada === 0 ? 1 : 0;
        await db.runAsync(
            'UPDATE tareas SET completada = ? WHERE id = ?',
            [nuevoEstado, tarea.id]
        );
        await cargar();
    }


    async function eliminar(id: number) {
        await db.runAsync(
            'DELETE FROM tareas WHERE id = ?', [id]
        );
        // Optimistic update — sin recargar del disco
        setTareas(prev => prev.filter(t => t.id !== id));
    }


    return (
        <View style={styles.container}>
            <View style={styles.formulario}>
                <TextInput style={styles.input}
                    value={nuevaTarea}
                    onChangeText={setNuevaTarea}
                    placeholder='Nueva tarea...'
                    returnKeyType='done'
                    onSubmitEditing={agregar}
                />
                <Pressable style={styles.boton} onPress={agregar}>
                    <Text style={styles.botonTxt}>+</Text>
                </Pressable>
            </View>

            <FlatList<TareaLocal>
                style={styles.lista}
                contentContainerStyle={styles.listaContenido}
                data={tareas}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.fila}>
                        <Pressable onPress={() => toggleCompletar(item)}>
                            <Text style={styles.check}>
                                {item.completada ? '[X]' : '[ ]'}
                            </Text>
                        </Pressable>
                        <Text style={[styles.tarea,
                        item.completada ? styles.tachada : undefined]}>
                            {item.task}
                        </Text>
                        <Pressable onPress={() => eliminar(item.id)}>
                            <Text style={styles.btnEliminar}>X</Text>
                        </Pressable>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.listaVacia}>No hay tareas todavía</Text>}
            />
        </View>
    );
  
}





















const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    formulario: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    titulo: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    nota: {
      fontSize: 20,
      marginBottom: 32,
    },
    boton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginLeft: 8,
      backgroundColor: '#1B3A6B',
      alignItems: 'center',
      justifyContent: 'center',
    },
    botonTxt: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    texto: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    tarea: {
        flex: 1,
        fontSize: 16,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 4,
        flex: 1,
    },
    inputEdicion: {
        fontSize: 16,
        borderWidth: 1,
        padding: 8,
        borderRadius: 4,
        marginBottom: 8,
        width: '80%',
    },
    btnEliminar: {
      backgroundColor: '#ff6b6b',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 4,
      marginTop: 8,
    },
    btnEliminarTxt: {
      color: '#fff',
      fontWeight: 'bold',
    },
    lista: {
      flex: 1,
      width: '100%',
    },
    listaContenido: {
      paddingBottom: 16,
    },
    listaVacia: {
      textAlign: 'center',
      marginTop: 24,
      color: '#777',
    },
    btnEditar: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 4,
      marginBottom: 8,
    },
    btnGuardar: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 4,
      marginBottom: 8,
    },
    tachada: {
        textDecorationLine: 'line-through',
        color: '#aaa',
    },
    fila: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    check: {
        fontSize: 18,
        marginRight: 10,
        color: '#1B3A6B',
    },
});

