import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { TemaProvider } from './context/TemaContext';
import { SQLiteProvider } from 'expo-sqlite';
import { initDB } from './database/initDB';


export default function App() {

  //Variables
  const miVariable: String = "Frano"
  let notas: number[] = [15, 14, 64]

  /* Interface */
  const cliente: Cliente = {
    id: 10,
    nombre: "Raul"
  }
  


  return (

    <TemaProvider>
      <SQLiteProvider
        databaseName='tareas.db'
        onInit={initDB}
      >

        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>

      </SQLiteProvider>
    </TemaProvider>

  );
}


//Interface
interface Cliente {
  id: number;
  nombre: string;
}

//Continuamos con interface & //PROPS OPCIONALES
interface DatosPersonales {
  nombre: string;
  apellido: string;
  telefono?: number; //De esta forma es opciona/optativo
}

function Saludar({nombre, apellido}:DatosPersonales) {
  return (
    <Text>{'\n'}Hola {nombre} {apellido}</Text>
  )
}


//FlatList Tipada -- Parte 2
export interface Alumno {
  id: string;
  nombre: string;
  nota: number;
}

const alumnos: Alumno[] = [
  { id: '1', nombre: 'Ana', nota: 85 },
  { id: '2', nombre: 'Luis', nota: 70 },
];








const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
