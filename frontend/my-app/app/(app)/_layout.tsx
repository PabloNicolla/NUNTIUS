import BottomNavbar from "@/components/custom-nav-bar/bottom-nav-bar";
import { Contact } from "@/db/schemaTypes";
import { AvatarModalProvider } from "@/providers/avatarModal-provider";
import { SelectionProvider } from "@/providers/chat-provider";
import { useSession } from "@/providers/session-provider";
import { Redirect, Stack } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useRef } from "react";
import { WebSocketProvider } from "@/providers/websocket-provider";

export default function AppLayout() {
  const session = useSession();
  const mydb = useRef(useSQLiteContext());

  console.log("[APP_LAYOUT]: IS USER LOGGED IN:", session.isLoggedIn);

  if (session.isLoggedIn) {
    return <Redirect href={"/landing"} />;
  }

  setTimeout(async () => {
    console.log("MZZYAY");
    console.log(mydb.current);

    // const tt = await mydb.current.getAllAsync<Contact>(`SELECT * FROM contact`);
    // console.log(tt);
  }, 1000);

  return (
    <WebSocketProvider>
      <SelectionProvider>
        <AvatarModalProvider>
          <BottomNavbar />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(chat)" options={{ headerShown: false }} />
          </Stack>
        </AvatarModalProvider>
      </SelectionProvider>
    </WebSocketProvider>
  );
}
