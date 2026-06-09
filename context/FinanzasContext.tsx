import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { Transaccion, Categoria, ResumenMensual } from '../screens/FinanzasTypes';
import { transaccionesApi } from '../services/transaccionesApi';
import { getCurrentDateString, getMonthFromDateString, getYearFromDateString } from '../services/dateUtils';

interface FinanzasContextType {
    transacciones: Transaccion[];
    categorias: Categoria[];
    presupuesto: number;
    cargando: boolean;
    error: string | null;
    
    // Métodos para transacciones
    agregarTransaccion: (transaccion: Omit<Transaccion, 'id' | 'api_id'>) => Promise<void>;
    editarTransaccion: (id: number, transaccion: Omit<Transaccion, 'id'>) => Promise<void>;
    eliminarTransaccion: (id: number) => Promise<void>;
    
    // Métodos para categorías
    agregarCategoria: (categoria: Omit<Categoria, 'id' | 'api_id'>) => Promise<void>;
    editarCategoria: (id: number, categoria: Omit<Categoria, 'id'>) => Promise<void>;
    eliminarCategoria: (id: number) => Promise<void>;
    
    // Métodos para preferencias
    establecerPresupuesto: (monto: number) => Promise<void>;
    obtenerResumen: (mes: number, año: number) => ResumenMensual;
    
    // Métodos para sincronización
    sincronizar: () => Promise<void>;
    cargarDelMockAPI: () => Promise<void>;
}

const FinanzasContext = createContext<FinanzasContextType | undefined>(undefined);

const CATEGORIAS_PREDEFINIDAS: Omit<Categoria, 'id' | 'api_id'>[] = [
    { nombre: 'Alimentos', color: '#FF6B6B' },
    { nombre: 'Transporte', color: '#4ECDC4' },
    { nombre: 'Entretenimiento', color: '#FFE66D' },
    { nombre: 'Servicios', color: '#95E1D3' },
    { nombre: 'Salud', color: '#FF8C94' },
    { nombre: 'Otros', color: '#C7CEEA' },
];

export const FinanzasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const db = useSQLiteContext();
    const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [presupuesto, setPresupuesto] = useState(5000); // Presupuesto por defecto
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cargarDatos = useCallback(async () => {
        try {
            setCargando(true);
            setError(null);
            
            // Cargar categorías de la BD
            const categoriasResult = await db.getAllAsync<Categoria>(
                'SELECT * FROM categorias'
            );
            
            if (categoriasResult.length === 0) {
                // Insertar categorías predefinidas si no existen
                for (const cat of CATEGORIAS_PREDEFINIDAS) {
                    await db.runAsync(
                        'INSERT INTO categorias (nombre, color) VALUES (?, ?)',
                        [cat.nombre, cat.color]
                    );
                }
                const nuevasCategorias = await db.getAllAsync<Categoria>(
                    'SELECT * FROM categorias'
                );
                setCategorias(nuevasCategorias);
            } else {
                setCategorias(categoriasResult);
            }
            
            // Cargar transacciones
            const transaccionesResult = await db.getAllAsync<Transaccion>(
                'SELECT * FROM transacciones ORDER BY fecha DESC'
            );
            setTransacciones(transaccionesResult);
            
            // Cargar presupuesto
            const presupuestoResult = await db.getFirstAsync<{ valor: string }>(
                "SELECT valor FROM preferencias WHERE clave = 'presupuesto_mensual'"
            );
            if (presupuestoResult) {
                setPresupuesto(parseFloat(presupuestoResult.valor));
            }
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar datos');
        } finally {
            setCargando(false);
        }
    }, [db]);

    // Cargar datos iniciales
    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const agregarTransaccion = useCallback(async (transaccion: Omit<Transaccion, 'id' | 'api_id'>) => {
        try {
            // Guardar en BD local primero
            const resultado = await db.runAsync(
                `INSERT INTO transacciones (descripcion, monto, tipo, categoria_id, fecha) 
                 VALUES (?, ?, ?, ?, ?)`,
                [transaccion.descripcion, transaccion.monto, transaccion.tipo, transaccion.categoria_id, transaccion.fecha]
            );
            
            // Intentar sincronizar con API (sin bloquear)
            transaccionesApi.create(transaccion).catch(err => {
                console.log('Error al sincronizar con API:', err);
            });
            
            // Recargar datos locales
            await cargarDatos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al agregar transacción');
            throw err;
        }
    }, [db]);

    const editarTransaccion = useCallback(async (id: number, transaccion: Omit<Transaccion, 'id'>) => {
        try {
            await db.runAsync(
                `UPDATE transacciones SET descripcion = ?, monto = ?, tipo = ?, categoria_id = ?, fecha = ? 
                 WHERE id = ?`,
                [transaccion.descripcion, transaccion.monto, transaccion.tipo, transaccion.categoria_id, transaccion.fecha, id]
            );
            
            // Sincronizar con API
            if (transaccion.api_id) {
                transaccionesApi.update(transaccion.api_id, transaccion).catch(err => {
                    console.log('Error al sincronizar con API:', err);
                });
            }
            
            await cargarDatos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al editar transacción');
            throw err;
        }
    }, [db]);

    const eliminarTransaccion = useCallback(async (id: number) => {
        try {
            // Obtener api_id antes de eliminar
            const transaccion = await db.getFirstAsync<{ api_id: string }>(
                'SELECT api_id FROM transacciones WHERE id = ?',
                [id]
            );
            
            await db.runAsync('DELETE FROM transacciones WHERE id = ?', [id]);
            
            // Sincronizar con API
            if (transaccion && transaccion.api_id) {
                transaccionesApi.remove(transaccion.api_id).catch(err => {
                    console.log('Error al sincronizar con API:', err);
                });
            }
            
            await cargarDatos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar transacción');
            throw err;
        }
    }, [db]);

    const agregarCategoria = useCallback(async (categoria: Omit<Categoria, 'id' | 'api_id'>) => {
        try {
            await db.runAsync(
                'INSERT INTO categorias (nombre, color) VALUES (?, ?)',
                [categoria.nombre, categoria.color]
            );
            await cargarDatos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al agregar categoría');
            throw err;
        }
    }, [db]);

    const editarCategoria = useCallback(async (id: number, categoria: Omit<Categoria, 'id'>) => {
        try {
            await db.runAsync(
                'UPDATE categorias SET nombre = ?, color = ? WHERE id = ?',
                [categoria.nombre, categoria.color, id]
            );
            await cargarDatos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al editar categoría');
            throw err;
        }
    }, [db]);

    const eliminarCategoria = useCallback(async (id: number) => {
        try {
            await db.runAsync('DELETE FROM categorias WHERE id = ?', [id]);
            await cargarDatos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar categoría');
            throw err;
        }
    }, [db]);

    const establecerPresupuesto = useCallback(async (monto: number) => {
        try {
            await db.runAsync(
                "INSERT OR REPLACE INTO preferencias (clave, valor) VALUES ('presupuesto_mensual', ?)",
                [monto.toString()]
            );
            setPresupuesto(monto);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al establecer presupuesto');
            throw err;
        }
    }, [db]);

    const obtenerResumen = useCallback((mes: number, año: number): ResumenMensual => {
        const transaccionesMes = transacciones.filter(t => {
            return getMonthFromDateString(t.fecha) === mes && getYearFromDateString(t.fecha) === año;
        });

        const totalIngresos = transaccionesMes
            .filter(t => t.tipo === 'ingreso')
            .reduce((sum, t) => sum + t.monto, 0);

        const totalGastos = transaccionesMes
            .filter(t => t.tipo === 'gasto')
            .reduce((sum, t) => sum + t.monto, 0);

        const disponible = presupuesto + totalIngresos - totalGastos;
        const porcentajeUsado = presupuesto > 0 ? (totalGastos / presupuesto) * 100 : 0;

        return {
            totalIngresos,
            totalGastos,
            presupuesto,
            disponible,
            porcentajeUsado,
        };
    }, [transacciones, presupuesto]);

    const sincronizar = useCallback(async () => {
        // Por ahora, solo recargar datos
        await cargarDatos();
    }, []);

    const cargarDelMockAPI = useCallback(async () => {
        try {
            setCargando(true);
            setError(null);
            
            // Obtener transacciones del mockapi
            const response = await transaccionesApi.getAll();
            const datosDelAPI = response.data;
            const fechaActual = getCurrentDateString();
            
            // Guardar cada transacción en la BD local con fecha actual
            for (const transaccion of datosDelAPI) {
                try {
                    await db.runAsync(
                        `INSERT OR IGNORE INTO transacciones (id, descripcion, monto, tipo, categoria_id, fecha, api_id) 
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                            transaccion.id,
                            transaccion.descripcion,
                            transaccion.monto,
                            transaccion.tipo,
                            transaccion.categoria_id,
                            fechaActual,
                            transaccion.api_id || transaccion.id,
                        ]
                    );
                } catch (err) {
                    // Si el registro ya existe, intentar actualizar con fecha actual
                    await db.runAsync(
                        `UPDATE transacciones SET descripcion = ?, monto = ?, tipo = ?, categoria_id = ?, fecha = ? 
                         WHERE id = ?`,
                        [
                            transaccion.descripcion,
                            transaccion.monto,
                            transaccion.tipo,
                            transaccion.categoria_id,
                            fechaActual,
                            transaccion.id
                        ]
                    );
                }
            }
            
            // Recargar datos locales
            await cargarDatos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar del mockapi');
            throw err;
        } finally {
            setCargando(false);
        }
    }, [db, cargarDatos]);

    return (
        <FinanzasContext.Provider value={{
            transacciones,
            categorias,
            presupuesto,
            cargando,
            error,
            agregarTransaccion,
            editarTransaccion,
            eliminarTransaccion,
            agregarCategoria,
            editarCategoria,
            eliminarCategoria,
            establecerPresupuesto,
            obtenerResumen,
            sincronizar,
            cargarDelMockAPI,
        }}>
            {children}
        </FinanzasContext.Provider>
    );
};

export const useFinanzas = () => {
    const context = useContext(FinanzasContext);
    if (!context) {
        throw new Error('useFinanzas debe ser usado dentro de FinanzasProvider');
    }
    return context;
};
