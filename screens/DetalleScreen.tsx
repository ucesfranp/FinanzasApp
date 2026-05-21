// screens/DetalleScreen.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

// NativeStackScreenProps tipea route Y navigation juntos
type Props = NativeStackScreenProps<
  RootStackParamList, 'Detalle'
>;

export default function DetalleScreen(
  { route, navigation }: Props
) {
  // route.params tiene tipo automatico
  const { nombre, nota } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{nombre}</Text>
      <Text style={styles.nota}>Nota: {nota}</Text>
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
  });