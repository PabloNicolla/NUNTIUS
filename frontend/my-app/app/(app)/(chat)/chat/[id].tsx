import TopNavBarChat from "@/components/custom-nav-bar/top-nav-bar-chat";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/Colors";
import {
  Condition,
  Contact,
  Message,
  MessageStatus,
  MessageType,
  PrivateChat,
  ReceiverType,
} from "@/db/schemaTypes";
import {
  getAllMessagesByChatIdWithPagination,
  getFirstMessage,
  getFirstPrivateChat,
  insertMessage,
  resetPrivateChatNotificationCount,
  updatePrivateChatById,
} from "@/db/statements";
import { useSession } from "@/providers/session-provider";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import {
  addDatabaseChangeListener,
  DatabaseChangeEvent,
  useSQLiteContext,
} from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { TouchableRipple } from "react-native-paper";
import { useWebSocket } from "@/providers/websocket-provider";
import React from "react";

export default function ChatScreen() {
  const [chat, setChat] = useState<PrivateChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const PAGE_LIMIT = 20;

  const { id: chatId, contactId } = useLocalSearchParams();
  const theme = useColorScheme();
  const db = useSQLiteContext();
  const { user } = useSession();

  if (!contactId) {
    console.log("[CHAT_SCREEN]: ERROR: missing contactId");
  }

  useEffect(() => {
    async function loadMessages() {
      if (loadingMore) return;

      setLoadingMore(true);
      const newMessages = await getAllMessagesByChatIdWithPagination(
        db,
        Number(chatId),
        ReceiverType.PRIVATE_CHAT,
        PAGE_LIMIT,
        page * PAGE_LIMIT,
        true,
      );
      if (newMessages) {
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
        setPage((prevPage) => prevPage + 1);
      }
      setLoadingMore(false);
    }

    loadMessages();
  }, [page, chatId]);

  useEffect(() => {
    console.log("[CHAT_SCREEN]: GET CHAT BY ID: %d", Number(chatId));
    async function getChat() {
      const chat = await getFirstPrivateChat(db, Number(chatId));
      if (!chat) {
        console.log("[CHAT_SCREEN]: TopNavBarChat ERROR: invalid chatId");
      }
      setChat(chat ?? null);
    }
    getChat();
    resetPrivateChatNotificationCount(db, Number(chatId));
  }, []);

  useEffect(() => {
    const listener = addDatabaseChangeListener(async (event) => {
      if (event.tableName === "message") {
        const new_message = await getFirstMessage(db, event.rowId);
        if (new_message?.chatId === Number(chatId) && new_message) {
          setMessages((prevMessages) => [new_message, ...prevMessages]);
        }
      }
    });

    return () => listener.remove();
  }, [db, chatId]);

  // useEffect(() => {
  //   console.log(
  //     "[CHAT_SCREEN]: INITIAL DB LOAD: get all messages for chat_id: %d",
  //     Number(chatId),
  //   );
  //   async function getMessages() {
  //     const messages = await getAllMessagesByChatId(
  //       db,
  //       Number(chatId),
  //       ReceiverType.PRIVATE_CHAT,
  //       undefined,
  //       undefined,
  //       true,
  //     );
  //     if (!messages) {
  //       console.log("[CHAT_SCREEN]: getAllMessagesByChatId queried undefined");
  //     }
  //     setMessages(messages ?? []);
  //   }
  //   getMessages();
  // }, []);

  // useEffect(() => {
  //   console.log("[CHAT_SCREEN]: db add Listener");

  //   const listener = addDatabaseChangeListener((event) => {
  //     console.log("[CHAT_SCREEN]: db run Listener", event);
  //     if (event.tableName === "message") {
  //       async function getMessages() {
  //         const updatedMessages = await getAllMessagesByChatId(
  //           db,
  //           Number(chatId),
  //           ReceiverType.PRIVATE_CHAT,
  //           undefined,
  //           undefined,
  //           true,
  //         );
  //         if (!updatedMessages) {
  //           console.log(
  //             "[CHAT_SCREEN]: addDatabaseChangeListener queried undefined",
  //           );
  //         }
  //         setMessages(updatedMessages ?? messages);
  //       }
  //       getMessages();
  //     }
  //   });

  //   return () => listener.remove();
  // }, [db, chatId]);

  const renderItem = ({ item, index }: { item: Message; index: number }) => {
    return <MessageItem item={item} user={user} />;
  };

  return (
    <ThemedView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        className=""
        keyboardVerticalOffset={0}
      >
        <SafeAreaView className="flex-1">
          <TopNavBarChat contactId={Number(contactId)} />
          <View className="flex-1">
            <FlatList
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              indicatorStyle={theme === "dark" ? "white" : "black"}
              showsHorizontalScrollIndicator={true}
              inverted={true}
              initialNumToRender={PAGE_LIMIT}
              maxToRenderPerBatch={PAGE_LIMIT}
              windowSize={10}
              nestedScrollEnabled={true}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (!loadingMore) {
                  setPage((prevPage) => prevPage + 1);
                }
              }}
            />
          </View>
          <HeaderComponent chat={chat} handleSendMessage={() => {}} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const MessageItem = React.memo(function MessageItem({
  item,
  user,
}: {
  item: Message;
  user: Contact;
}) {
  console.log("-------------------------------------", item.id);

  return (
    <View
      className={`mb-4 ${item.senderId === user.id ? "items-end" : "items-start"}`}
    >
      <View
        className={`max-w-[80%] items-start rounded-md bg-gray-500/40 p-2 ${
          item.senderId === user.id
            ? "items-end bg-blue-500/40"
            : "items-start bg-gray-500/40"
        }`}
      >
        <ThemedText>{item.value}</ThemedText>
      </View>
    </View>
  );
});

const HeaderComponent = ({
  handleSendMessage,
  chat,
}: {
  handleSendMessage: (query: string) => void;
  chat: PrivateChat | null;
}) => {
  const theme = useColorScheme();
  const [messageValue, setMessageValue] = useState("");
  const { sendMessage } = useWebSocket();
  const db = useSQLiteContext();

  return (
    <View className="flex-row">
      <View className="mx-2 mb-2 justify-end overflow-hidden rounded-full">
        <TouchableRipple
          className="bg-primary-light/50 p-3 dark:bg-primary-light"
          onPress={async () => {
            console.log("pressed");
            if (chat) {
              const message: Message = {
                id: 1,
                chatId: chat.id,
                condition: Condition.NORMAL,
                receiverId: chat.contactId,
                senderId: 999,
                receiverType: ReceiverType.PRIVATE_CHAT,
                senderReferenceId: 1,
                status: MessageStatus.PENDING,
                timestamp: Date.now(),
                type: MessageType.TEXT,
                value: messageValue,
              };
              sendMessage({ message, type: "PRIVATE_CHAT" });

              const ret = await insertMessage(db, message);
              console.log("||||=-=-====-=-", ret);
              const ret2 = await updatePrivateChatById(db, {
                contactId: message.receiverId,
                id: message.chatId,
                lastMessageId: ret.lastInsertRowId,
                lastMessageTimestamp: message.timestamp,
                lastMessageValue: message.value,
              });

              setMessageValue("");
            } else {
              console.log("[CHAT_SCREEN]: ERROR: chat is null");
            }
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
              const message: Message = {
                id: 1,
                chatId: 1,
                condition: Condition.NORMAL,
                receiverId: 999,
                senderId: 1,
                receiverType: ReceiverType.PRIVATE_CHAT,
                senderReferenceId: 1,
                status: MessageStatus.PENDING,
                timestamp: Date.now(),
                type: MessageType.TEXT,
                value: messageValue,
              };
              sendMessage({ message, type: "PRIVATE_CHAT" });
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
