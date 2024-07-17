import { SQLiteDatabase } from "expo-sqlite";
import {
  Contact,
  Message,
  PrivateChat,
  PrivateChatJoinContact,
} from "./schemaTypes";

export const insertPrivateChat = async (
  db: SQLiteDatabase,
  chat: PrivateChat,
) => {
  return await db.runAsync(
    `INSERT INTO private_chat (
            contactId,
            lastMessageId,
            lastMessageValue,
            lastMessageTimestamp
        ) 
        VALUES (
            $contactId,
            $lastMessageId,
            $lastMessageValue,
            $lastMessageTimestamp
        )`,
    {
      $contactId: chat.contactId,
      $lastMessageId: chat.lastMessageId ?? null,
      $lastMessageValue: chat.lastMessageValue ?? null,
      $lastMessageTimestamp: chat.lastMessageTimestamp ?? null,
    },
  );
};

export const insertContact = async (db: SQLiteDatabase, contact: Contact) => {
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
};

export const insertMessage = async (db: SQLiteDatabase, message: Message) => {
  return await db.runAsync(
    `INSERT INTO message (
            senderId,
            receiverId,
            value,
            timestamp,
            type,
            status,
            privateChatId
        ) 
        VALUES (
            $senderId,
            $receiverId,
            $value,
            $timestamp,
            $type,
            $status,
            $privateChatId
        )`,
    {
      $senderId: message.senderId,
      $receiverId: message.senderId,
      $value: message.value,
      $timestamp: message.timestamp,
      $type: message.type,
      $status: message.status,
      $privateChatId: message.privateChatId,
    },
  );
};

export const getAllPrivateChats = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<PrivateChat>(`SELECT * FROM private_chat`);
};
export const getAllContacts = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<Contact>(`SELECT * FROM contact`);
};
export const getAllMessages = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<Message>(`SELECT * FROM message`);
};

export const getFirstContact = async (
  db: SQLiteDatabase,
  contactId: number,
) => {
  return await db.getFirstAsync<Contact>(
    `SELECT * FROM contact WHERE $id = id`,
    {
      $id: contactId,
    },
  );
};
export const getFirstMessage = async (
  db: SQLiteDatabase,
  messageId: number,
) => {
  return await db.getFirstAsync<Message>(
    `SELECT * FROM message WHERE $id = id`,
    {
      $id: messageId,
    },
  );
};
export const getFirstPrivateChat = async (
  db: SQLiteDatabase,
  privateChatId: number,
) => {
  return await db.getFirstAsync<PrivateChat>(
    `SELECT * FROM private_chat WHERE $id = id`,
    {
      $id: privateChatId,
    },
  );
};

export const getAllPrivateChatsJoinContacts = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<PrivateChatJoinContact>(`
    SELECT 
        pc.id,
        pc.contactId,
        pc.lastMessageId,
        pc.lastMessageValue,
        pc.lastMessageTimestamp,
        c.imageURL,
        c.name,
        c.username
    FROM private_chat pc
        JOIN contact c ON pc.contactId = c.id
  `);
};
