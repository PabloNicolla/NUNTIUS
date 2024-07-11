import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSession } from "@/providers/session-provider";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { CommonActions } from "@react-navigation/native";
import { Redirect, Stack, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Easing,
  Pressable,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { BottomNavigation, shadow, TouchableRipple } from "react-native-paper";

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

  if (session.isLoggedIn) {
    return <Redirect href={"/landing"} />;
  }

  const theme = useColorScheme() ?? "light";

  const navBgColor = useThemeColor({}, "background");
  const navBorderColor = useThemeColor({}, "primary");
  const navLabelColor = useThemeColor({}, "text");
  const navIconBgColor = useThemeColor(
    { dark: "#0062ff80", light: "#0062ff30" },
    "icon",
  );

  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },
        tabBarHideOnKeyboard: true,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          style={{
            backgroundColor: navBgColor,
            borderTopWidth: 0.5,
            borderColor: navBorderColor,
          }}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({
                focused,
                color: navLabelColor,
                size: 24,
              });
            }
            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label = options.title ?? route.name;

            return label;
          }}
          activeIndicatorStyle={{ backgroundColor: navIconBgColor }}
          renderTouchable={(props) => {
            return (
              // TODO: Add IOS compatibility
              <TouchableRipple
                {...props}
                rippleColor={
                  theme === "dark"
                    ? "rgba(255, 255, 255, .22)"
                    : "rgba(0, 0, 0, .12)"
                }
                className="rounded-full"
              />
            );
          }}
          keyboardHidesNavigationBar={true}
        />
      )}
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
