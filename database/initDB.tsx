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
    `);
}