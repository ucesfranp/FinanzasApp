// screens/HomeScreen.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


interface Props { navigation: HomeNavProp; }

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pantalla Home</Text>
      <Pressable
        style={styles.boton}
        onPress={() => navigation.navigate('Detalle', {
          nombre: 'Ana',
          nota: 85,
        })}
      >
        <Text style={styles.botonTxt}>Ver detalle</Text>
      </Pressable>

      <Pressable
        style={[styles.boton, { marginTop: 20 }]}
        onPress={() => navigation.navigate('Crud')}
      >
        <Text style={styles.botonTxt}>Crud</Text>
      </Pressable>

      <Pressable
        style={[styles.boton, { marginTop: 20 }]}
        onPress={() => navigation.navigate('Tareas')}
      >
        <Text style={styles.botonTxt}>Tareas</Text>
      </Pressable>

      <Pressable
        style={[styles.boton, { marginTop: 20 }]}
        onPress={() => navigation.navigate('Ejercicios')}
      >
        <Text style={styles.botonTxt}>Ejercicios</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1B3A6B',
  },
  boton: {
    backgroundColor: '#1B3A6B',
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
