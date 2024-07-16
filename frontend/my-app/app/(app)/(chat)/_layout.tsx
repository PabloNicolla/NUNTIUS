import { Stack } from "expo-router";
import React from "react";

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen name="addContact" options={{ headerShown: false }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="contactScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
