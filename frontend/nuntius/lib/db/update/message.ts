import { SQLiteDatabase } from "expo-sqlite";
import { Message } from "../schemaTypes";
import { messageStatus } from "@/lib/websocket/ws-types";

export const updateMessage = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  message: Message,
) => {
  try {
    return await db.runAsync(
      `UPDATE _${dbPrefix}_message
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

export const updateMessageStatus = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  message: messageStatus,
) => {
  try {
    return await db.runAsync(
      `UPDATE _${dbPrefix}_message
          SET
            status = $status,
            condition = $condition
          WHERE
            id = $id;
            `,
      {
        $status: message.status,
        $condition: message.condition,
        $id: message.id,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: updateMessage", error);
  }
};

export const updateMessagesStatusBulk = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  messages: messageStatus[],
) => {
  const updateQueries = messages.map((message) => {
    return db.runAsync(
      `UPDATE _${dbPrefix}_message
          SET
            status = $status,
            condition = $condition
          WHERE
            id = $id;
            `,
      {
        $status: message.status,
        $condition: message.condition,
        $id: message.id,
      },
    );
  });

  try {
    await Promise.all(updateQueries);
  } catch (error) {
    console.log("[STATEMENTS]: updateMessagesBulk", error);
  }
};
