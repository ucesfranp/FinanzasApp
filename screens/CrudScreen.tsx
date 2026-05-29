// screens/DetalleScreen.tsx
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet,ScrollView, ActivityIndicator,} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';



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

export default function CrudScreen(
  { navigation }: Props

) {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

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


  return (
    <View style={styles.container}>

      <Pressable style={styles.boton} onPress={cargarTodos}>
        <Text style={styles.botonTxt}>Ver todos</Text>
      </Pressable>

      {cargando && <ActivityIndicator size="large" color="#1B3A6B" />}
      {error && (
        <Text style={styles.error}>Error: {error}</Text>
      )}
      {todos && (
      <ScrollView style={styles.lista}>
        <Text style={styles.resumen}>
          {todos.length} registros recibidos
        </Text>
        {todos.slice(0, 10).map(item => (
          <View key={item.id} style={styles.item}>
            <Text>#{item.id} - {item.title}</Text>
            <Text>{item.completed ? 'Completado' : 'Pendiente'}</Text>
          </View>
        ))}
      </ScrollView>
)}



      <Text>Volver al Home</Text>

      <Pressable
        style={styles.boton}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16,  backgroundColor: '#fff' },
  titulo: { fontSize: 24, fontWeight: 'bold',   color: '#1B3A6B', textAlign: 'center' },
  boton: {
    backgroundColor: '#1B3A6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 8,
  },
  botonTxt: { color: '#fff', fontSize: 16,  fontWeight: 'bold' },
  error: { color: '#c00', textAlign: 'center' },
  lista: { flex: 1, marginTop: 8 },
  resumen: { fontWeight: '600', marginBottom: 8 },
  item: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
});