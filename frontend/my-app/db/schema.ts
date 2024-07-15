import { SQLiteDatabase } from "expo-sqlite";

export const loadDatabaseSchema = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS contact (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        name TEXT NOT NULL,
        imageURL TEXT
    );

    CREATE TABLE IF NOT EXISTS private_chat (
        id INTEGER PRIMARY KEY,
        contact_id INTEGER NOT NULL,
        last_message_id INTEGER
    );
    
    CREATE TABLE IF NOT EXISTS message (
        id INTEGER PRIMARY KEY,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        value TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        type INTEGER NOT NULL,
        status INTEGER NOT NULL,
        sort_id INTEGER NOT NULL
    );
    `);
};
