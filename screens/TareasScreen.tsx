// screens/DetalleScreen.tsx
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';


import { Tarea } from './Tipos'
import { useState, useEffect} from 'react';
import axios from 'axios';


//para el api.ts
import { tareasApi } from '../services/tareasApi';


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


    // GET CON FETCH
    /* async function cargar() {
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
    } */

    // GET CON AXIOS
    /* async function cargar(){
        setEstado('cargando');
        try{
            const res = await axios.get<Tarea[]>(URL);
            setTareas(res.data); 
            setEstado('listo');
        } catch {
            setEstado('error');
        }
    } */
    //Agregamos lo de la api
    async function cargar(){
        const res = await tareasApi.getAll();
        setTareas(res.data);
    }



    // GET al montar
    useEffect(() => { cargar(); }, []);


    if (estado==='cargando') return <ActivityIndicator/>;
    if (estado==='error') return <Text>Error al cargar</Text>;

    //AGREGAR CON FETCH
    /* async function agregar() {
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
    } */

    //AGREGAR CON AXIOS
    /* async function agregar(){
        await axios.post(URL, {
            task: nuevaTarea
        });
        setNuevaTarea('');
        await cargar();
    } */
    //Agregamos lo de la api
    async function agregar(){
        await tareasApi.create(nuevaTarea);
        await cargar();
    }



    // DELETE CON FETCH
    /* async function eliminar(id: string) {
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
    } */

    //DELETE CON AXIOS
    /* async function eliminar(id: string) {
        try{
            await axios.delete(`${URL}/${id}`);
            setTareas(p => p.filter(t=> t.id!==id));
        }catch {
            setEstado('error');
        }
    } */
   //Agregamos lo de la api
    async function eliminar(id: string) {
        await tareasApi.remove(id);
        setTareas(p => p.filter(t => t.id !== id));
    }


    // PUT CON FETCH
    /* async function guardarEdicion() {
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
    } */

    //PUT CON AXIOS
    /* async function guardarEdicion() {
        await axios.put(`${URL}/${editandoId}`, { task: textoEdicion }); 
        setEditandoId(null); 
        await cargar();
    } */
    //Agregamos lo de la api
    async function guardarEdicion() {
        await tareasApi.update(editandoId!, textoEdicion);
        await cargar();
    }



  return (
    <View style={styles.container}>
        <Text>Tareas %</Text>


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


                    <Text style={styles.texto}>
                        {item.task}
                    </Text>

                    {editandoId === item.id ? (
                        <> 
                            <TextInput
                                value={textoEdicion}
                                onChangeText={setTextoEdicion}
                                style={styles.inputEdicion}
                            />
                            <Pressable style={styles.btnGuardar} onPress={guardarEdicion}>
                                <Text>Guardar</Text>
                            </Pressable>
                        </>
                    ) : ( 
                        <>
                            <Pressable style={styles.btnEditar} onPress={() => {
                                setEditandoId(item.id);
                                setTextoEdicion(item.task);
                            }}>
                                <Text>Editar</Text>
                            </Pressable>
                        </>
                    )}


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
      marginBottom: 28,
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
      backgroundColor: '#ff6b6b',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 4,
        marginBottom: 28,
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
      borderWidth: 1,
      borderColor: '#ccc',
      paddingHorizontal: 8,
      marginBottom: 8,
    },
    btnEditar: {
      backgroundColor: '#4caf50',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 4,
      marginBottom: 8,
    },
    btnGuardar: {
      backgroundColor: '#2196F3',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 4,
      marginBottom: 8,
    },
  });