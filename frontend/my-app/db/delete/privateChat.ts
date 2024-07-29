import { SQLiteDatabase } from "expo-sqlite";
import { PrivateChat } from "../schemaTypes";

export const deletePrivateChat = async (
  db: SQLiteDatabase,
  chatId: PrivateChat["id"],
) => {
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
