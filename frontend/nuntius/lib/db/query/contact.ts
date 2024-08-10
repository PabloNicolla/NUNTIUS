import { SQLiteDatabase } from "expo-sqlite";
import { Contact, PrivateChat } from "../schemaTypes";

export const getAllContacts = async (db: SQLiteDatabase, dbPrefix: string) => {
  try {
    return await db.getAllAsync<Contact>(`SELECT * FROM _${dbPrefix}_contact`);
  } catch (error) {
    console.log("[STATEMENTS]: getAllContacts", error);
  }
};

export const getFirstContact = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  contactId: PrivateChat["id"],
) => {
  try {
    return await db.getFirstAsync<Contact>(
      `SELECT * FROM _${dbPrefix}_contact WHERE $id = id`,
      {
        $id: contactId,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: getFirstContact", error);
  }
};

export const getFirstContactByRowId = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  rowId: number,
) => {
  try {
    return await db.getFirstAsync<Contact>(
      `SELECT * FROM _${dbPrefix}_contact WHERE $rowId = rowId`,
      {
        $rowId: rowId,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: getFirstContactByRowId", error);
  }
};
