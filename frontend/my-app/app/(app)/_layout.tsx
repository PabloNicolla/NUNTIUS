import { useSession } from "@/providers/session-provider";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { Redirect, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

const TabIcon = ({
  color,
  focused,
  icon,
  iconFocused,
}: {
  color: string;
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
}) => {
  return (
    <View className="">
      <Ionicons name={focused ? icon : iconFocused} size={28} color={color} />
    </View>
  );
};

export default function AppLayout() {
  const session = useSession();

  console.log(session.isLoggedIn, "AppLayout");

  if (!session.isLoggedIn) {
    return <Redirect href={"/landing"} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              icon="home"
              iconFocused="home-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "groups",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              icon="people"
              iconFocused="people-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "chat",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              icon="chatbox-ellipses"
              iconFocused="chatbox-ellipses-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              icon="person-circle"
              iconFocused="person-circle-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}
