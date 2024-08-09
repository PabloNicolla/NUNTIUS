import React, { useState } from "react";
import { View, Pressable, TextInput, useColorScheme } from "react-native";

import { Ionicons } from "@expo/vector-icons";

const ConversationHeaderComponent = ({
  handleSearch,
}: {
  handleSearch: (query: string) => void;
}) => {
  const theme = useColorScheme() ?? "dark";
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View className="w-full items-center justify-center">
      <View className="my-2 h-12 w-[95%] rounded-3xl bg-black/5 px-4 dark:bg-white/10">
        <Pressable
          onPress={async () => {
            console.log("Pressed");
          }}
          className="flex-1 flex-row items-center"
        >
          <Ionicons
            size={20}
            name="search"
            color={theme === "dark" ? "white" : "black"}
          />
          <TextInput
            className="ml-2 flex-1 text-text-light dark:text-text-dark"
            placeholder="Search..."
            placeholderTextColor={
              theme === "dark" ? "rgba(225,232,249,0.7)" : "rgba(6,13,30,0.7)"
            }
            numberOfLines={1}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              handleSearch(text);
            }}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default ConversationHeaderComponent;
