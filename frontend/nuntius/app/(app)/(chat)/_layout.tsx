import { MessageSelectedProvider } from "@/providers/message-selected-provider";
import { MessageSelectionProvider } from "@/providers/message-selection-provider";
import { Stack } from "expo-router";
import React from "react";

export default function ChatLayout() {
  return (
    <MessageSelectedProvider>
      <MessageSelectionProvider>
        <Stack>
          <Stack.Screen name="addContact" options={{ headerShown: false }} />
          <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="contactScreen" options={{ headerShown: false }} />
        </Stack>
      </MessageSelectionProvider>
    </MessageSelectedProvider>
  );
}
