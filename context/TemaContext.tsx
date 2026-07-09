import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { leerPrefs, guardarPrefs } from '../services/preferencias';

interface ColoresTema {
  fondo: string;
  textoPrimario: string;
  texto: string;
  inputBg: string;
  inputBorder: string;
  boton: string;
}

interface TemaContextType {
  oscuro: boolean;
  colores: ColoresTema;
  cambiarTema: (valor: boolean) => Promise<void>;
}

const coloresClaro: ColoresTema = {
  fondo: '#f5f7fb',
  textoPrimario: '#111827',
  texto: '#4b5563',
  inputBg: '#ffffff',
  inputBorder: '#d1d5db',
  boton: '#4f46e5',
};

const coloresOscuro: ColoresTema = {
  fondo: '#111827',
  textoPrimario: '#f9fafb',
  texto: '#d1d5db',
  inputBg: '#1f2937',
  inputBorder: '#374151',
  boton: '#818cf8',
};

const TemaContext = createContext<TemaContextType | undefined>(undefined);

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [oscuro, setOscuro] = useState(false);

  useEffect(() => {
    const cargarTema = async () => {
      const prefs = await leerPrefs();
      setOscuro(Boolean(prefs?.temaOscuro));
    };

    cargarTema();
  }, []);

  const cambiarTema = async (valor: boolean) => {
    try {
      const prefsActuales = await leerPrefs();
      await guardarPrefs({
        nombre: prefsActuales?.nombre ?? '',
        temaOscuro: valor,
      });
    } catch (error) {
      console.log('No se pudo guardar el tema:', error);
    }

    setOscuro(valor);
  };

  const valor = useMemo(() => ({
    oscuro,
    colores: oscuro ? coloresOscuro : coloresClaro,
    cambiarTema,
  }), [oscuro]);

  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}

export function useTema() {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error('useTema debe usarse dentro de TemaProvider');
  }
  return context;
}
