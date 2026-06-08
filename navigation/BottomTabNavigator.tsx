import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';

// Screens
import HomeFinanzasScreen from '../screens/HomeFinanzasScreen';
import MovimientosScreen from '../screens/MovimientosScreen';
import DetalleTransaccionScreen from '../screens/DetalleTransaccionScreen';
import AgregarTransaccionScreen from '../screens/AgregarTransaccionScreen';
import CategoriasScreen from '../screens/CategoriasScreen';
import EditarCategoriaScreen from '../screens/EditarCategoriaScreen';
import AgregarCategoriaScreen from '../screens/AgregarCategoriaScreen';
import AjustesFinanzasScreen from '../screens/AjustesFinanzasScreen';

// Tipos de navegación
export type RootTabParamList = {
    HomeTab: undefined;
    MovimientosTab: undefined;
    CategoriasTab: undefined;
    AjustesTab: undefined;
};

type HomeStackParamList = {
    HomeFinanzas: undefined;
    DetalleTransaccion: { transaccionId: number };
    AgregarTransaccion: undefined;
};

type MovimientosStackParamList = {
    MovimientosList: undefined;
    DetalleTransaccion: { transaccionId: number };
    AgregarTransaccion: undefined;
};

type CategoriasStackParamList = {
    CategoriasList: undefined;
    AgregarCategoria: undefined;
    EditarCategoria: { categoriaId: number };
};

type AjustesStackParamList = {
    AjustesList: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const MovimientosStack = createNativeStackNavigator<MovimientosStackParamList>();
const CategoriasStack = createNativeStackNavigator<CategoriasStackParamList>();
const AjustesStack = createNativeStackNavigator<AjustesStackParamList>();

// Stacks para cada tab
function HomeStackNavigator() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen 
                name="HomeFinanzas" 
                component={HomeFinanzasScreen}
                options={{ headerShown: false }}
            />
            <HomeStack.Screen 
                name="DetalleTransaccion" 
                component={DetalleTransaccionScreen}
                options={{ title: 'Detalle' }}
            />
            <HomeStack.Screen 
                name="AgregarTransaccion" 
                component={AgregarTransaccionScreen}
                options={{ title: 'Nuevo Movimiento' }}
            />
        </HomeStack.Navigator>
    );
}

function MovimientosStackNavigator() {
    return (
        <MovimientosStack.Navigator>
            <MovimientosStack.Screen 
                name="MovimientosList" 
                component={MovimientosScreen}
                options={{ headerShown: false }}
            />
            <MovimientosStack.Screen 
                name="DetalleTransaccion" 
                component={DetalleTransaccionScreen}
                options={{ title: 'Detalle' }}
            />
            <MovimientosStack.Screen 
                name="AgregarTransaccion" 
                component={AgregarTransaccionScreen}
                options={{ title: 'Nuevo Movimiento' }}
            />
        </MovimientosStack.Navigator>
    );
}

function CategoriasStackNavigator() {
    return (
        <CategoriasStack.Navigator>
            <CategoriasStack.Screen 
                name="CategoriasList" 
                component={CategoriasScreen}
                options={{ headerShown: false }}
            />
            <CategoriasStack.Screen 
                name="AgregarCategoria" 
                component={AgregarCategoriaScreen}
                options={{ title: 'Nueva Categoría' }}
            />
            <CategoriasStack.Screen 
                name="EditarCategoria" 
                component={EditarCategoriaScreen}
                options={{ title: 'Editar Categoría' }}
            />
        </CategoriasStack.Navigator>
    );
}

function AjustesStackNavigator() {
    return (
        <AjustesStack.Navigator>
            <AjustesStack.Screen 
                name="AjustesList" 
                component={AjustesFinanzasScreen}
                options={{ headerShown: false }}
            />
        </AjustesStack.Navigator>
    );
}

// Tab Navigator
export default function BottomTabNavigator() {
    const { colores } = useTema();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'MovimientosTab') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'CategoriasTab') {
                        iconName = focused ? 'pricetag' : 'pricetag-outline';
                    } else if (route.name === 'AjustesTab') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: colores.textoPrimario,
                tabBarInactiveTintColor: colores.texto,
                tabBarStyle: {
                    backgroundColor: colores.fondo,
                    borderTopColor: colores.inputBorder,
                },
            })}
        >
            <Tab.Screen 
                name="HomeTab" 
                component={HomeStackNavigator}
                options={{
                    title: 'Inicio',
                    headerShown: false,
                }}
            />
            <Tab.Screen 
                name="MovimientosTab" 
                component={MovimientosStackNavigator}
                options={{
                    title: 'Movimientos',
                    headerShown: false,
                }}
            />
            <Tab.Screen 
                name="CategoriasTab" 
                component={CategoriasStackNavigator}
                options={{
                    title: 'Categorías',
                    headerShown: false,
                }}
            />
            <Tab.Screen 
                name="AjustesTab" 
                component={AjustesStackNavigator}
                options={{
                    title: 'Ajustes',
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
}
