import { SQLiteDatabase } from "expo-sqlite";
import { Contact, Message, PrivateChat, ReceiverType } from "../schemaTypes";

export const getAllMessages = async (db: SQLiteDatabase, dbPrefix: string) => {
  try {
    return await db.getAllAsync<Message>(`SELECT * FROM _${dbPrefix}_message`);
  } catch (error) {
    console.log("[STATEMENTS]: getAllMessages", error);
  }
};

export const getFirstMessage = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  messageId: Message["id"],
) => {
  try {
    return await db.getFirstAsync<Message>(
      `SELECT * FROM _${dbPrefix}_message WHERE $id = id`,
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
  dbPrefix: string,
  chatId: PrivateChat["id"],
  receiverType: ReceiverType,
  limit: number,
  offset: number,
  sort?: boolean,
) => {
  try {
    return await db.getAllAsync<Message>(
      `
        SELECT *
        FROM _${dbPrefix}_message
        WHERE 
          $chatId = chatId
          AND $receiverType = receiverType 
          ${sort ? "ORDER BY timestamp DESC, senderReferenceId DESC" : ""}
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
  dbPrefix: string,
  chatId: PrivateChat["id"],
  senderReferenceId: Message["senderReferenceId"],
  senderId: Contact["id"],
) => {
  try {
    return await db.getFirstAsync<Message>(
      `
      SELECT * 
      FROM _${dbPrefix}_message 
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

export const getMessagesByIds = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  ids: Message["id"][],
) => {
  try {
    const placeholders = ids.map(() => "?").join(",");
    const query = `
      SELECT
        *
      FROM _${dbPrefix}_message 
      WHERE id IN (${placeholders});
    `;
    return await db.getAllAsync<Message>(query, ids);
  } catch (error) {
    console.log("[STATEMENTS]: deleteMessagesByIds", error);
  }
};

export const getNewestMessageByChatId = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  chatId: PrivateChat["id"],
  receiverType: ReceiverType,
) => {
  try {
    return await db.getFirstAsync<Message>(
      `
        SELECT *
        FROM _${dbPrefix}_message
        WHERE 
          $chatId = chatId
          AND $receiverType = receiverType
        ORDER BY timestamp DESC, senderReferenceId DESC
        `,
      {
        $chatId: chatId,
        $receiverType: receiverType,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: getNewestMessageByChatId", error);
  }
};
