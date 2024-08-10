import React from "react";
import { Modal, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavBar from "../custom-nav-bar/top-nav-bar";
import { Colors } from "@/constants/Colors";
import { useSQLiteContext } from "expo-sqlite";
import { useSession } from "@/hooks/providers/session-provider";
import { ThemedText } from "../themed-text";
import { TouchableRipple } from "react-native-paper";
import useChatReducer from "@/hooks/reducers/useChatReducer";
import { useChatSelected } from "@/hooks/providers/chat-selected-provider";
import {
  deleteAllMessagesByChatId,
  deletePrivateChat,
} from "@/lib/db/statements";

const DeleteChatModal = ({
  isVisible,
  onClose,
}: Readonly<{
  isVisible: boolean;
  onClose: () => void;
}>) => {
  const theme = useColorScheme() ?? "dark";
  const [state, dispatch] = useChatReducer();
  const { clearSelected, selectedChats } = useChatSelected();
  const db = useSQLiteContext();
  const { getDbPrefix } = useSession();
  const dbPrefix = getDbPrefix();

  if (!dbPrefix) {
    throw new Error("[DELETE_CHAT_MODAL]: Error: invalid db prefix");
  }

  const deleteChats = async () => {
    selectedChats.forEach(async (chatId) => {
      await deletePrivateChat(db, dbPrefix, chatId);
    });
    dispatch({ payload: null, type: "CLEAR_SELECTED" });
    clearSelected();
    onClose();
  };
  const deleteChatsAndData = async () => {
    selectedChats.forEach(async (chatId) => {
      await deletePrivateChat(db, dbPrefix, chatId);
      await deleteAllMessagesByChatId(db, dbPrefix, chatId);
    });
    dispatch({ payload: null, type: "CLEAR_SELECTED" });
    clearSelected();
    onClose();
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        onClose();
      }}
    >
      <TopNavBar
        title="Delete Conversations"
        customBack={() => {
          onClose();
        }}
      />

      <SafeAreaView
        style={{ backgroundColor: Colors[theme].text + "40" }}
        className="flex-1 items-center justify-center"
      >
        <View
          style={{ backgroundColor: Colors[theme].background }}
          className="w-[70%] rounded-xl p-4"
        >
          <View className="mb-4 p-2">
            <ThemedText>Delete Chats?</ThemedText>
          </View>

          <View className="items-end">
            <View className="overflow-hidden rounded-3xl">
              <TouchableRipple
                className="p-3"
                onPress={async () => {
                  await deleteChats();
                }}
                rippleColor={
                  theme === "dark"
                    ? "rgba(255, 255, 255, .32)"
                    : "rgba(0, 0, 0, .15)"
                }
              >
                <ThemedText className="font-bold text-primary-light">
                  Delete only chats
                </ThemedText>
              </TouchableRipple>
            </View>

            <View className="overflow-hidden rounded-3xl">
              <TouchableRipple
                className="p-3"
                onPress={async () => {
                  await deleteChatsAndData();
                }}
                rippleColor={
                  theme === "dark"
                    ? "rgba(255, 255, 255, .32)"
                    : "rgba(0, 0, 0, .15)"
                }
              >
                <ThemedText className="font-bold text-primary-light">
                  Delete chats and Data
                </ThemedText>
              </TouchableRipple>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default DeleteChatModal;
