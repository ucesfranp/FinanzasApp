import { calcularResumenPresupuesto, TransaccionPresupuesto } from '../../services/presupuestoUtils';
import { describe, it, expect } from '@jest/globals';

describe('calcularResumenPresupuesto', () => {
    it('calcular correctamente el disponible cuando hay ingresos y gastos', () => {
        const transacciones: TransaccionPresupuesto[] = [
            { tipo: 'ingreso', monto: 2000 },
            { tipo: 'gasto', monto: 500 },
            { tipo: 'gasto', monto: 300 },
        ]; 

        const resumen = calcularResumenPresupuesto(transacciones, 5000);

        expect(resumen.totalIngresos).toBe(2000);
        expect(resumen.totalGastos).toBe(800);
        expect(resumen.presupuesto).toBe(5000);
        expect(resumen.disponible).toBe(6200); // 5000 + 2000 - 800 = 6200
    });

    it('devuelve 0 en ingresos y gastos cuando no hay transacciones', () => {
        const transacciones: TransaccionPresupuesto[] = [];

        const resumen = calcularResumenPresupuesto(transacciones, 5000);

        expect(resumen.totalIngresos).toBe(0);
        expect(resumen.totalGastos).toBe(0);
        expect(resumen.presupuesto).toBe(5000);
        expect(resumen.disponible).toBe(5000); // 5000 + 0 - 0 = 5000
    });

    it('calcula disponible negativo cuando los gastos superan los ingresos y el presupuesto', () => {
    const transacciones: TransaccionPresupuesto[] = [
        { tipo: 'gasto', monto: 6000 },
        { tipo: 'ingreso', monto: 500 },
        ];

        const resumen = calcularResumenPresupuesto(transacciones, 1000);

        expect(resumen.totalIngresos).toBe(500);
        expect(resumen.totalGastos).toBe(6000);
        expect(resumen.presupuesto).toBe(1000);
        expect(resumen.disponible).toBe(-4500); // 1000 + 500 - 6000 = -4500
    });
});