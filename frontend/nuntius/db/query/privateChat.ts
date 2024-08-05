import { SQLiteDatabase } from "expo-sqlite";
import { PrivateChat, PrivateChatJoinContact } from "../schemaTypes";

export const getAllPrivateChats = async (
  db: SQLiteDatabase,
  dbPrefix: string,
) => {
  try {
    return await db.getAllAsync<PrivateChat>(
      `SELECT * FROM _${dbPrefix}_private_chat`,
    );
  } catch (error) {
    console.log("[STATEMENTS]: getAllPrivateChats", error);
  }
};

export const getFirstPrivateChat = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  privateChatId: PrivateChat["id"],
) => {
  try {
    return await db.getFirstAsync<PrivateChat>(
      `SELECT * FROM _${dbPrefix}_private_chat WHERE $id = id`,
      {
        $id: privateChatId,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: getFirstPrivateChat", error);
  }
};

export const getAllPrivateChatsJoinContacts = async (
  db: SQLiteDatabase,
  dbPrefix: string,
) => {
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
            c.first_name,
            c.last_name,
            c.username
        FROM _${dbPrefix}_private_chat pc
            JOIN _${dbPrefix}_contact c ON pc.contactId = c.id
      `);
  } catch (error) {
    console.log("[STATEMENTS]: getAllPrivateChatsJoinContacts", error);
  }
};
