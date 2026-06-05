// screens/DetalleScreen.tsx
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet,ScrollView, ActivityIndicator,} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTema } from '../context/TemaContext';



// NativeStackScreenProps tipea route Y navigation juntos
type Props = NativeStackScreenProps<
  RootStackParamList, 'Crud'
>;

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

// CRUD = Create, Read, Update, Delete
export default function CrudScreen(
  { navigation }: Props

) {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colores } = useTema();

  // Función para cargar todos los registros
  const cargarTodos = () => {
    setCargando(true);
    setError(null);
    setTodos(null);
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then((data: Todo[]) => {
        setTodos(data); // datos recibidos
      })
      .catch(err => {
        setError(String(err)); // algo salió mal
      })
      .finally(() => {
        setCargando(false);
      });
  };

  //
  return (
    <View style={[styles.container, { backgroundColor: colores.fondo }]}>

      {/* Este botón carga todos los registros */}
      <Pressable style={[styles.boton, { backgroundColor: colores.boton }]} onPress={cargarTodos}>
        <Text style={styles.botonTxt}>Ver todos</Text>
      </Pressable>

      {/* Esto muestra el indicador de carga  */}
      {cargando && <ActivityIndicator size="large" color={colores.textoPrimario} />}
      {error && (
        <Text style={[styles.error, { color: '#ff6b6b' }]}>Error: {error}</Text>
      )}
      {todos && (
      <ScrollView style={styles.lista}>
        <Text style={[styles.resumen, { color: colores.texto }]}>
          {todos.length} registros recibidos
        </Text>
        {todos.slice(0, 10).map(item => (
          <View key={item.id} style={[styles.item, { borderColor: colores.inputBorder, backgroundColor: colores.inputBg }]}>
            <Text style={{ color: colores.texto }}>#{item.id} - {item.title}</Text>
            <Text style={{ color: colores.texto }}>{item.completed ? 'Completado' : 'Pendiente'}</Text>
          </View>
        ))}
      </ScrollView>
)}



      <Text style={{ color: colores.texto }}>Volver al Home</Text>

      <Pressable
        style={[styles.boton, { backgroundColor: colores.boton }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.botonTxt}>Volver</Text>
      </Pressable>
    </View>
  );
}
/* 
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
  });*/

//Estos son los estilos que usamos 
//Los puedo definir aca y usar en otro archivo ? respuesta: SI, pero no es lo ideal, lo mejor es definirlos en cada archivo, o crear un archivo de estilos compartidos
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  boton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 8,
  },
  botonTxt: { color: '#fff', fontSize: 16,  fontWeight: 'bold' },
  error: { textAlign: 'center' },
  lista: { flex: 1, marginTop: 8 },
  resumen: { fontWeight: '600', marginBottom: 8 },
  item: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
});