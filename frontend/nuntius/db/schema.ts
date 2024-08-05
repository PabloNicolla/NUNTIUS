import { SQLiteDatabase } from "expo-sqlite";

export const loadDatabaseSchema = async (
  db: SQLiteDatabase,
  dbPrefix: string,
) => {
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.execAsync(`
    CREATE TABLE IF NOT EXISTS _${dbPrefix}_contact (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        imageURL TEXT
    );

    CREATE TABLE IF NOT EXISTS _${dbPrefix}_private_chat (
        id TEXT PRIMARY KEY,
        contactId TEXT NOT NULL,
        lastMessageId INTEGER,
        lastMessageValue TEXT,
        lastMessageTimestamp INTEGER,
        notificationCount INTEGER
    );
    
    CREATE TABLE IF NOT EXISTS _${dbPrefix}_message (
        id INTEGER PRIMARY KEY,
        senderId TEXT NOT NULL,
        receiverId TEXT NOT NULL,

        value TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        type INTEGER NOT NULL,
        status INTEGER NOT NULL,

        receiverType INTEGER NOT NULL,
        chatId TEXT NOT NULL,
        senderReferenceId NOT NULL,
        condition INTEGER NOT NULL
    );
    `);
  });
};

export const addMessageTableIndexes = async (
  db: SQLiteDatabase,
  dbPrefix: string,
) => {
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_status ON _${dbPrefix}_message(status);
        CREATE INDEX IF NOT EXISTS idx_timestamp ON _${dbPrefix}_message(timestamp);
        CREATE INDEX IF NOT EXISTS idx_chatId ON _${dbPrefix}_message(chatId);
    `);
  });
};
