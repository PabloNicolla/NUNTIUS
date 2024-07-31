import { SQLiteDatabase } from "expo-sqlite";
import { Message, PrivateChat } from "../schemaTypes";

export const deleteAllMessagesByChatId = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  chatId: PrivateChat["id"],
) => {
  try {
    return await db.runAsync(
      `
        DELETE FROM _${dbPrefix}_message 
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
  dbPrefix: string,
  id: Message["id"],
) => {
  try {
    return await db.runAsync(
      `
        DELETE FROM _${dbPrefix}_message 
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
