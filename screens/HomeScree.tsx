// screens/HomeScreen.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTema } from '../context/TemaContext';
import { useState, useEffect } from 'react';
import { leerPrefs } from '../services/preferencias';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


interface Props { navigation: HomeNavProp; }


//Leemos las preferencias al inicial la app y mostramos un saludo personalizado con el nombre guardado.

export default function HomeScreen({ navigation }: Props) {
  const { colores } = useTema();
  const [nombre, setNombre] = useState(''); // estado para guardar el nombre leído de las preferencias --> nombre es el estado, setNombre es la función para actualizarlo, y '' es el valor inicial (vacío)

  useEffect(() => {
    async function cargarNombre() {
      const prefs = await leerPrefs();
      if (prefs && prefs.nombre) { // esto se lee así: si prefs existe y tiene una propiedad nombre, entonces...
        setNombre(prefs.nombre); // actualizamos el estado con el nombre leído de las preferencias
      }
    }
    cargarNombre();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colores.fondo }]}>
      <Text style={[styles.titulo, { color: colores.textoPrimario }]}>
        {nombre ? `¡Hola ${nombre}!` : 'Pantalla Home'} {/* Si nombre tiene algo, mostramos "¡Hola {nombre}!", sino mostramos "Pantalla Home" */}
      </Text>
      <Pressable
        style={[styles.boton, { backgroundColor: colores.boton }]}
        onPress={() => navigation.navigate('Detalle', {
          nombre: 'Ana',
          nota: 85,
        })}
      >
        <Text style={styles.botonTxt}>Ver detalle</Text>
      </Pressable>

      <Pressable
        style={[styles.boton, { marginTop: 20, backgroundColor: colores.boton }]}
        onPress={() => navigation.navigate('Crud')}
      >
        <Text style={styles.botonTxt}>Crud</Text>
      </Pressable>

      <Pressable
        style={[styles.boton, { marginTop: 20, backgroundColor: colores.boton }]}
        onPress={() => navigation.navigate('Tareas')}
      >
        <Text style={styles.botonTxt}>Tareas</Text>
      </Pressable>

      <Pressable
        style={[styles.boton, { marginTop: 20, backgroundColor: colores.boton }]}
        onPress={() => navigation.navigate('Ejercicios')}
      >
        <Text style={styles.botonTxt}>Ejercicios</Text>
      </Pressable>

      <Pressable
        style={[styles.boton, { marginTop: 20, backgroundColor: colores.boton }]}
        onPress={() => navigation.navigate('Ajustes')}
      >
        <Text style={styles.botonTxt}>Ajustes</Text>
      </Pressable>

      <Pressable
        style={[styles.boton, { marginTop: 20, backgroundColor: colores.boton }]}
        onPress={() => navigation.navigate('TareasLocal')}
      >
        <Text style={styles.botonTxt}>Tareas Locales</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
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
});
