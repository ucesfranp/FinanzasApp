// Tipos para la app de finanzas

export interface Transaccion {
    id: number;
    descripcion: string;
    monto: number;
    tipo: 'gasto' | 'ingreso';
    categoria_id: number;
    fecha: string;
    api_id?: string;
}

export interface Categoria {
    id: number;
    nombre: string;
    color: string;
    api_id?: string;
}

export interface ResumenMensual {
    totalIngresos: number;
    totalGastos: number;
    presupuesto: number;
    disponible: number;
    porcentajeUsado: number;
}

export interface TransaccionPorCategoria {
    categoria: Categoria;
    total: number;
    cantidad: number;
    porcentaje: number;
}
