import BottomNavbar from "@/components/custom-nav-bar/bottom-nav-bar";
import { AvatarModalProvider } from "@/providers/avatarModal-provider";
import { SelectionProvider } from "@/providers/chat-provider";
import { useSession } from "@/providers/session-provider";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function AppLayout() {
  const session = useSession();

  console.log("[APP_LAYOUT]: IS USER LOGGED IN:", session.isLoggedIn);

  if (session.isLoggedIn) {
    return <Redirect href={"/landing"} />;
  }

  return (
    <SelectionProvider>
      <AvatarModalProvider>
        <BottomNavbar />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(chat)" options={{ headerShown: false }} />
        </Stack>
      </AvatarModalProvider>
    </SelectionProvider>
  );
}
