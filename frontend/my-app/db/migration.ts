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

  console.log("[DATABASE_MIGRATION]: DB VERSION: %d", currentDbVersion);

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    console.log(
      "[DATABASE_MIGRATION]: ----------------------------------------------------0v",
    );

    await loadDatabaseSchema(db);

    currentDbVersion = 1;
  }
  if (currentDbVersion === 1) {
    console.log(
      "[DATABASE_MIGRATION]: ----------------------------------------------------1v",
    );

    users.forEach(async (user) => {
      await insertContact(db, user);
    });

    privateChats.forEach(async (pChat) => {
      await insertPrivateChat(db, pChat);
    });

    messages.forEach(async (msg) => {
      await insertMessage(db, msg);
    });

    currentDbVersion = 2;
  }
  if (currentDbVersion === 2) {
    console.log(
      "[DATABASE_MIGRATION]: ----------------------------------------------------2v",
    );
    await addMessageTableIndexes(db);
    currentDbVersion = 3;
  }
  if (currentDbVersion === 3) {
    console.log(
      "[DATABASE_MIGRATION]: ----------------------------------------------------3v",
    );
    //TODO
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
