import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SessionProvider } from "@/providers/session-provider";
import { migrateDbIfNeeded } from "@/db/migration";

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
            databaseName="local3.db"
            onInit={migrateDbIfNeeded}
            options={{ enableChangeListener: true }}
          >
            <Stack>
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="(landing)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>
          </SQLiteProvider>
        </ThemeProvider>
      </PaperProvider>
    </SessionProvider>
  );
}
