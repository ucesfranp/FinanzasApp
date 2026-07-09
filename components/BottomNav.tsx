import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BottomNavProps {
  current: 'Home' | 'Movimientos' | 'Categorias' | 'Ajustes';
}

export default function BottomNav({ current }: BottomNavProps) {
  const { colores } = useTema();
  const navigation = useNavigation<NavigationProp>();

  const items = [
    { name: 'Home', icon: 'home-outline' as const, label: 'Inicio' },
    { name: 'Movimientos', icon: 'swap-horizontal-outline' as const, label: 'Movs.' },
    { name: 'Categorias', icon: 'pricetag-outline' as const, label: 'Cat.' },
    { name: 'Ajustes', icon: 'settings-outline' as const, label: 'Ajustes' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}> 
      {items.map((item) => {
        const active = current === item.name;
        return (
          <Pressable
            key={item.name}
            style={styles.item}
            onPress={() => navigation.navigate(item.name as 'Home' | 'Movimientos' | 'Categorias' | 'Ajustes')}
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
