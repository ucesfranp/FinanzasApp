//Servicio de logica pura para calcular el resumen del presupuesto. No tiene dependencias de React ni de AsyncStorage, por lo que es fácilmente testeable.
export type TipoTransaccion = 'ingreso' | 'gasto';

export interface TransaccionPresupuesto {
    tipo: TipoTransaccion;
    monto: number;
}

export interface ResumenPresupuesto {
    totalIngresos: number;
    totalGastos: number;
    presupuesto: number;
    disponible: number;
}

export function calcularResumenPresupuesto(transacciones: TransaccionPresupuesto[], presupuesto: number): ResumenPresupuesto {
    const totalIngresos = transacciones.filter(t => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0);

    const totalGastos = transacciones.filter(t => t.tipo === 'gasto').reduce((sum, t) => sum + t.monto, 0);

    const disponible = presupuesto + totalIngresos - totalGastos;

    return {
        totalIngresos,
        totalGastos,
        presupuesto,
        disponible,
    };
}