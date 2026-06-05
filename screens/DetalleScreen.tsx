// screens/DetalleScreen.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTema } from '../context/TemaContext';

// NativeStackScreenProps tipea route Y navigation juntos
type Props = NativeStackScreenProps<
  RootStackParamList, 'Detalle'
>;

export default function DetalleScreen(
  { route, navigation }: Props
) {
  // route.params tiene tipo automatico
  const { nombre, nota } = route.params;
  const { colores } = useTema();

  return (
    <View style={[styles.container, { backgroundColor: colores.fondo }]}>
      <Text style={[styles.titulo, { color: colores.textoPrimario }]}>{nombre}</Text>
      <Text style={[styles.nota, { color: colores.texto }]}>Nota: {nota}</Text>
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
    },
    botonTxt: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });