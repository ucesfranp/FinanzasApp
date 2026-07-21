import AsyncStorage from '@react-native-async-storage/async-storage';

interface Preferencias {
    nombre: string;
    temaOscuro?: boolean;
}

// Definimos una constante para la clave que usaremos en AsyncStorage.
const CLAVE = 'preferencias_usuario';

// Función para guardar las preferencias del usuario en AsyncStorage. Recibe un objeto Preferencias y lo convierte a JSON antes de guardarlo. El Promise es para indicar que la operación es asíncrona y puede completarse en el futuro.
export async function guardarPrefs(prefs: Preferencias): Promise<void> {
    await AsyncStorage.setItem(CLAVE, JSON.stringify(prefs));
}

export async function leerPrefs(): Promise<Preferencias | null> {
    const raw = await AsyncStorage.getItem(CLAVE);
    return raw ? JSON.parse(raw) : null;
}