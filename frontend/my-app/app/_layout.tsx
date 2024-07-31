import { Suspense, useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SessionProvider, SessionUser } from "@/providers/session-provider";
import { migrateDbIfNeeded } from "@/db/migration";
import SplashScreenL from "@/components/splash-screen";
import { WebsocketControllerProvider } from "@/providers/ws-controller-provider";
import { ErrorBoundary } from "@/components/errors/simple-error-boundary";
import { Try } from "expo-router/build/views/Try";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

  console.log("root layout");

  return (
    <Try catch={ErrorBoundary}>
      <Suspense fallback={<SplashScreenL />}>
        <SQLiteProvider
          databaseName="local.db"
          onInit={migrateDbIfNeeded}
          options={{ enableChangeListener: true }}
          useSuspense
        >
          <WebsocketControllerProvider>
            <SessionProvider>
              <PaperProvider>
                <KeyboardProvider statusBarTranslucent={true}>
                  <Stack>
                    <Stack.Screen
                      name="(app)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(landing)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(auth)"
                      options={{ headerShown: false }}
                    />
                  </Stack>
                </KeyboardProvider>
              </PaperProvider>
            </SessionProvider>
          </WebsocketControllerProvider>
        </SQLiteProvider>
      </Suspense>
    </Try>
  );
}
