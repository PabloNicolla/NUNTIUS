import React from "react";
import { View, useColorScheme } from "react-native";

import { useChatSelection } from "@/hooks/providers/chat-selection-provider";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed-view";
import { TouchableRipple } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import {
  deleteAllMessagesByChatId,
  deletePrivateChat,
} from "@/lib/db/statements";
import { useChatSelected } from "@/hooks/providers/chat-selection-provider copy";
import { useSession } from "@/hooks/providers/session-provider";

type ActionsHeaderOnSelectProps = {
  headerHeight: number;
};

const ActionsHeaderOnSelect = ({
  headerHeight,
}: ActionsHeaderOnSelectProps) => {
  const theme = useColorScheme() ?? "dark";
  const { isSelectionActive } = useChatSelection();
  const { clearSelected, selectedChats } = useChatSelected();
  const db = useSQLiteContext();
  const { getDbPrefix } = useSession();

  const dbPrefix = getDbPrefix();

  if (!dbPrefix) {
    throw new Error("[GROUPS] ERROR: invalid dbPrefix");
  }

  return (
    <View
      className={`absolute left-0 right-0 top-0 ${isSelectionActive ? "" : "hidden"}`}
    >
      <ThemedView
        className={`h-[${headerHeight}] flex-row items-center justify-between px-2`}
      >
        <ThemedText className="flex-grow">NUNTIUS</ThemedText>
        <View className="flex-row space-x-2">
          <View className="overflow-hidden rounded-full">
            <TouchableRipple
              onPress={async () => {
                selectedChats.forEach(async (chatId) => {
                  await deletePrivateChat(db, dbPrefix, chatId);
                  await deleteAllMessagesByChatId(db, dbPrefix, chatId);
                });
                clearSelected();
              }}
              rippleColor={
                theme === "dark"
                  ? "rgba(255, 255, 255, .32)"
                  : "rgba(0, 0, 0, .15)"
              }
            >
              <Ionicons
                name="trash-outline"
                color={theme === "dark" ? "white" : "black"}
                size={25}
              />
            </TouchableRipple>
          </View>
          <View className="overflow-hidden rounded-full">
            <TouchableRipple
              onPress={async () => {
                console.log("config");
              }}
              rippleColor={
                theme === "dark"
                  ? "rgba(255, 255, 255, .32)"
                  : "rgba(0, 0, 0, .15)"
              }
            >
              <Ionicons
                name="ellipsis-horizontal"
                color={theme === "dark" ? "white" : "black"}
                size={25}
              />
            </TouchableRipple>
          </View>
        </View>
      </ThemedView>
    </View>
  );
};

export default ActionsHeaderOnSelect;
