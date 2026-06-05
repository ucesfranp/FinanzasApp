// screens/HomeScreen.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTema } from '../context/TemaContext';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


interface Props { navigation: HomeNavProp; }

export default function HomeScreen({ navigation }: Props) {
  const { colores } = useTema();

  return (
    <View style={[styles.container, { backgroundColor: colores.fondo }]}>
      <Text style={[styles.titulo, { color: colores.textoPrimario }]}>Pantalla Home</Text>
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
