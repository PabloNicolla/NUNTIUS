import { SQLiteDatabase } from "expo-sqlite";
import { PrivateChat } from "../schemaTypes";

export const updatePrivateChatById = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  chat: PrivateChat,
  updateNotificationCount?: number,
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
            UPDATE _${dbPrefix}_private_chat
              SET 
                lastMessageId = $lastMessageId,
                lastMessageValue = $lastMessageValue,
                lastMessageTimestamp = $lastMessageTimestamp,
                notificationCount = COALESCE(notificationCount, 0) + $notificationCount
              WHERE
                id = $id;
            `,
        {
          $lastMessageId: chat.lastMessageId,
          $lastMessageValue: chat.lastMessageValue ?? "Something went wrong",
          $lastMessageTimestamp: chat.lastMessageTimestamp,
          $notificationCount: updateNotificationCount,
          $id: chat.id,
        },
      );
    } else {
      return await db.runAsync(
        `
            UPDATE _${dbPrefix}_private_chat
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
  dbPrefix: string,
  chatId: string,
) => {
  try {
    return await db.runAsync(
      `
          UPDATE _${dbPrefix}_private_chat
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
