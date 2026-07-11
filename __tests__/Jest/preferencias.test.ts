import AsyncStorage from '@react-native-async-storage/async-storage';
import { guardarPrefs, leerPrefs } from '../../services/preferencias';

type Preferencias = {
    nombre: string;
    temaOscuro?: boolean;
}

jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        setItem: jest.fn(),
        getItem: jest.fn(),
    },
}));

describe('Preferencias', () => {
    const prefs: Preferencias = {
        nombre: 'Fran',
        temaOscuro: true,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('guardarPrefs guarda JSON en AsyncStorage', async () => {
        await guardarPrefs(prefs);

        expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('preferencias_usuario', JSON.stringify(prefs));
    });

    it('leerPrefs devuelve null cuando no hay datos guardados', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

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
        expect(result).toEqual(prefs);
    });
});