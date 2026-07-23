import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import * as pagosService from '../../services/pagos';
// Comprobamos que el usuario pueda agregar un pago y verlo en la lista

// Mockeamos el servicio de pagos para controlar su comportamiento en los tests --> ya que es todo codigo asincrono
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

  //Simulamos que inicialmente no hay pagos y que guardar devuevle un nuevo pago con id.
  mockGetPagos.mockResolvedValue([]);
  mockGuardarPago.mockImplementation(async (p) => ({ id: 1, ...p }));
})

it('agrega un pago y aparece en la lista', async () => {
  //Renderizamos la screen.
  await render(<PagosPendientesScreen/>);

  //Esperamos el texto..
  await screen.findByText('No hay pagos pendientes');

  // Verificamos que getPagos fue llamado
  await waitFor(() => {
    expect(mockGetPagos).toHaveBeenCalled();
  }); 

  //Simulamos interacción del usuario para agregar un pago
  await fireEvent.changeText(screen.getByLabelText('input-descripcion'),'Internet');
  await fireEvent.changeText(screen.getByLabelText('input-monto'), '2000');
  await fireEvent.changeText(screen.getByLabelText('input-fecha'), '2026-07-20');

  // Verificamos que los valores se hayan actualizado correctamente en los inputs
  await waitFor(() => {
    expect(screen.getByDisplayValue('Internet')).toBeTruthy();
    expect(screen.getByDisplayValue('2000')).toBeTruthy();
    expect(screen.getByDisplayValue('2026-07-20')).toBeTruthy();
  });

  // Simulamos el click en el botón de agregar
  await fireEvent.press(screen.getByLabelText('btn-agregar'))

  // Verificamos que la función guardarPago haya sido llamada
  await waitFor(() => {
    expect(mockGuardarPago).toHaveBeenCalled();
  });

  // Simulamos que el pago agregado ahora aparece en la lista
  expect(await screen.findByText('Internet')).toBeTruthy();
})