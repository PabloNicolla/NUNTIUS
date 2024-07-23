import { SQLiteDatabase } from "expo-sqlite";

export const deletePrivateChat = async (db: SQLiteDatabase, chatId: number) => {
  try {
    return await db.runAsync(
      `
        DELETE FROM private_chat
        WHERE id = $id;
      `,
      {
        $id: chatId,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: deletePrivateChat", error);
  }
};
