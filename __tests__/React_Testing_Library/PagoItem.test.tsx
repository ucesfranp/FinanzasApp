import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PagoItem, { PagoLocal } from '../../components/PagoItem';
// Testeamos un componente aislado


const pago: PagoLocal = {
    id: 1,
    descripcion: 'Luz',
    monto: 1500,
    fechaVencimiento: '2026-07-18',
    pagado: false,
    pagoFecha: null
};

// Creo callbacks espia 
const mockToggle = jest.fn();
const mockEliminar = jest.fn();

async function renderItem(p = pago) {
    return render(<PagoItem pago={p} onTogglePaid={mockToggle} onEliminar={mockEliminar} />);
}

it('muestra descripcion y monto', async () => {
    const { getByText } = await renderItem();
    expect(getByText('Luz')).toBeTruthy();
    expect(getByText(/\$1500/)).toBeTruthy();
});

it('llama onTogglePaid al presionar el toggle', async () => {
    const { getByText } = await renderItem();
    fireEvent.press(getByText('❌'));
    expect(mockToggle).toHaveBeenCalledWith(pago);
});

it('llama onEliminar al presionar 🗑️', async () => {
    const { getByText } = await renderItem();
    fireEvent.press(getByText('🗑️'));
    expect(mockEliminar).toHaveBeenCalledWith(1);
});

it('muestra ✅ si pagado', async () => {
    const { getByText } = await renderItem({ ...pago, pagado: true, pagoFecha: new Date().toISOString() });
    expect(getByText('✅')).toBeTruthy();
});