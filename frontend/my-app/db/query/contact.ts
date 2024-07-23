import { SQLiteDatabase } from "expo-sqlite";
import { Contact } from "../schemaTypes";

export const getAllContacts = async (db: SQLiteDatabase) => {
  try {
    return await db.getAllAsync<Contact>(`SELECT * FROM contact`);
  } catch (error) {
    console.log("[STATEMENTS]: getAllContacts", error);
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