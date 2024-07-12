import { useColorScheme, View } from "react-native";
import React from "react";
import { TouchableRipple } from "react-native-paper";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";

export type ChatOptionProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const ChatOption = ({ title, icon }: ChatOptionProps) => {
  const theme = useColorScheme() ?? "light";

  return (
    <View className="h-[80] w-full">
      <TouchableRipple
        className={`z-20 flex-1`}
        onPress={() => {
          console.log("Pressed");
        }}
        rippleColor={
          theme === "dark" ? "rgba(255, 255, 255, .32)" : "rgba(0, 0, 0, .15)"
        }
      >
        <View className="flex-1 flex-row items-center gap-x-2 px-2">
          <View className="mr-2 items-center justify-center rounded-full bg-primary-light p-2">
            <Ionicons name={icon} size={20} color={"white"} />
          </View>

          <ThemedText className="text-lg font-bold">{title}</ThemedText>
        </View>
      </TouchableRipple>
    </View>
  );
};

export default ChatOption;
