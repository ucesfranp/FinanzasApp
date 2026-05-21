// navigation/StackNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import HomeScreen from '../screens/HomeScree';
import DetalleScreen from '../screens/DetalleScreen';

// Stack tipado: sabe que pantallas existen y sus parametros
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
    return (
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen
            name='Home'
            component={HomeScreen}
            />      
            <Stack.Screen
                name='Detalle'
                component={DetalleScreen}
            />
        </Stack.Navigator>  
    )
}
