import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { PaperProvider } from "react-native-paper";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SessionProvider } from "@/providers/session-provider";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { getAllChat, insertChatStatement } from "@/db/statements";
import { chats_data } from "@/test-data/chat-data";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SessionProvider>
      <PaperProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <SQLiteProvider
            databaseName="test.db"
            onInit={migrateDbIfNeeded}
            options={{ enableChangeListener: true }}
          >
            <Stack>
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="(landing)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="sos" options={{ headerShown: false }} />
            </Stack>
          </SQLiteProvider>
        </ThemeProvider>
      </PaperProvider>
    </SessionProvider>
  );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 2;
  let version = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  let currentDbVersion = version?.user_version ?? 0;

  const allChats = await getAllChat(db);

  // console.log("hel", currentDbVersion, allChats, 22);

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    console.log("----------------------------------------------------1v");

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS chat (
        id INTEGER PRIMARY KEY NOT NULL,
        username TEXT NOT NULL,
        chatName TEXT NOT NULL,
        lastMessageTime INTEGER NOT NULL,
        recentMessage TEXT NOT NULL,
        imageURL TEXT NOT NULL
      );
    `);

    const insertChat = await insertChatStatement(db);

    const result = await insertChat.executeAsync({
      $id: 0,
      $username: "first user name",
      $chatName: "first user name",
      $lastMessageTime: Date.now() + 1000,
      $recentMessage: "nothing here",
      $imageURL: "https://cataas.com/cat",
    });

    console.log("first user name:", result.lastInsertRowId, result.changes);

    currentDbVersion = 1;
  }
  if (currentDbVersion === 1) {
    console.log("----------------------------------------------------2v");

    const insertChat = await insertChatStatement(db);

    chats_data.forEach(async (chat) => {
      const result = await insertChat.executeAsync({
        $id: chat.id,
        $username: chat.username,
        $chatName: chat.chatName,
        $lastMessageTime: chat.lastMessageTime,
        $recentMessage: chat.recentMessage,
        $imageURL: chat.imageURL,
      });
      console.log(result.lastInsertRowId, result.changes);
    });

    currentDbVersion = 2;
  }
  if (currentDbVersion === 3) {
    // TODO
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
