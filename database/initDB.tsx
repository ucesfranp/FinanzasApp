import { type SQLiteDatabase } from 'expo-sqlite';

export async function initDB(
    db: SQLiteDatabase
): Promise<void> {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS tareas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL,
            completada INTEGER DEFAULT 0
        );
        
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE,
            color TEXT DEFAULT '#6200ee',
            api_id TEXT UNIQUE
        );
        
        CREATE TABLE IF NOT EXISTS transacciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descripcion TEXT NOT NULL,
            monto REAL NOT NULL,
            tipo TEXT NOT NULL,
            categoria_id INTEGER,
            fecha TEXT NOT NULL,
            api_id TEXT UNIQUE,
            FOREIGN KEY(categoria_id) REFERENCES categorias(id)
        );
        
        CREATE TABLE IF NOT EXISTS preferencias (
            clave TEXT PRIMARY KEY,
            valor TEXT
        );
    `);
}