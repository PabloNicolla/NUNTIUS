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
        contactId INTEGER NOT NULL,
        lastMessageId INTEGER,
        lastMessageValue TEXT,
        lastMessageTimestamp INTEGER
    );
    
    CREATE TABLE IF NOT EXISTS message (
        id INTEGER PRIMARY KEY,
        senderId INTEGER NOT NULL,
        receiverId INTEGER NOT NULL,

        value TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        type INTEGER NOT NULL,
        status INTEGER NOT NULL,

        receiverType INTEGER NOT NULL,
        chatId INTEGER NOT NULL,
        senderReferenceId NOT NULL,
        condition INTEGER NOT NULL
    );
    `);
};

export const addMessageTableIndexes = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        CREATE INDEX idx_status ON message(status);
        CREATE INDEX idx_timestamp ON message(timestamp);
        CREATE INDEX idx_chatId ON message(chatId);
    `);
};
