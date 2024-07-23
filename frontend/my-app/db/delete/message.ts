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
    console.log("[STATEMENTS]: deleteMessage", error);
  }
};
