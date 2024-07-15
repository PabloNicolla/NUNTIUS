import { SQLiteDatabase } from "expo-sqlite";
import { Contact, Message, PrivateChat } from "./schemaTypes";

export const insertPrivateChatStmt = async (db: SQLiteDatabase) => {
  return await db.prepareAsync(`
    INSERT INTO private_chat (
            contact_id,
            last_message_id
        ) 
        VALUES (
            $contact_id,
            $last_message_id
        )
    `);
};

export const insertPrivateChat = async (
  db: SQLiteDatabase,
  chat: PrivateChat,
) => {
  return await db.runAsync(
    `INSERT INTO private_chat (
            contact_id,
            last_message_id
        ) 
        VALUES (
            $contact_id,
            $last_message_id
        )`,
    {
      $contact_id: chat.contactId,
      $last_message_id: chat.lastMessageId ?? null,
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
      $imageURL: contact.imageUrl ?? null,
    },
  );
};

export const insertMessage = async (db: SQLiteDatabase, message: Message) => {
  return await db.runAsync(
    `INSERT INTO message (
            sender_id,
            receiver_id,
            value,
            timestamp,
            type,
            status,
            sort_id
        ) 
        VALUES (
            $sender_id,
            $receiver_id,
            $value,
            $timestamp,
            $type,
            $status,
            $sort_id
        )`,
    {
      $sender_id: message.senderId,
      $receiver_id: message.senderId,
      $value: message.value,
      $timestamp: message.timestamp,
      $type: message.type,
      $status: message.status,
      $sort_id: message.sortId,
    },
  );
};

export const getAllPrivateChats = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<PrivateChat>(`SELECT * FROM private_chat`);
};
export const getAllContacts = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<PrivateChat>(`SELECT * FROM contact`);
};
export const getAllMessages = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<PrivateChat>(`SELECT * FROM message`);
};
