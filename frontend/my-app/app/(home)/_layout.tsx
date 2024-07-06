import { useSession } from "@/providers/session-provider";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { Redirect, Stack, Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const session = useSession();

  console.log(session.isLoggedIn, "index.tsx");

  if (!session.isLoggedIn) {
    return <Redirect href={"/landing"} />;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="something"
        options={{
          title: "something",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "favorites",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
