import BottomNavbar from "@/components/custom-nav-bar/bottom-nav-bar";
import { AvatarModalProvider } from "@/providers/avatarModal-provider";
import { ChatSelectionProvider } from "@/providers/chat-selection-provider";
import { useSession } from "@/providers/session-provider";
import { Redirect, Stack } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useRef, useState } from "react";
import { WebSocketProvider } from "@/providers/websocket-provider";
import { ChatSelectedProvider } from "@/providers/chat-selection-provider copy";
import SplashScreenL from "@/components/splash-screen";
import { migrateDbIfNeeded } from "@/db/migration";

export default function AppLayout() {
  const { user, loadStoredUser } = useSession();
  const db = useRef(useSQLiteContext());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateUser = async () => {
      if (!user) {
        await loadStoredUser();
      }
      await migrateDbIfNeeded(db.current);
      setLoading(false);
    };

    validateUser();
  }, [user, loadStoredUser]);

  if (loading) {
    return <SplashScreenL />;
  }

  if (!user) {
    return <Redirect href="/landing" />;
  }

  if (!user.first_name) {
    return <Redirect href="/change_name" />;
  }

  console.log("app layout");

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
