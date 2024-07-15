import { SQLiteDatabase } from "expo-sqlite";
import { Contact, Message, PrivateChat } from "./schemaTypes";

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
            sortId
        ) 
        VALUES (
            $senderId,
            $receiverId,
            $value,
            $timestamp,
            $type,
            $status,
            $sortId
        )`,
    {
      $senderId: message.senderId,
      $receiverId: message.senderId,
      $value: message.value,
      $timestamp: message.timestamp,
      $type: message.type,
      $status: message.status,
      $sortId: message.sortId,
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
  return await db.getFirstAsync<Contact>(`SELECT * FROM contact WHERE $id`, {
    $id: contactId,
  });
};
export const getFirstMessage = async (
  db: SQLiteDatabase,
  messageId: number,
) => {
  return await db.getFirstAsync<Message>(`SELECT * FROM message WHERE $id`, {
    $id: messageId,
  });
};
