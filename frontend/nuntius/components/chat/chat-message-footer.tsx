import { ThemedView } from "@/components/themed-view";
import {
  Condition,
  Contact,
  Message,
  MessageStatus,
  MessageType,
  PrivateChat,
  ReceiverType,
} from "@/lib/db/schemaTypes";
import {
  getFirstPrivateChat,
  insertMessage,
  insertPrivateChat,
  updatePrivateChatById,
} from "@/lib/db/statements";
import { useSession } from "@/hooks/providers/session-provider";
import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { TextInput, useColorScheme, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { useWebSocket } from "@/hooks/providers/websocket-provider";
import React from "react";
import { Colors } from "@/constants/Colors";
import {
  ConnectionStatus,
  useWebSocketController,
} from "@/hooks/providers/ws-controller-provider";

const ChatMessageFooter = ({
  chat,
  canCreateChatIfNull,
  contactId,
  setChat,
}: {
  chat: PrivateChat | null;
  canCreateChatIfNull: string;
  contactId: Contact["id"];
  setChat: (chat: PrivateChat | null) => void;
}) => {
  const { connectionStatus } = useWebSocketController();
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
    if (canCreateChatIfNull === "yes" && !chat) {
      await insertPrivateChat(db, dbPrefix, { id: contactId, contactId });
      chat = (await getFirstPrivateChat(db, dbPrefix, contactId)) ?? null;
      setChat(chat);
    }

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

      if (message.senderId === message.chatId) {
        message.status = MessageStatus.SENT;
      }

      const ret = await insertMessage(db, dbPrefix, message);

      if (!ret) {
        throw new Error(
          "[CHAT_SCREEN]: ERROR: failed to insert new message in DB",
        );
      }

      message.id = ret.lastInsertRowId;

      if (message.senderId !== message.chatId) {
        if (connectionStatus === ConnectionStatus.CONNECTED) {
          sendMessage({
            data: message,
            type: "private_chat",
            receiver_id: message.receiverId,
            sender_id: message.senderId,
          });
        } else {
          console.log("[CHAT_SCREEN]: Message stored in db for later delivery");
        }
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
    <ThemedView className="mt-2 flex-row">
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
              placeholder="Message"
              placeholderTextColor={Colors[theme].text + "90"}
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
    </ThemedView>
  );
};

export default ChatMessageFooter;
