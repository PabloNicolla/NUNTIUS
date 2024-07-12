import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TopNavBar from "@/components/TopNavBar";
import { MaterialIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { Image, Pressable, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatLayout() {
  const theme = useColorScheme() ?? "light";

  return (
    <Stack>
      <Stack.Screen
        name="chatOptions"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="addContact" options={{ headerShown: false }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
