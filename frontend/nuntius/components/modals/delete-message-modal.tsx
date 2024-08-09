import React from "react";
import { Modal, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavBar from "../custom-nav-bar/top-nav-bar";
import { Colors } from "@/constants/Colors";
import { useSQLiteContext } from "expo-sqlite";
import { useWebSocket } from "@/hooks/providers/websocket-provider";
import { useSession } from "@/hooks/providers/session-provider";
import { useMessageSelected } from "@/hooks/providers/message-selected-provider";
import {
  deleteMessagesByIds,
  getMessagesByIds,
  getNewestMessageByChatId,
  updatePrivateChatById,
} from "@/lib/db/statements";
import { ThemedText } from "../themed-text";
import { TouchableRipple } from "react-native-paper";
import {
  Condition,
  Message,
  PrivateChat,
  ReceiverType,
} from "@/lib/db/schemaTypes";

const DeleteMessageModal = ({
  isVisible,
  onClose,
  confirmDeletion,
  chat,
}: Readonly<{
  isVisible: boolean;
  onClose: () => void;
  confirmDeletion: () => void;
  chat: PrivateChat | null;
}>) => {
  const theme = useColorScheme() ?? "dark";
  const db = useSQLiteContext();
  const { getDbPrefix, user } = useSession();
  const { selectedMessages, clearSelected } = useMessageSelected();
  const { sendMessage } = useWebSocket();

  const dbPrefix = getDbPrefix();

  if (!dbPrefix) {
    throw new Error("[DELETE_MESSAGE_MODAL]: Error: invalid db prefix");
  }

  if (!user) {
    throw new Error("[DELETE_MESSAGE_MODAL]: ERROR: user most be logged in");
  }

  const updateChatDetails = async () => {
    if (!chat) {
      console.log("[DELETE_MESSAGE_MODAL]: ERROR: no chat object was received");
      return;
    }
    const newestMessage = await getNewestMessageByChatId(
      db,
      dbPrefix,
      chat.id,
      ReceiverType.PRIVATE_CHAT,
    );
    if (!newestMessage) {
      console.log("[DELETE_MESSAGE_MODAL]: chat is empty");
    }
    await updatePrivateChatById(db, dbPrefix, {
      contactId: chat.contactId,
      id: chat.id,
      lastMessageId: newestMessage?.id,
      lastMessageTimestamp: newestMessage?.timestamp,
      lastMessageValue: newestMessage?.value,
    });
  };

  const deleteForMe = async () => {
    const messageIds = Array.from(selectedMessages);
    await deleteMessagesByIds(db, dbPrefix, messageIds);
    confirmDeletion();
    clearSelected();
    await updateChatDetails();
    onClose();
  };
  const deleteForEveryone = async () => {
    const messageIds = Array.from(selectedMessages);
    const messages = await getMessagesByIds(db, dbPrefix, messageIds);

    if (!messages) {
      throw new Error(
        "[DELETE_MESSAGE_MODAL]: failed to delete messages for everyone",
      );
    }

    await deleteMessagesByIds(db, dbPrefix, messageIds);

    const messagesToDelete = messages.reduce<Message[]>((acc, msg) => {
      if (msg.senderId === user.id) {
        acc.push({
          ...msg,
          condition: Condition.DELETED,
          value: "",
        });
      }
      return acc;
    }, []);

    if (messagesToDelete.length > 0) {
      sendMessage({
        data: messagesToDelete,
        type: "private_chat_batch",
        receiver_id: messages[0].receiverId,
        sender_id: user.id,
      });
    }

    confirmDeletion();
    clearSelected();
    await updateChatDetails();
    onClose();
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TopNavBar
        title="Edit message"
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
            <ThemedText>Delete Messages?</ThemedText>
          </View>

          <View className="items-end">
            <View className="overflow-hidden rounded-3xl">
              <TouchableRipple
                className="p-3"
                onPress={async () => {
                  await deleteForEveryone();
                }}
                rippleColor={
                  theme === "dark"
                    ? "rgba(255, 255, 255, .32)"
                    : "rgba(0, 0, 0, .15)"
                }
              >
                <ThemedText className="font-bold text-primary-light">
                  Delete for everyone
                </ThemedText>
              </TouchableRipple>
            </View>

            <View className="overflow-hidden rounded-3xl">
              <TouchableRipple
                className="p-3"
                onPress={async () => {
                  await deleteForMe();
                }}
                rippleColor={
                  theme === "dark"
                    ? "rgba(255, 255, 255, .32)"
                    : "rgba(0, 0, 0, .15)"
                }
              >
                <ThemedText className="font-bold text-primary-light">
                  Delete for me
                </ThemedText>
              </TouchableRipple>
            </View>

            <View className="overflow-hidden rounded-3xl">
              <TouchableRipple
                className="p-3"
                onPress={() => {
                  onClose();
                }}
                rippleColor={
                  theme === "dark"
                    ? "rgba(255, 255, 255, .32)"
                    : "rgba(0, 0, 0, .15)"
                }
              >
                <ThemedText className="font-bold text-primary-light">
                  Cancel
                </ThemedText>
              </TouchableRipple>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default DeleteMessageModal;
