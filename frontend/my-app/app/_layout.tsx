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

  testing();

  return (
    <SessionProvider>
      <PaperProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="(landing)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </PaperProvider>
    </SessionProvider>
  );
}

import * as SQLite from "expo-sqlite";

type TestingType = {
  id: number;
  value: string;
  intValue: number;
};

const testing = async () => {
  const db = await SQLite.openDatabaseAsync("mydb1");

  // `execAsync()` is useful for bulk queries when you want to execute altogether.
  // Please note that `execAsync()` does not escape parameters and may lead to SQL injection.
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
    INSERT INTO test (value, intValue) VALUES ('test1', 123);
    INSERT INTO test (value, intValue) VALUES ('test2', 456);
    INSERT INTO test (value, intValue) VALUES ('test3', 789);
`);

  // `runAsync()` is useful when you want to execute some write operations.
  const result = await db.runAsync(
    "INSERT INTO test (value, intValue) VALUES (?, ?)",
    "aaa",
    100,
  );
  console.log(result.lastInsertRowId, result.changes);
  await db.runAsync("UPDATE test SET intValue = ? WHERE value = ?", 999, "aaa"); // Binding unnamed parameters from variadic arguments
  await db.runAsync("UPDATE test SET intValue = ? WHERE value = ?", [
    999,
    "aaa",
  ]); // Binding unnamed parameters from array
  await db.runAsync("DELETE FROM test WHERE value = $value", { $value: "aaa" }); // Binding named parameters from object

  // `getFirstAsync()` is useful when you want to get a single row from the database.
  const firstRow = await db.getFirstAsync<TestingType>("SELECT * FROM test");
  console.log(firstRow?.id, firstRow?.value, firstRow?.intValue);

  // `getAllAsync()` is useful when you want to get all results as an array of objects.
  const allRows = await db.getAllAsync<TestingType>("SELECT * FROM test");
  for (const row of allRows) {
    console.log(row?.id, row?.value, row?.intValue);
  }

  // `getEachAsync()` is useful when you want to iterate SQLite query cursor.
  for await (const row of db.getEachAsync<TestingType>("SELECT * FROM test")) {
    console.log(row.id, row.value, row.intValue);
  }
};
