import AsyncStorage from '@react-native-async-storage/async-storage';
import { guardarPrefs, leerPrefs } from '../../services/preferencias';
//Comprobamos la persistencia de preferencias sin acceder al almacenamiento real


type Preferencias = {
    nombre: string;
    temaOscuro?: boolean;
}

// Mokeamos AsyncStorage para que no haga llamadas reales durante las pruebas
jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        setItem: jest.fn(),
        getItem: jest.fn(),
    },
}));

describe('Preferencias', () => {
    // Definimos un objeto de preferencias de ejemplo para usar en las pruebas
    const prefs: Preferencias = {
        nombre: 'Fran',
        temaOscuro: true,
    };

    // Limpiamos los mocks antes de cada prueba para evitar interferencias entre ellas
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('guardarPrefs guarda JSON en AsyncStorage', async () => {
        await guardarPrefs(prefs);

        // Verificamos que AsyncStorage.setItem haya sido llamado correctamente con la clave y el valor esperado. Que llame una vez a setItem; y guarde el Json correcto
        expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('preferencias_usuario', JSON.stringify(prefs));
    });

    it('leerPrefs devuelve null cuando no hay datos guardados', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null); //Simulamos una promesa que devuelve null una sola vez

        const result = await leerPrefs();

        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('preferencias_usuario');
        expect(result).toBeNull();
    });

    it('leerPrefs parsea y devuelve las preferencias guardadas', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(prefs));

        const result = await leerPrefs();

        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('preferencias_usuario');
        expect(result).toEqual(prefs); // Usamos toEqual para comparar objetos en lugar de toBe, que compara referencias
    });
});