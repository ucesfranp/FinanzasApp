import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import * as pagosService from '../../services/pagos';


jest.mock('../../services/pagos', () => ({
  __esModule: true,
  // Estamos trayendo las funciones reales para poder espiar sus llamadas
  getPagos: jest.fn(),
  guardarPago: jest.fn(),
  actualizarPago: jest.fn(),
  eliminarPago: jest.fn(),
}));

// Simulamos el contexto de tema para que devuelva un tema claro y funciones simuladas
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
    cambiarTema: jest.fn(),
  }),
}));

jest.mock('expo-sqlite', () => ({
  useSQLiteContext: () => ({
    getFirstAsync: jest.fn(),
    runAsync: jest.fn(),
  }),
}));

jest.mock('../../components/BottomNav', () => ({
  __esModule: true,
  default: () => null,
}));

import PagosPendientesScreen from '../../screens/PagosPendientesScreen';

// Lo que hacemos aca es crear un mock de la función getPagos y guardarPago para poder controlar su comportamiento en los tests.
let mockGetPagos: jest.Mock;
let mockGuardarPago: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  // Asignamos los mocks a las funciones del servicio "as jest.Mock" para que TypeScript sepa que son funciones simuladas.
  mockGetPagos = pagosService.getPagos as jest.Mock;
  mockGuardarPago = pagosService.guardarPago as jest.Mock;
  mockGetPagos.mockResolvedValue([]);
  mockGuardarPago.mockImplementation(async (p) => ({ id: 1, ...p }));
})

it('agrega un pago y aparece en la lista', async () => {
  await render(<PagosPendientesScreen/>);

  await screen.findByText('No hay pagos pendientes');

  await waitFor(() => {
    expect(mockGetPagos).toHaveBeenCalled();
  }); 

  await fireEvent.changeText(screen.getByLabelText('input-descripcion'),'Internet');
  await fireEvent.changeText(screen.getByLabelText('input-monto'), '2000');
  await fireEvent.changeText(screen.getByLabelText('input-fecha'), '2026-07-20');

  await waitFor(() => {
    expect(screen.getByDisplayValue('Internet')).toBeTruthy();
    expect(screen.getByDisplayValue('2000')).toBeTruthy();
    expect(screen.getByDisplayValue('2026-07-20')).toBeTruthy();
  });

  await fireEvent.press(screen.getByLabelText('btn-agregar'))

  await waitFor(() => {
    expect(mockGuardarPago).toHaveBeenCalled();
  });

  expect(await screen.findByText('Internet')).toBeTruthy();
})