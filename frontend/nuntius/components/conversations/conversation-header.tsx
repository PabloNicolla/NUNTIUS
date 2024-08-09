import React from "react";
import { View, useColorScheme } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed-view";
import { TouchableRipple } from "react-native-paper";

type ConversationHeaderProps = {
  headerHeight: number;
};

const ConversationHeader = ({ headerHeight }: ConversationHeaderProps) => {
  const theme = useColorScheme() ?? "dark";

  return (
    <ThemedView
      className={`h-[${headerHeight}] flex-row items-center justify-between px-2`}
    >
      <ThemedText>NUNTIUS</ThemedText>
      <View className="overflow-hidden rounded-full">
        <TouchableRipple
          onPress={async () => {
            console.log("config");
          }}
          rippleColor={
            theme === "dark" ? "rgba(255, 255, 255, .32)" : "rgba(0, 0, 0, .15)"
          }
        >
          <Ionicons
            name="ellipsis-horizontal"
            color={theme === "dark" ? "white" : "black"}
            size={25}
          />
        </TouchableRipple>
      </View>
    </ThemedView>
  );
};

export default ConversationHeader;
