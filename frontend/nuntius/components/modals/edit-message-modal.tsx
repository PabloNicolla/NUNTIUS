import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  useColorScheme,
  TextInput,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavBar from "../custom-nav-bar/top-nav-bar";
import { Colors } from "@/constants/Colors";
import { TouchableRipple } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import {
  Condition,
  Message,
  MessageStatus,
  MessageType,
} from "@/lib/db/schemaTypes";
import { useSQLiteContext } from "expo-sqlite";
import { useWebSocket } from "@/hooks/providers/websocket-provider";
import { useSession } from "@/hooks/providers/session-provider";
import { useMessageSelected } from "@/hooks/providers/message-selected-provider";
import {
  getFirstMessage,
  updateMessage,
  updatePrivateChatById,
} from "@/lib/db/statements";
import MessageItem from "../chat/message-list-item";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

const EditMessageModal = ({
  isVisible,
  onClose,
}: Readonly<{
  isVisible: boolean;
  onClose: () => void;
}>) => {
  const theme = useColorScheme() ?? "dark";
  const db = useSQLiteContext();
  const { getDbPrefix, user } = useSession();
  const { selectedMessages, clearSelected } = useMessageSelected();
  const [message, setMessage] = useState<Message | null>(null);

  const dbPrefix = getDbPrefix();

  const expandedOnClose = () => {
    onClose();
    clearSelected();
  };

  if (!dbPrefix) {
    throw new Error("[EDIT_MESSAGE_MODAL]: Error: invalid db prefix");
  }

  if (!user) {
    throw new Error("[EDIT_MESSAGE_MODAL]: ERROR: user most be logged in");
  }

  useEffect(() => {
    const getMessage = async () => {
      if (selectedMessages.size === 1) {
        const msgId = selectedMessages.values().next().value;
        const message = await getFirstMessage(db, dbPrefix, Number(msgId));

        if (!message) {
          console.log("[EDIT_MESSAGE_MODAL]: Error selected message not found");
          return;
        }
        setMessage(message);
      }
    };

    getMessage();
  }, [db, selectedMessages, dbPrefix]);

  if (selectedMessages.size !== 1) {
    return null;
  }

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={expandedOnClose}
    >
      <TopNavBar
        title="Edit message"
        customBack={() => {
          expandedOnClose();
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        className=""
        keyboardVerticalOffset={0}
      >
        <SafeAreaView
          style={{ backgroundColor: Colors[theme].text + "40" }}
          className="flex-1 justify-end"
        >
          {message && (
            <View
              style={{ backgroundColor: Colors[theme].background }}
              className="w-full pt-4"
            >
              <View>
                <MessageItem
                  item={message}
                  user={user}
                  previousMessageSender={null}
                />
              </View>
              <FooterComponent
                message={message}
                closeModal={() => {
                  expandedOnClose();
                }}
              />
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditMessageModal;

const FooterComponent = ({
  message,
  closeModal,
}: {
  message: Message;
  closeModal: () => void;
}) => {
  const { user, getDbPrefix } = useSession();
  const theme = useColorScheme() ?? "dark";
  const [messageValue, setMessageValue] = useState(message.value);
  const { sendMessage } = useWebSocket();
  const db = useSQLiteContext();

  const dbPrefix = getDbPrefix();

  if (!dbPrefix) {
    throw new Error("[CHAT_SCREEN]: ERROR: invalid dbPrefix");
  }

  const handleSendMessage = async (messageValue: string) => {
    if (user) {
      const editedMsg: Message = {
        id: message.id,
        chatId: message.chatId,
        condition: Condition.EDITED,
        receiverId: message.receiverId,
        senderId: user.id,
        receiverType: message.receiverType,
        senderReferenceId: message.senderReferenceId,
        status: MessageStatus.PENDING,
        timestamp: Date.now(),
        type: MessageType.TEXT,
        value: messageValue,
      };
      const ret = await updateMessage(db, dbPrefix, editedMsg);

      if (!ret) {
        throw new Error(
          "[CHAT_SCREEN]: ERROR: failed to insert new message in DB",
        );
      }

      if (editedMsg.senderId === editedMsg.chatId) {
        editedMsg.status = MessageStatus.SENT;
      } else {
        sendMessage({
          data: editedMsg,
          type: "private_chat",
          receiver_id: editedMsg.receiverId,
          sender_id: editedMsg.senderId,
        });
      }

      if (ret.lastInsertRowId === editedMsg.id) {
        await updatePrivateChatById(db, dbPrefix, {
          contactId: editedMsg.receiverId,
          id: editedMsg.chatId,
          lastMessageId: ret.lastInsertRowId,
          lastMessageTimestamp: editedMsg.timestamp,
          lastMessageValue: editedMsg.value,
        });
      }
    } else {
      console.log("[CHAT_SCREEN]: ERROR: chat or user is not defined");
    }
    closeModal();
  };

  return (
    <View className="mt-2 flex-row">
      <View className="mx-2 mb-2 justify-end overflow-hidden rounded-full">
        <TouchableRipple
          className="rounded-full bg-primary-light/50 p-3 dark:bg-primary-light"
          onPress={() => {
            console.log("pressed");
            handleSendMessage(messageValue);
            setMessageValue("");
          }}
          rippleColor={
            theme === "dark" ? "rgba(255, 255, 255, .32)" : "rgba(0, 0, 0, .15)"
          }
        >
          <Ionicons
            size={18}
            name={"send"}
            color={theme === "dark" ? "white" : "black"}
          />
        </TouchableRipple>
      </View>
      <View className="mb-2 mr-2 flex-1 flex-row rounded-lg bg-background-dark/10 dark:bg-background-light/20">
        <View className="max-h-40 flex-1 justify-center">
          <View className="justify-center px-2">
            <TextInput
              className="text-lg text-black dark:text-white"
              value={messageValue}
              onChangeText={(text) => {
                setMessageValue(text);
              }}
              multiline={true}
              scrollEnabled={true}
            ></TextInput>
          </View>
        </View>
        <View className="w-10 items-center justify-end overflow-hidden rounded-full">
          <TouchableRipple
            className="p-2"
            onPress={() => {
              console.log("pressed");
            }}
            rippleColor={
              theme === "dark"
                ? "rgba(255, 255, 255, .32)"
                : "rgba(0, 0, 0, .15)"
            }
          >
            <Ionicons
              size={25}
              name="happy-outline"
              color={theme === "dark" ? "white" : "black"}
            />
          </TouchableRipple>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
