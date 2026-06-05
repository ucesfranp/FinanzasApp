import React, { createContext, useState, useEffect, useContext } from 'react';
import { leerPrefs, guardarPrefs } from '../services/preferencias';

interface TemaContextType {
    oscuro: boolean;
    toggleTema: (valor: boolean) => Promise<void>;
    colores: {
        fondo: string;
        texto: string;
        textoPrimario: string;
        inputBorder: string;
        inputBg: string;
        boton: string;
        botonTexto: string;
    };
}

const TemaContext = createContext<TemaContextType | undefined>(undefined);

export const TemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [oscuro, setOscuro] = useState(false);
    const [cargado, setCargado] = useState(false);

    useEffect(() => {
        async function cargarTema() {
            const prefs = await leerPrefs();
            if (prefs && (prefs as any).temaOscuro) {
                setOscuro(true);
            }
            setCargado(true);
        }
        cargarTema();
    }, []);

    async function toggleTema(valor: boolean) {
        setOscuro(valor);
        const prefs = await leerPrefs();
        await guardarPrefs({ ...prefs, temaOscuro: valor } as any);
    }

    const colores = oscuro ? {
        fondo: '#121212',
        texto: '#ffffff',
        textoPrimario: '#bb86fc',
        inputBorder: '#444',
        inputBg: '#1e1e1e',
        boton: '#6200ee',
        botonTexto: '#ffffff',
    } : {
        fondo: '#ffffff',
        texto: '#000000',
        textoPrimario: '#1B3A6B',
        inputBorder: '#ccc',
        inputBg: '#f9f9f9',
        boton: '#37476F',
        botonTexto: '#ffffff',
    };

    return (
        <TemaContext.Provider value={{ oscuro, toggleTema, colores }}>
            {cargado ? children : null}
        </TemaContext.Provider>
    );
};

export const useTema = () => {
    const context = useContext(TemaContext);
    if (!context) {
        throw new Error('useTema debe ser usado dentro de TemaProvider');
    }
    return context;
};
