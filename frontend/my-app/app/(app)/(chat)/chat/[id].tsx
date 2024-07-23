import TopNavBarChat from "@/components/custom-nav-bar/top-nav-bar-chat";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/Colors";
import {
  Condition,
  Message,
  MessageStatus,
  MessageType,
  PrivateChat,
  ReceiverType,
} from "@/db/schemaTypes";
import {
  getAllMessagesByChatId,
  getFirstPrivateChat,
  insertMessage,
  updatePrivateChatById,
} from "@/db/statements";
import { useSession } from "@/providers/session-provider";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { addDatabaseChangeListener, useSQLiteContext } from "expo-sqlite";
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

export default function ChatScreen() {
  const [chat, setChat] = useState<PrivateChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { id: chatId, contactId } = useLocalSearchParams();
  const theme = useColorScheme();
  const db = useSQLiteContext();
  const { user } = useSession();

  if (!contactId) {
    console.log("[CHAT_SCREEN]: ERROR: missing contactId");
  }

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
  }, []);

  useEffect(() => {
    console.log(
      "[CHAT_SCREEN]: INITIAL DB LOAD: get all messages for chat_id: %d",
      Number(chatId),
    );
    async function getMessages() {
      const messages = await getAllMessagesByChatId(
        db,
        Number(chatId),
        ReceiverType.PRIVATE_CHAT,
        true,
      );
      if (!messages) {
        console.log("[CHAT_SCREEN]: getAllMessagesByChatId queried undefined");
      }
      setMessages(messages ?? []);
    }
    if (!chat) {
      console.log("[CHAT_SCREEN]: TopNavBarChat ERROR invalid chatId");
    }
    getMessages();
  }, []);

  useEffect(() => {
    console.log("[CHAT_SCREEN]: db add Listener");

    const listener = addDatabaseChangeListener((event) => {
      console.log("[CHAT_SCREEN]: db run Listener", event);
      if (event.tableName === "message") {
        async function getMessages() {
          const updatedMessages = await getAllMessagesByChatId(
            db,
            Number(chatId),
            ReceiverType.PRIVATE_CHAT,
            true,
          );
          if (!updatedMessages) {
            console.log(
              "[CHAT_SCREEN]: addDatabaseChangeListener queried undefined",
            );
          }
          setMessages(updatedMessages ?? messages);
        }
        getMessages();
      }
    });

    return () => listener.remove();
  }, [db, chatId]);

  const renderItem = ({ item, index }: { item: Message; index: number }) => {
    return (
      <View
        className={`mb-4 ${item.senderId === user.id ? "items-end" : "items-start"}`}
      >
        <View
          className={`max-w-[80%] items-start rounded-md bg-gray-500/40 p-2 ${item.senderId === user.id ? "items-end bg-blue-500/40" : "items-start bg-gray-500/40"}`}
        >
          <ThemedText>{item.value}</ThemedText>
        </View>
      </View>
    );
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
              indicatorStyle={theme === "dark" ? "white" : "black"}
              showsHorizontalScrollIndicator={true}
              inverted={true}
              initialNumToRender={20} // Number of items to render initially
              maxToRenderPerBatch={20} // Number of items to render in each batch
              windowSize={10} // Number of items to keep in memory outside of the visible area
              nestedScrollEnabled={true}
            />
          </View>
          <HeaderComponent
            chatId={Number(chatId)}
            contactId={Number(contactId)}
            handleSendMessage={() => {}}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const HeaderComponent = ({
  handleSendMessage,
  contactId,
  chatId,
}: {
  handleSendMessage: (query: string) => void;
  contactId: number;
  chatId: number;
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
            const message: Message = {
              id: 1,
              chatId: chatId,
              condition: Condition.NORMAL,
              receiverId: contactId,
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
