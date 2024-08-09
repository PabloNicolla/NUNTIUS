import { SQLiteDatabase } from "expo-sqlite";
import { addMessageTableIndexes, loadDatabaseSchema } from "./schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SessionUser } from "@/hooks/providers/session-provider";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const user = await CustomGetUser();
  const DATABASE_VERSION = 2;

  let version = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  let currentDbVersion = version?.user_version ?? 0;

  console.log("[DATABASE_MIGRATION]: DB VERSION: %d", currentDbVersion);

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  try {
    if (currentDbVersion === 0) {
      console.log("[DATABASE_MIGRATION]: 0v");
      await db.execAsync(`PRAGMA journal_mode = WAL;`);
      await db.execAsync(`PRAGMA user_version = 1`);
    }

    if (!user) {
      console.log("[DATABASE_MIGRATION]: No user to load");
      await db.execAsync(`PRAGMA user_version = 1`);
      return;
    }
    const dbPrefix = user.id.replaceAll("-", "_");
    console.log("[DATABASE_MIGRATION]: DB PREFIX: %s", dbPrefix);

    if (currentDbVersion === 1) {
      console.log("[DATABASE_MIGRATION]: 1v");
      await loadDatabaseSchema(db, dbPrefix);
      await addMessageTableIndexes(db, dbPrefix);
      currentDbVersion = 2;
    }

    await db.execAsync(`PRAGMA user_version = ${currentDbVersion}`);
  } catch (error) {
    console.log("[DATABASE_MIGRATION]: Migration transaction error", error);
  }
}

const CustomGetUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("STORED_USER");
    if (jsonValue != null) {
      const user: SessionUser = JSON.parse(jsonValue);
      return user.id ? user : null;
    }
    return null;
  } catch (error) {
    console.log("[SESSION_PROVIDER]: failed in retrieving STORED_USER", error);
  }
};
