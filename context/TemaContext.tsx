import React, { createContext, useState, useContext } from 'react';

interface TemaContextType {
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
    const colores = {
        fondo: '#ffffff',
        texto: '#000000',
        textoPrimario: '#1B3A6B',
        inputBorder: '#ccc',
        inputBg: '#f9f9f9',
        boton: '#37476F',
        botonTexto: '#ffffff',
    };

    return (
        <TemaContext.Provider value={{ colores }}>
            {children}
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
