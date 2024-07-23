import { SQLiteDatabase } from "expo-sqlite";
import { Message, ReceiverType } from "../schemaTypes";

export const getAllMessages = async (db: SQLiteDatabase) => {
  try {
    return await db.getAllAsync<Message>(`SELECT * FROM message`);
  } catch (error) {
    console.log("[STATEMENTS]: getAllMessages", error);
  }
};

export const getFirstMessage = async (
  db: SQLiteDatabase,
  messageId: number,
) => {
  try {
    return await db.getFirstAsync<Message>(
      `SELECT * FROM message WHERE $id = id`,
      {
        $id: messageId,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: getFirstMessage", error);
  }
};

export const getAllMessagesByChatIdWithPagination = async (
  db: SQLiteDatabase,
  chatId: number,
  receiverType: ReceiverType,
  limit: number,
  offset: number,
  sort?: boolean,
) => {
  try {
    return await db.getAllAsync<Message>(
      `
        SELECT *
        FROM message
        WHERE 
          $chatId = chatId
          AND $receiverType = receiverType 
        ${sort ? "ORDER BY timestamp DESC" : ""}
        LIMIT $limit
        OFFSET $offset;
        `,
      {
        $chatId: chatId,
        $receiverType: receiverType,
        $limit: limit,
        $offset: offset,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: getAllMessagesByChatId", error);
  }
};

export const getFirstMessageBySenderRef = async (
  db: SQLiteDatabase,
  chatId: number,
  senderReferenceId: number,
  senderId: number,
) => {
  try {
    return await db.getFirstAsync<Message>(
      `
      SELECT * 
      FROM message 
      WHERE 
        $chatId = chatId
        AND $senderReferenceId = senderReferenceId
        AND $senderId = senderId;
        `,
      {
        $chatId: chatId,
        $senderReferenceId: senderReferenceId,
        $senderId: senderId,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: getFirstMessage", error);
  }
};
