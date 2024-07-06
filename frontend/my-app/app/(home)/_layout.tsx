import useSession from "@/hooks/useSession";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function TabLayout() {
  const session = useSession();

  if (!session.isLoggedIn) {
    return <Redirect href={"/landing"} />;
  }

  return <Stack />;
}
