import { SQLiteDatabase } from "expo-sqlite";
import { loadDatabaseSchema } from "./schema";
import { insertContact, insertPrivateChat } from "./statements";
import { users } from "@/test-data/contact-data";
import { privateChats } from "@/test-data/private-chat-data";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 2;

  let version = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  let currentDbVersion = version?.user_version ?? 0;

  console.log("DB VERSION", currentDbVersion);

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    console.log("----------------------------------------------------0v");

    await loadDatabaseSchema(db);

    currentDbVersion = 1;
  }
  if (currentDbVersion === 1) {
    console.log("----------------------------------------------------1v");

    users.forEach(async (user) => {
      await insertContact(db, user);
    });

    privateChats.forEach(async (pChat) => {
      await insertPrivateChat(db, pChat);
    });

    currentDbVersion = 2;
  }
  if (currentDbVersion === 2) {
    console.log("----------------------------------------------------2v");
    //TODO
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
