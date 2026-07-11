import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

// variable de mock para simular la base de datos SQLite
const mockDB = {
    getAllAsync: jest.fn(),
    runAsync: jest.fn(),
};

// variable de mock para simular la navegación
const mockNavigation = {
    goBack: jest.fn(),
};

// variable de mock para simular el contexto de tema
const mockCreate = jest.fn();

// variable de mock para simular la función showAlert
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
    }),
}));

jest.mock('../../services/alertUtils', () => ({
    __esModule: true,
    showAlert: mockShowAlert,
}));

jest.mock('../../services/transaccionesApi', () => ({
    __esModule: true,
    transaccionesApi: {
        create: mockCreate,
    },
}));

jest.mock('expo-sqlite', () => ({
    useSQLiteContext: () => mockDB,
}));

const AgregarTransaccionScreen = require('../../screens/AgregarTransaccionScreen').default;

describe('AgregarTransaccionScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockDB.getAllAsync.mockResolvedValue([{ id: 1, nombre: 'Alimentos', color: '#f59e0b' }]);
        mockDB.runAsync.mockResolvedValue(undefined);
        mockCreate.mockResolvedValue({ data: {} });
    });

    it('guarda una transacción válida y navega de vuelta', async () => {
        await render(<AgregarTransaccionScreen navigation={mockNavigation as any} />);
        await waitFor(() => {
            expect(mockDB.getAllAsync).toHaveBeenCalledTimes(1);
        });

        const descripcionInput = screen.getByPlaceholderText('Ej: Compra en supermercado');
        const montoInput = screen.getByPlaceholderText('0.00');
        const fechaInput = screen.getByPlaceholderText('Ej: 2024-06-10');
        const guardarButton = screen.getByLabelText('guardar-transaccion');

        await fireEvent.changeText(descripcionInput, 'Compra en supermercado');
        await fireEvent.changeText(montoInput, '250');
        await fireEvent.changeText(fechaInput, '2024-06-10');

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Ej: Compra en supermercado').props.value).toBe('Compra en supermercado');
            expect(screen.getByPlaceholderText('0.00').props.value).toBe('250');
            expect(screen.getByPlaceholderText('Ej: 2024-06-10').props.value).toBe('2024-06-10');
        });

        await fireEvent.press(guardarButton);

        await waitFor(() => {
            expect(mockDB.runAsync).toHaveBeenCalledTimes(1);
            expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
        });

        expect(mockCreate).toHaveBeenCalledWith({
            descripcion: 'Compra en supermercado',
            monto: 250,
            tipo: 'gasto',
            categoria_id: 1,
            fecha: '2024-06-10',
        });
        expect(mockShowAlert).toHaveBeenCalledWith('Éxito', 'Transacción guardada');
        expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });
});

