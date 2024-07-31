import { SQLiteDatabase } from "expo-sqlite";
import { PrivateChat } from "../schemaTypes";

export const deletePrivateChat = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  chatId: PrivateChat["id"],
) => {
  try {
    return await db.runAsync(
      `
        DELETE FROM ${dbPrefix}_private_chat
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
