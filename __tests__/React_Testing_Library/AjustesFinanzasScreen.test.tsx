import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

const mockDb = {
    getFirstAsync: jest.fn(),
    getAllAsync: jest.fn(),
    runAsync: jest.fn(),
};

const mockLeerPrefs = jest.fn();
const mockGuardarPrefs = jest.fn();
const mockChangeTheme = jest.fn();
const mockShowAlert = jest.fn();

jest.mock('../../context/TemaContext', () => ({
  useTema: () => ({
    oscuro: false,
    colores: {
      fondo: '#ffffff',
      textoPrimario: '#000000',
      texto: '#333333',
      inputBg: '#ffffff',
      inputBorder: '#dddddd',
      boton: '#4f46e5',
    },
    cambiarTema: mockChangeTheme,
  }),
}));

jest.mock('../../services/preferencias', () => ({
  __esModule: true,
  leerPrefs: mockLeerPrefs,
  guardarPrefs: mockGuardarPrefs,
}));

jest.mock('../../services/alertUtils', () => ({
  __esModule: true,
  showAlert: mockShowAlert,
}));

jest.mock('../../components/BottomNav', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View, null),
  };
});

jest.mock('expo-sqlite', () => ({
  useSQLiteContext: () => mockDb,
}));

const AjustesFinanzasScreen = require('../../screens/AjustesFinanzasScreen').default;

describe('AjustesFinanzasScreen', () => {
  const mockNavigation = { navigate: jest.fn() } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.getFirstAsync.mockResolvedValue({ valor: '5000' });
    mockDb.getAllAsync.mockResolvedValue([]);
    mockLeerPrefs.mockResolvedValue({ nombre: 'Fran', temaOscuro: false });
  });

  test('muestra el switch de modo oscuro y llama a cambiarTema cuando se activa', async () => {
    await render(<AjustesFinanzasScreen navigation={mockNavigation} />);

    expect(screen.getByText('Ajustes')).toBeTruthy();
    expect(screen.getByText('Modo oscuro')).toBeTruthy();

    const switchElement = screen.getByRole('switch');
  await fireEvent(switchElement, 'valueChange', true);

    await waitFor(() => {
      expect(mockChangeTheme).toHaveBeenCalledWith(true);
    });
  });
});