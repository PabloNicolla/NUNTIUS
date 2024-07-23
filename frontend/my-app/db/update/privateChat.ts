import { SQLiteDatabase } from "expo-sqlite";
import { PrivateChat } from "../schemaTypes";

export const updatePrivateChatById = async (
  db: SQLiteDatabase,
  chat: PrivateChat,
  updateNotificationCount?: boolean,
) => {
  try {
    if (!chat.lastMessageId || !chat.lastMessageTimestamp) {
      console.log(
        "[STATEMENTS]: updatePrivateChatById undefined lastMessageId or lastMessageTimestamp",
      );
      return undefined;
    }
    if (updateNotificationCount) {
      return await db.runAsync(
        `
            UPDATE private_chat
              SET 
                lastMessageId = $lastMessageId,
                lastMessageValue = $lastMessageValue,
                lastMessageTimestamp = $lastMessageTimestamp,
                notificationCount = COALESCE(notificationCount, 0) + 1
              WHERE
                id = $id;
            `,
        {
          $lastMessageId: chat.lastMessageId,
          $lastMessageValue: chat.lastMessageValue ?? "Something went wrong",
          $lastMessageTimestamp: chat.lastMessageTimestamp,
          $id: chat.id,
        },
      );
    } else {
      return await db.runAsync(
        `
            UPDATE private_chat
              SET 
                lastMessageId = $lastMessageId,
                lastMessageValue = $lastMessageValue,
                lastMessageTimestamp = $lastMessageTimestamp
              WHERE
                id = $id;
            `,
        {
          $lastMessageId: chat.lastMessageId,
          $lastMessageValue: chat.lastMessageValue ?? "Something went wrong",
          $lastMessageTimestamp: chat.lastMessageTimestamp,
          $id: chat.id,
        },
      );
    }
  } catch (error) {
    console.log("[STATEMENTS]: updatePrivateChatById", error);
  }
};

export const resetPrivateChatNotificationCount = async (
  db: SQLiteDatabase,
  chatId: number,
) => {
  try {
    return await db.runAsync(
      `
          UPDATE private_chat
            SET 
              notificationCount = 0
            WHERE
              id = $id;
          `,
      {
        $id: chatId,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: resetPrivateChatNotificationCount", error);
  }
};
