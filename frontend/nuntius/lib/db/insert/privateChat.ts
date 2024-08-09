import { SQLiteDatabase } from "expo-sqlite";
import { PrivateChat } from "../schemaTypes";

export const insertPrivateChat = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  chat: PrivateChat,
) => {
  try {
    return await db.runAsync(
      `INSERT INTO _${dbPrefix}_private_chat (
                id,
                contactId,
                lastMessageId,
                lastMessageValue,
                lastMessageTimestamp,
                notificationCount
            ) 
            VALUES (
                $id,
                $contactId,
                $lastMessageId,
                $lastMessageValue,
                $lastMessageTimestamp,
                $notificationCount
            )`,
      {
        $id: chat.id,
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
