import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SessionProvider } from "@/providers/session-provider";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppLayout from "./(app)/_layout";
import AuthLayout from "./(auth)/_layout";
import LandingLayout from "./(landing)/_layout";

type RootStackParamList = {
  "(app)": undefined;
  "(landing)": undefined;
  "(auth)": { email?: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

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
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {/* <Slot /> */}
        <RootStack.Navigator initialRouteName="(app)">
          <RootStack.Screen
            name="(app)"
            component={AppLayout}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="(auth)"
            component={AuthLayout}
            options={{ headerShown: false }}
            // initialParams={{email: ""}}
          />
          <RootStack.Screen
            name="(landing)"
            component={LandingLayout}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
        {/* <Stack>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="(landing)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack> */}
      </ThemeProvider>
    </SessionProvider>
  );
}
