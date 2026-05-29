// screens/DetalleScreen.tsx
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';


import { Tarea } from './Tipos'
import { useState, useEffect} from 'react';

type Estado = 'cargando' | 'error' | 'listo';
const URL = 'https://671195294eca2acdb5f52a81.mockapi.io/tareas';



// NativeStackScreenProps tipea route Y navigation juntos
type Props = NativeStackScreenProps<
  RootStackParamList, 'Tareas'
>;

export default function TareasScreen(
  { navigation }: Props
) {

    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [estado, setEstado] = useState<Estado>('cargando');
    const [nuevaTarea, setNuevaTarea] = useState('');   

    // Agregar al componente:
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [textoEdicion, setTextoEdicion] = useState('');


    async function cargar() {
        setEstado('cargando');
        try {
            const res = await fetch(URL);
            if (!res.ok) throw new Error('Error servidor');
            const data = await res.json() as Tarea[];
            setTareas(data);
            setEstado('listo');
        } catch {
            setEstado('error');
        }
    }
    
    // GET al montar
    useEffect(() => { cargar(); }, []);


    if (estado==='cargando') return <ActivityIndicator/>;
    if (estado==='error') return <Text>Error al cargar</Text>;


    async function agregar() {
        if (!nuevaTarea.trim()) return; // validar
        try {
            const res = await fetch(URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: nuevaTarea }),
            });
            if (!res.ok) throw new Error('Error al crear');
            setNuevaTarea(''); // limpiar input
            await cargar(); // recargar lista
        } catch {
            setEstado('error');
        }
    }


    async function eliminar(id: string) {
        try {
            const res = await fetch(`${URL}/${id}`, { 
                method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error al  eliminar');
        // Actualizar lista sin recargar del servidor:
        setTareas(prev => prev.filter(t => t.id !==     id));
        } catch {
            setEstado('error');
        }
    }


    async function guardarEdicion() {
        if (!editandoId) return;
        try {
            const res = await fetch(`${URL}/${editandoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: textoEdicion }),
            });
            if (!res.ok) throw new Error('Error al editar');
            setEditandoId(null);
            await cargar();
        } catch {
            setEstado('error');
        }
    }




  return (
    <View style={styles.container}>
        <Text>Tareas</Text>


        <TextInput
            style={styles.input}
            value={nuevaTarea}
            onChangeText={setNuevaTarea}
            placeholder='Nueva tarea...'
        />
        <Pressable
            style={styles.boton}
            onPress={agregar}
        >
            <Text style={styles.botonTxt}>Agregar</Text>
        </Pressable>



        <FlatList<Tarea>
            data={tareas}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={styles.fila}>

                    {editandoId === item.id ? (// Modo edicion: mostrar input
                        <>
                            <TextInput
                                value={textoEdicion}
                                onChangeText={setTextoEdicion}
                                style={styles.inputEdicion}
                            />
                            <Pressable onPress={guardarEdicion}>
                                <Text>Guardar</Text> </Pressable>
                        </>
                    ) : ( // Modo normal: mostrar texto + boton editar
                        <>
                            <Text>{item.task}</Text>
                            <Pressable onPress={() => {
                                setEditandoId(item.id);
                                setTextoEdicion(item.task);
                            }}>
                            <Text>Editar</Text> </Pressable>
                        </>
                    )}
                    

                    <Text style={styles.texto}>
                        {item.task}
                    </Text>


                    <Pressable
                        style={styles.btnEliminar}
                        onPress={() => eliminar(item.id)}
                    >
                        <Text style={styles.btnEliminarTxt}>
                            Eliminar
                        </Text>
                    </Pressable>

                    
                </View>
            )}
            ListEmptyComponent={
                <Text>No hay tareas todavia</Text>
            }
        />




      <Pressable
        style={styles.boton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.botonTxt}>Volver</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    titulo: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1B3A6B',
      marginBottom: 8,
    },
    nota: {
      fontSize: 20,
      color: '#444',
      marginBottom: 32,
    },
    boton: {
      backgroundColor: '#37476F',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    botonTxt: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    fila: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    texto: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1B3A6B',
        marginBottom: 8,
    },
    input: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1B3A6B',
        marginBottom: 8,
    },
    btnEliminar: {
      color: '#fff',
      //fontSize: 16,
      fontWeight: 'bold',
    },
    btnEliminarTxt: {
      color: '#000000',
      fontSize: 16,
      fontWeight: 'bold',
    },
    inputEdicion: {
      color: '#000000',
      fontSize: 16,
      fontWeight: 'bold',
    },
   
  });