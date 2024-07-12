import { useThemeColor } from "@/hooks/useThemeColor";
import { useSession } from "@/providers/session-provider";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { Redirect, Slot, Stack, Tabs } from "expo-router";
import React from "react";
import { useColorScheme, View } from "react-native";
import { BottomNavigation, TouchableRipple } from "react-native-paper";

export default function ChatLayout() {
  const session = useSession();

  const theme = useColorScheme() ?? "light";

  console.log(session.isLoggedIn, "AppLayout");

  if (session.isLoggedIn) {
    return <Redirect href={"/landing"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true }} />
      <Stack.Screen name="sos2" options={{ headerShown: true }} />
    </Stack>
  );
}
