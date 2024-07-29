import { SQLiteDatabase } from "expo-sqlite";
import { Message, PrivateChat } from "../schemaTypes";

export const deleteAllMessagesByChatId = async (
  db: SQLiteDatabase,
  chatId: PrivateChat["id"],
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

export const deleteMessageById = async (
  db: SQLiteDatabase,
  id: Message["id"],
) => {
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
    console.log("[STATEMENTS]: deleteMessageById", error);
  }
};
