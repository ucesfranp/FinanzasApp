// screens/DetalleScreen.tsx
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';


import { Tarea } from './Tipos'
import { useState, useEffect} from 'react';
import axios from 'axios';
import { useTema } from '../context/TemaContext';


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
    const { colores, oscuro } = useTema();

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
    //Agregamos lo de la api --> no es lo de la api, no andaba lo del profe del pdf
    async function cargar(){
        setEstado('cargando');
        try {
            const res = await tareasApi.getAll();
            setTareas(res.data);
            setEstado('listo');
        } catch {
            setEstado('error');
        }
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
        //Para que vueva a parecer el boton de editar, sino se queda editando
        setEditandoId(null);
    }



  return (
    <View style={[styles.container, { backgroundColor: colores.fondo }]}>
        <Text style={{ color: colores.texto }}>Tareas %</Text>


        <TextInput
            style={[styles.input, { color: colores.texto, borderColor: colores.inputBorder, backgroundColor: colores.inputBg }]}
            value={nuevaTarea}
            onChangeText={setNuevaTarea}
            placeholder='Nueva tarea...'
            placeholderTextColor={oscuro ? '#999' : '#666'}
        />
        <Pressable
            style={[styles.boton, { backgroundColor: colores.boton }]}
            onPress={agregar}
        >
            <Text style={styles.botonTxt}>Agregar</Text>
        </Pressable>



        <FlatList<Tarea>
            data={tareas}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={[styles.fila, { backgroundColor: colores.fondo }]}>


                    <Text style={[styles.texto, { color: colores.textoPrimario }]}>
                        {item.task}
                    </Text>

                    {editandoId === item.id ? (
                        <> 
                            <TextInput
                                value={textoEdicion}
                                onChangeText={setTextoEdicion}
                                style={[styles.inputEdicion, { color: colores.texto, borderColor: colores.inputBorder, backgroundColor: colores.inputBg }]}
                            />
                            <Pressable style={[styles.btnGuardar, { backgroundColor: colores.boton }]} onPress={guardarEdicion}>
                                <Text style={{ color: colores.botonTexto }}>Guardar</Text>
                            </Pressable>
                        </>
                    ) : ( 
                        <>
                            <Pressable style={[styles.btnEditar, { backgroundColor: colores.boton }]} onPress={() => {
                                setEditandoId(item.id);
                                setTextoEdicion(item.task);
                            }}>
                                <Text style={{ color: colores.botonTexto }}>Editar</Text>
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
                <Text style={{ color: colores.texto }}>No hay tareas todavia</Text>
            }
        />




      <Pressable
        style={[styles.boton, { backgroundColor: colores.boton }]}
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
    },
    texto: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        marginBottom: 8,
        padding: 8,
        borderRadius: 4,
        width: '80%',
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
  });
      