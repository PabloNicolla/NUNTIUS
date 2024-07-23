import { SQLiteDatabase } from "expo-sqlite";
import {
  Contact,
  Message,
  PrivateChat,
  PrivateChatJoinContact,
  ReceiverType,
} from "./schemaTypes";

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

export const insertContact = async (db: SQLiteDatabase, contact: Contact) => {
  try {
    return await db.runAsync(
      `INSERT INTO contact (
              id,
              username,
              name,
              imageURL
          ) 
          VALUES (
              $id,
              $username,
              $name,
              $imageURL
          )`,
      {
        $id: contact.id,
        $username: contact.username,
        $name: contact.name,
        $imageURL: contact.imageURL ?? null,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: insertContact", error);
  }
};

export const insertMessage = async (db: SQLiteDatabase, message: Message) => {
  try {
    return await db.runAsync(
      `INSERT INTO message (
              senderId,
              receiverId,
  
              value,
              timestamp,
              type,
              status,
  
              receiverType,
              chatId,
              senderReferenceId,
              condition
          ) 
          VALUES (
              $senderId,
              $receiverId,
  
              $value,
              $timestamp,
              $type,
              $status,
  
              $receiverType,
              $chatId,
              $senderReferenceId,
              $condition
          )`,
      {
        $senderId: message.senderId,
        $receiverId: message.receiverId,

        $value: message.value,
        $timestamp: message.timestamp,
        $type: message.type,
        $status: message.status,

        $receiverType: message.receiverType,
        $chatId: message.chatId,
        $senderReferenceId: message.senderReferenceId,
        $condition: message.condition,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: insertMessage", error);
  }
};

export const getAllPrivateChats = async (db: SQLiteDatabase) => {
  try {
    return await db.getAllAsync<PrivateChat>(`SELECT * FROM private_chat`);
  } catch (error) {
    console.log("[STATEMENTS]: getAllPrivateChats", error);
  }
};
export const getAllContacts = async (db: SQLiteDatabase) => {
  try {
    return await db.getAllAsync<Contact>(`SELECT * FROM contact`);
  } catch (error) {
    console.log("[STATEMENTS]: getAllContacts", error);
  }
};
export const getAllMessages = async (db: SQLiteDatabase) => {
  try {
    return await db.getAllAsync<Message>(`SELECT * FROM message`);
  } catch (error) {
    console.log("[STATEMENTS]: getAllMessages", error);
  }
};

export const getFirstContact = async (
  db: SQLiteDatabase,
  contactId: number,
) => {
  try {
    return await db.getFirstAsync<Contact>(
      `SELECT * FROM contact WHERE $id = id`,
      {
        $id: contactId,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: getFirstContact", error);
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

export const getFirstPrivateChat = async (
  db: SQLiteDatabase,
  privateChatId: number,
) => {
  try {
    return await db.getFirstAsync<PrivateChat>(
      `SELECT * FROM private_chat WHERE $id = id`,
      {
        $id: privateChatId,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: getFirstPrivateChat", error);
  }
};

export const getAllPrivateChatsJoinContacts = async (db: SQLiteDatabase) => {
  try {
    return await db.getAllAsync<PrivateChatJoinContact>(`
      SELECT 
          pc.id,
          pc.contactId,
          pc.lastMessageId,
          pc.lastMessageValue,
          pc.lastMessageTimestamp,
          pc.notificationCount,
          c.imageURL,
          c.name,
          c.username
      FROM private_chat pc
          JOIN contact c ON pc.contactId = c.id
    `);
  } catch (error) {
    console.log("[STATEMENTS]: getAllPrivateChatsJoinContacts", error);
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
