import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

jest.mock('../../services/pagos', () => ({
  __esModule: true,
  getPagos: jest.fn(),
  guardarPago: jest.fn(),
  actualizarPago: jest.fn(),
  eliminarPago: jest.fn(),
}));

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

let mockGetPagos: jest.Mock;
let mockGuardarPago: jest.Mock;

beforeEach(() => {
    jest.clearAllMocks();
    const pagos = require('../../services/pagos');
    mockGetPagos = pagos.getPagos;
    mockGuardarPago = pagos.guardarPago;
    mockGetPagos.mockResolvedValue([]);
    mockGuardarPago.mockImplementation(async (p) => ({ id:1, ...p }));
});

it('agrega un pago y aparece en la lista', async () => {

    const { getByLabelText, getByDisplayValue, getByText } = await render(<PagosPendientesScreen />);

    await waitFor(() => {
        expect(mockGetPagos).toHaveBeenCalled();
        expect(getByText('No hay pagos pendientes')).toBeTruthy();
    });

    fireEvent.changeText(getByLabelText('input-descripcion'), 'Internet');
    fireEvent.changeText(getByLabelText('input-monto'), '2000');
    fireEvent.changeText(getByLabelText('input-fecha'), '2026-07-20');

    fireEvent.press(getByLabelText('btn-agregar'));

    await waitFor(() => {
        expect(getByDisplayValue('Internet')).toBeTruthy();
        expect(getByDisplayValue('2000')).toBeTruthy();
        expect(getByDisplayValue('2026-07-20')).toBeTruthy();
    });

    await waitFor(() => {
        expect(mockGuardarPago).toHaveBeenCalled();
        expect(getByText('Internet')).toBeTruthy();
    });

});