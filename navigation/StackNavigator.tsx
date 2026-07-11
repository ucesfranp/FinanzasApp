import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Pantallas principales
import HomeFinanzasScreen from '../screens/HomeFinanzasScreen';
import MovimientosScreen from '../screens/MovimientosScreen';
import CategoriasScreen from '../screens/CategoriasScreen';
import AjustesFinanzasScreen from '../screens/AjustesFinanzasScreen';

// Pantallas de transacciones
import AgregarTransaccionScreen from '../screens/AgregarTransaccionScreen';
import DetalleTransaccionScreen from '../screens/DetalleTransaccionScreen';

// Pantallas de categorías
import AgregarCategoriaScreen from '../screens/AgregarCategoriaScreen';
import EditarCategoriaScreen from '../screens/EditarCategoriaScreen';


import PagosPendientesScreen from '../screens/PagosPendientesScreen';

// Stack tipado: sabe qué pantallas existen y sus parámetros
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeFinanzasScreen} />
      <Stack.Screen name="Movimientos" component={MovimientosScreen} />
      <Stack.Screen name="Categorias" component={CategoriasScreen} />
      <Stack.Screen name="Ajustes" component={AjustesFinanzasScreen} />
      
      <Stack.Screen name="AgregarTransaccion" component={AgregarTransaccionScreen} />
      <Stack.Screen name="DetalleTransaccion" component={DetalleTransaccionScreen} />
      
      <Stack.Screen name="AgregarCategoria" component={AgregarCategoriaScreen} />
      <Stack.Screen name="EditarCategoria" component={EditarCategoriaScreen} />

      <Stack.Screen name="PagosPendientes" component={PagosPendientesScreen} />
    </Stack.Navigator>
  );
}
