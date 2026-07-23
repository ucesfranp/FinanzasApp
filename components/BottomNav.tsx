/* 
BottomNav.tsx --> evito duplicar la misma navegación en todas las pantallas. Los itmes se definen en un array y se renderizan con map. Current me permite distinguir la pantlla activa, y el contexto de tema cambia los colores según el modo de apariencia.
*/
import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// current: indica cual pestaña esta activa
interface BottomNavProps {
  current: 'Home' | 'Movimientos' | 'Categorias' | 'Ajustes' | 'PagosPendientes'; // Agregamos PagosPendientes al tipo
}

export default function BottomNav({ current }: BottomNavProps) {
  const { colores } = useTema(); //Adapta la barra al modo oscuro o claro
  const navigation = useNavigation<NavigationProp>(); //Permite navegar

  // Esta lista permite renderizar todos los botones con un unico map, evitando repetir código. Cada objeto tiene un nombre, un icono y una etiqueta.
  const items = [
    { name: 'Home', icon: 'home-outline' as const, label: 'Inicio' },
    { name: 'Movimientos', icon: 'swap-horizontal-outline' as const, label: 'Movs.' },
    //Agrego PagosPendientes al BottomNav
    { name: 'PagosPendientes', icon: 'checkmark-circle-outline' as const, label: 'Pagos' },
    { name: 'Categorias', icon: 'pricetag-outline' as const, label: 'Cat.' },
    { name: 'Ajustes', icon: 'settings-outline' as const, label: 'Ajustes' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}> 
      {items.map((item) => {
        // Detecta si el item actual es el que corresponde a la pantalla activa, para cambiar el color del icono y la etiqueta.
        const active = current === item.name;
        return (
          <Pressable
            key={item.name}
            style={styles.item}
            onPress={() => navigation.navigate(item.name as 'Home' | 'Movimientos' | 'PagosPendientes' | 'Categorias' | 'Ajustes')}
          >
            <Ionicons
              name={item.icon}
              size={20}
              color={active ? colores.boton : colores.texto}
            />
            <Text style={[styles.label, { color: active ? colores.boton : colores.texto }]}> 
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    minWidth: 70,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});
