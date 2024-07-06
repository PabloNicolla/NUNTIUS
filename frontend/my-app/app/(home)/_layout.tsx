import { Redirect, Stack, Tabs } from "expo-router";
import React from "react";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const session = false;
  const colorScheme = useColorScheme();

  if (!session) {
    return <Redirect href={"/landing"} />;
  }

  return <Stack />;
}
