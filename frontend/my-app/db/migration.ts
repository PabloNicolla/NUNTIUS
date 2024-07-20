import { SQLiteDatabase } from "expo-sqlite";
import { addMessageTableIndexes, loadDatabaseSchema } from "./schema";
import { insertContact, insertMessage, insertPrivateChat } from "./statements";
import { users } from "@/test-data/contact-data";
import { privateChats } from "@/test-data/private-chat-data";
import { messages } from "@/test-data/message-data";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 3;

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

    messages.forEach(async (msg) => {
      const ret = await insertMessage(db, msg);
      console.log(ret);
    });

    currentDbVersion = 2;
  }
  if (currentDbVersion === 2) {
    console.log("----------------------------------------------------2v");
    await addMessageTableIndexes(db);
    currentDbVersion = 3;
  }
  if (currentDbVersion === 3) {
    console.log("----------------------------------------------------3v");
    //TODO
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
