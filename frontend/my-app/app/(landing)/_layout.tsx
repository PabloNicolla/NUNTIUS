import React from "react";
import { Slot, Stack } from "expo-router";

export default function LandingLayout() {
  return (
    <Stack>
      <Stack.Screen name="main" options={{ headerShown: false }} />
    </Stack>
  );
}
