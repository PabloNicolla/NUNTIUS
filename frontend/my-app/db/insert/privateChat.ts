import { SQLiteDatabase } from "expo-sqlite";
import { PrivateChat } from "../schemaTypes";

export const insertPrivateChat = async (
  db: SQLiteDatabase,
  chat: PrivateChat,
) => {
  try {
    return await db.runAsync(
      `INSERT INTO private_chat (
                contactId,
                lastMessageId,
                lastMessageValue,
                lastMessageTimestamp,
                notificationCount
            ) 
            VALUES (
                $contactId,
                $lastMessageId,
                $lastMessageValue,
                $lastMessageTimestamp,
                $notificationCount
            )`,
      {
        $contactId: chat.contactId,
        $lastMessageId: chat.lastMessageId ?? null,
        $lastMessageValue: chat.lastMessageValue ?? null,
        $lastMessageTimestamp: chat.lastMessageTimestamp ?? null,
        $notificationCount: chat.notificationCount ?? 0,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: insertPrivateChat", error);
  }
};