import BottomNavbar from "@/components/custom-nav-bar/bottom-nav-bar";
import { AvatarModalProvider } from "@/hooks/providers/avatarModal-provider";
import { ChatSelectionProvider } from "@/hooks/providers/chat-selection-provider";
import { useSession } from "@/hooks/providers/session-provider";
import { Redirect, Stack } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useRef, useState } from "react";
import { WebSocketProvider } from "@/hooks/providers/websocket-provider";
import { ChatSelectedProvider } from "@/hooks/providers/chat-selected-provider";
import SplashScreenL from "@/components/splash-screen";
import { migrateDbIfNeeded } from "@/lib/db/migration";

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

  return (
    <WebSocketProvider db={db}>
      <ChatSelectedProvider>
        <ChatSelectionProvider>
          <AvatarModalProvider>
            <BottomNavbar />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(chat)" options={{ headerShown: false }} />
              <Stack.Screen name="(profile)" options={{ headerShown: false }} />
            </Stack>
          </AvatarModalProvider>
        </ChatSelectionProvider>
      </ChatSelectedProvider>
    </WebSocketProvider>
  );
}
