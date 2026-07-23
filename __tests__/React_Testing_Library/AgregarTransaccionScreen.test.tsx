import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
// Verificamos el flujo de completar y guardar una transacción/movimiento.


// variable de mock para simular la base de datos SQLite
const mockDB = {
    getAllAsync: jest.fn(),
    runAsync: jest.fn(),
};

// variable de mock para simular la navegación
const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() } as any;

const mockCreate = jest.fn();

// variable de mock para simular la función showAlert
const mockShowAlert = jest.fn();


// Simulamos el contexto de tema para que devuelva un tema claro con colores específicos
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

// Simulamos la función showAlert para que podamos verificar si se llama correctamente
jest.mock('../../services/alertUtils', () => ({
    __esModule: true,
    showAlert: mockShowAlert,
}));

// Simulamos la API de transacciones para que podamos verificar si se llama correctamente
jest.mock('../../services/transaccionesApi', () => ({
    //__esModule es necesario para que Jest pueda manejar correctamente los módulos ES6, es decir, para que pueda importar y exportar correctamente las funciones y objetos del módulo. Sin esto, Jest podría no reconocer las exportaciones del módulo y lanzar errores al intentar importarlas.
    __esModule: true,
    transaccionesApi: {
        create: mockCreate,
    },
}));


// Simulamos el contexto de SQLite para que devuelva nuestra base de datos mock
jest.mock('expo-sqlite', () => ({
    useSQLiteContext: () => mockDB,
}));

// Importamos el componente que vamos a probar
const AgregarTransaccionScreen = require('../../screens/AgregarTransaccionScreen').default;

describe('<AgregarTransaccionScreen />', () => {

    // Limpiamos los mocks antes de cada prueba para evitar interferencias entre pruebas
    beforeEach(() => {
        jest.clearAllMocks();
        mockDB.getAllAsync.mockResolvedValue([{ id: 1, nombre: 'Alimentos', color: '#f59e0b' }]);
        mockDB.runAsync.mockResolvedValue(undefined);
        mockCreate.mockResolvedValue({ data: {} });
    });

    it('guarda una transacción válida y navega de vuelta', async () => {
        //Esperamos pq la screen carga categorías en un useEffect
        await render(<AgregarTransaccionScreen navigation={mockNavigation} />);
        await waitFor(() => { 
            expect(mockDB.getAllAsync).toHaveBeenCalledTimes(1);
        });

        // Usamos identificadores visibles o accesibles en vez de depender de la estructura interna.
        const descripcionInput = screen.getByPlaceholderText('Ej: Compra en supermercado');
        const montoInput = screen.getByPlaceholderText('0.00');
        const fechaInput = screen.getByPlaceholderText('Ej: 2024-06-10');
        const guardarButton = screen.getByLabelText('guardar-transaccion');

        // Verficiamos q los valores realmente hayan llegado a los inputs.
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

        // Esperamos que la función de creación de transacciones se haya llamado con los datos correctos y que la alerta se haya mostrado.
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

