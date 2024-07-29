import BottomNavbar from "@/components/custom-nav-bar/bottom-nav-bar";
import { AvatarModalProvider } from "@/providers/avatarModal-provider";
import { ChatSelectionProvider } from "@/providers/chat-selection-provider";
import { useSession } from "@/providers/session-provider";
import { Redirect, Stack } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useRef } from "react";
import { WebSocketProvider } from "@/providers/websocket-provider";
import { ChatSelectedProvider } from "@/providers/chat-selection-provider copy";

export default function AppLayout() {
  const { user } = useSession();
  const db = useRef(useSQLiteContext());

  console.log("[APP_LAYOUT]: IS USER LOGGED IN:", !!user);

  if (!user) {
    return <Redirect href={"/landing"} />;
  }

  return (
    <WebSocketProvider db={db}>
      <ChatSelectedProvider>
        <ChatSelectionProvider>
          <AvatarModalProvider>
            <BottomNavbar />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(chat)" options={{ headerShown: false }} />
            </Stack>
          </AvatarModalProvider>
        </ChatSelectionProvider>
      </ChatSelectedProvider>
    </WebSocketProvider>
  );
}
