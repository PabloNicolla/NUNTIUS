import { SQLiteDatabase } from "expo-sqlite";
import { Contact } from "../schemaTypes";

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
