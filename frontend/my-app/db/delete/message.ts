import { SQLiteDatabase } from "expo-sqlite";

export const deleteAllMessageByChatId = async (
  db: SQLiteDatabase,
  chatId: number,
) => {
  try {
    return await db.runAsync(
      `
        DELETE FROM message 
        WHERE $chatId = chatId;
      `,
      {
        $chatId: chatId,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: deleteAllMessageByChatId", error);
  }
};

export const deleteAllMessageById = async (db: SQLiteDatabase, id: number) => {
  try {
    return await db.runAsync(
      `
        DELETE FROM message 
        WHERE $id = id;
      `,
      {
        $id: id,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: deleteAllMessageById", error);
  }
};
