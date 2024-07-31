import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  View,
  Image,
  useColorScheme,
  TextInput,
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
  ReceiverType,
} from "@/db/schemaTypes";
import { useSQLiteContext } from "expo-sqlite";
import { useWebSocket } from "@/providers/websocket-provider";
import { useSession } from "@/providers/session-provider";
import { useMessageSelected } from "@/providers/message-selected-provider";
import { number } from "zod";
import { getFirstMessage } from "@/db/statements";

const EditMessageModal = ({
  isVisible,
  onClose,
}: Readonly<{
  isVisible: boolean;
  onClose: () => void;
}>) => {
  const theme = useColorScheme() ?? "dark";
  const db = useSQLiteContext();
  const { getDbPrefix } = useSession();
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

  if (selectedMessages.size !== 1) {
    throw new Error("[EDIT_MESSAGE_MODAL]: Error: max of 1 selected messages");
  }

  useEffect(() => {
    const getMessage = async () => {
      const msgId = selectedMessages.values().next();

      if (typeof msgId !== "number") {
        console.log(
          "[EDIT_MESSAGE_MODAL]: Error selected message is not a number",
        );
        return;
      }

      const message = await getFirstMessage(db, dbPrefix, msgId);

      if (!message) {
        console.log("[EDIT_MESSAGE_MODAL]: Error selected message not found");
        return;
      }

      setMessage(message);
    };

    getMessage();
  }, []);

  console.log("+++++++++++");

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
      <SafeAreaView className="flex-1 items-center justify-center">
        {message && (
          <View
            style={{ backgroundColor: Colors[theme].text + "30" }}
            className="w-full flex-1"
          ></View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default EditMessageModal;

const FooterComponent = ({}: {}) => {
  const { user, getDbPrefix } = useSession();
  const theme = useColorScheme() ?? "dark";
  const [messageValue, setMessageValue] = useState("");
  const { sendMessage } = useWebSocket();
  const db = useSQLiteContext();

  const dbPrefix = getDbPrefix();

  if (!dbPrefix) {
    throw new Error("[CHAT_SCREEN]: ERROR: invalid dbPrefix");
  }

  const handleSendMessage = async (messageValue: string) => {
    if (chat && user) {
      const message: Message = {
        id: -1,
        chatId: chat.id,
        condition: Condition.NORMAL,
        receiverId: chat.contactId,
        senderId: user.id,
        receiverType: ReceiverType.PRIVATE_CHAT,
        senderReferenceId: Date.now(),
        status: MessageStatus.PENDING,
        timestamp: Date.now(),
        type: MessageType.TEXT,
        value: messageValue,
      };
      const ret = await insertMessage(db, dbPrefix, message);

      if (!ret) {
        throw new Error(
          "[CHAT_SCREEN]: ERROR: failed to insert new message in DB",
        );
      }

      message.id = ret.lastInsertRowId;
      // message.senderReferenceId = ret.lastInsertRowId;

      if (message.senderId === message.chatId) {
        message.status = MessageStatus.SENT;
      } else {
        sendMessage({ message, type: "PRIVATE_CHAT" });
      }

      await updatePrivateChatById(db, dbPrefix, {
        contactId: message.receiverId,
        id: message.chatId,
        lastMessageId: ret.lastInsertRowId,
        lastMessageTimestamp: message.timestamp,
        lastMessageValue: message.value,
      });
    } else {
      console.log("[CHAT_SCREEN]: ERROR: chat or user is not defined");
    }
  };

  return (
    <View className="flex-row">
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
            name={`${messageValue ? "send" : "mic"}`}
            color={theme === "dark" ? "white" : "black"}
          />
        </TouchableRipple>
      </View>
      <View className="mb-2 mr-2 flex-1 flex-row rounded-lg bg-background-dark/10 dark:bg-background-light/20">
        {!messageValue && (
          <View className="w-10 items-center justify-end overflow-hidden rounded-full">
            <TouchableRipple
              className="p-2"
              onPress={() => {}}
              rippleColor={
                theme === "dark"
                  ? "rgba(255, 255, 255, .32)"
                  : "rgba(0, 0, 0, .15)"
              }
            >
              <Ionicons
                size={25}
                name="camera-outline"
                color={theme === "dark" ? "white" : "black"}
              />
            </TouchableRipple>
          </View>
        )}
        <View className="w-10 items-center justify-end overflow-hidden rounded-full">
          <TouchableRipple
            className="p-2"
            onPress={() => {}}
            rippleColor={
              theme === "dark"
                ? "rgba(255, 255, 255, .32)"
                : "rgba(0, 0, 0, .15)"
            }
          >
            <Ionicons
              size={25}
              name="attach"
              color={theme === "dark" ? "white" : "black"}
            />
          </TouchableRipple>
        </View>
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
