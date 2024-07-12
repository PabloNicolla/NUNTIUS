import { Pressable, useColorScheme } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";

type Props = {
  title: string;
};

const TopNavBar = ({ title }: Props) => {
  const theme = useColorScheme() ?? "light";
  return (
    <ThemedView className="h-14 w-full flex-row items-center border-b-[1px] border-primary-light/50 px-2">
      <Pressable
        onPress={() => {
          router.back();
        }}
      >
        <MaterialIcons
          name="arrow-back"
          size={30}
          color={theme === "light" ? "black" : "white"}
        />
      </Pressable>
      <ThemedText className="pl-4">{title}</ThemedText>
    </ThemedView>
  );
};

export default TopNavBar;
