import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { TemaProvider } from './context/TemaContext';
import { FinanzasProvider } from './context/FinanzasContext';
import { SQLiteProvider } from 'expo-sqlite';
import { initDB } from './database/initDB';

export default function App() {
  return (
    <TemaProvider>
      <SQLiteProvider
        databaseName='finanzas.db'
        onInit={initDB}
      >
        <FinanzasProvider>
          <NavigationContainer>
            <BottomTabNavigator />
          </NavigationContainer>
        </FinanzasProvider>
      </SQLiteProvider>
    </TemaProvider>
  );
}
