import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { TemaProvider } from './context/TemaContext';
import { SQLiteProvider } from 'expo-sqlite';
import { initDB } from './database/initDB';

export default function App() {
  return (
    <TemaProvider>
      <SQLiteProvider
        databaseName='finanzas.db'
        onInit={initDB}
      >
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </SQLiteProvider>
    </TemaProvider>
  );
}
