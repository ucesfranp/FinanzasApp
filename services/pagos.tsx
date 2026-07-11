import AsyncStorage from "@react-native-async-storage/async-storage";


// EL FORMATO QUE TENDRAN LOS PAGOS LOCALES PARA PODER ABSTRAER LOS DATOS CORRECTAMENTE Y GUARDARLOS
export interface PagoLocal {
    id: number;
    descripcion: string;
    monto: number;
    fechaVencimiento: string;
    pagado?: boolean;
    pagoFecha?: string | null 
}

const KEY = 'pagos_pendientes';

// LEEMOS TODOS LOS PAGOS GUARDADOS EN LOCAL STORAGE
async function readAll(): Promise<PagoLocal[]> {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PagoLocal[]) : [];
}

// ESCRIBIMOS EL PAGO EN LOCAL STORAGE
async function writeAll(items: PagoLocal[]) {
    await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

// OBTENEMOS LOS PAGOS QUE LEIMOS DEL JSON
export async function getPagos(): Promise<PagoLocal[]> {
    return readAll();
}

// GUARDAR PAGO LOCAL -----
export async function guardarPago(p: Omit<PagoLocal, 'id'>): Promise<PagoLocal> {
    const current = await readAll();
    const id = current.length > 0 ? Math.max(...current.map(x => x.id)) + 1 : 1;
    const nuevo: PagoLocal = { id, ...p };
    current.push(nuevo);
    await writeAll(current);
    return nuevo;
}

// ACTUALIZAR PAGO LOCAL -----
export async function actualizarPago(updated: PagoLocal): Promise<PagoLocal> {
    const current = await readAll();
    const idx = current.findIndex(x => x.id === updated.id);
    if (idx === -1) throw new Error('Pago no encontrado');
    current[idx] = updated;
    await writeAll(current);
    return updated;
}


// ELIMINAR PAGO LOCAL -----
export async function eliminarPago(id: number): Promise<void> {
    const current = await readAll();
    const filtered = current.filter(x => x.id !== id);
    await writeAll(filtered);
}
