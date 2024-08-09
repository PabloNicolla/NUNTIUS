import { SQLiteDatabase } from "expo-sqlite";
import { Contact } from "../schemaTypes";

export const insertContact = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  contact: Contact,
) => {
  try {
    return await db.runAsync(
      `INSERT INTO _${dbPrefix}_contact (
                id,
                username,
                first_name,
                last_name,
                imageURL
            ) 
            VALUES (
                $id,
                $username,
                $first_name,
                $last_name,
                $imageURL
            )`,
      {
        $id: contact.id,
        $username: contact.username,
        $first_name: contact.first_name,
        $last_name: contact.last_name,
        $imageURL: contact.imageURL ?? null,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: insertContact", error);
  }
};
