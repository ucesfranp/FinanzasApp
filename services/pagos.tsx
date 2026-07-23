import AsyncStorage from "@react-native-async-storage/async-storage";

/*  
CRUD local de pagos usando AsyncStorage.
*/


// EL FORMATO QUE TENDRAN LOS PAGOS LOCALES PARA PODER ABSTRAER LOS DATOS CORRECTAMENTE Y GUARDARLOS
export interface PagoLocal {
    id: number;
    descripcion: string;
    monto: number;
    fechaVencimiento: string;
    pagado?: boolean;
    pagoFecha?: string | null 
}

// AsyncStorage trabaja con claves string, por lo que definimos una constante para la clave que usaremos para guardar los pagos pendientes en el almacenamiento local.
const KEY = 'pagos_pendientes';

// LEEMOS TODOS LOS PAGOS GUARDADOS EN LOCAL STORAGE
async function readAll(): Promise<PagoLocal[]> {
    const raw = await AsyncStorage.getItem(KEY); //Consulta la clave
    return raw ? (JSON.parse(raw) as PagoLocal[]) : []; //Si hay datos, se convierte de json a arra; Sino devuelve un array vacio
}

// ESCRIBIMOS EL PAGO EN LOCAL STORAGE
async function writeAll(items: PagoLocal[]) {
    await AsyncStorage.setItem(KEY, JSON.stringify(items)); //Convierto a string json antes de guardar
}

// OBTENEMOS LOS PAGOS QUE LEIMOS DEL JSON
export async function getPagos(): Promise<PagoLocal[]> {
    return readAll();
}

// GUARDAR PAGO LOCAL -----
export async function guardarPago(p: Omit<PagoLocal, 'id'>): Promise<PagoLocal> {
    const current = await readAll(); //Leo los pagos actuales
    const id = current.length > 0 ? Math.max(...current.map(x => x.id)) + 1 : 1; // Calculo un id mayor al existente
    const nuevo: PagoLocal = { id, ...p }; //Creo el nuevo objeto
    current.push(nuevo); //Lo agrego al array de pagos actuales
    await writeAll(current); //reescribe el array completo en AsyncStorage
    return nuevo;  //Devuelvo el pago que acabo de guardar, con su id asignado
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
