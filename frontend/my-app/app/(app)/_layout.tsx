import { useSession } from "@/providers/session-provider";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function AppLayout() {
  const session = useSession();

  console.log(session.isLoggedIn, "AppLayout");

  if (session.isLoggedIn) {
    return <Redirect href={"/landing"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(chat)" options={{ headerShown: false }} />
    </Stack>
  );
}
