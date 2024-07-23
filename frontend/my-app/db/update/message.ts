import { SQLiteDatabase } from "expo-sqlite";
import { Message } from "../schemaTypes";

export const updateMessage = async (db: SQLiteDatabase, message: Message) => {
  try {
    return await db.runAsync(
      `UPDATE message
          SET
            value = $value,
            condition = $condition
          WHERE
            chatId = $chatId
            AND senderReferenceId = $senderReferenceId;
            `,
      {
        $value: message.value,
        $condition: message.condition,
        $chatId: message.chatId,
        $senderReferenceId: message.senderReferenceId,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: updateMessage", error);
  }
};
