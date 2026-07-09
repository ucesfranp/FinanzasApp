import AsyncStorage from '@react-native-async-storage/async-storage';

interface Preferencias {
    nombre: string;
    temaOscuro?: boolean;
}

const CLAVE = 'preferencias_usuario';

export async function guardarPrefs(
    prefs: Preferencias
): Promise<void> {
    await AsyncStorage.setItem(CLAVE, JSON.stringify(prefs));
}

export async function leerPrefs(): Promise<Preferencias | null> {
    const raw = await AsyncStorage.getItem(CLAVE);
    return raw ? JSON.parse(raw) : null;
}