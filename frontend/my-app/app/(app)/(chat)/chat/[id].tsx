import TopNavBarChat from "@/components/custom-nav-bar/top-nav-bar-chat";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/Colors";
import { Message, PrivateChat, ReceiverType } from "@/db/schemaTypes";
import { getAllMessagesByChatId, getFirstPrivateChat } from "@/db/statements";
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

export default function ChatScreen() {
  const [chat, setChat] = useState<PrivateChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { id } = useLocalSearchParams();
  const theme = useColorScheme();
  const db = useSQLiteContext();
  const { user } = useSession();

  useEffect(() => {
    console.log("ChatScreen get chat", Number(id));
    async function getChat() {
      const chat = await getFirstPrivateChat(db, Number(id));
      if (!chat) {
        console.log("TopNavBarChat ERROR invalid chatId");
      }

      setChat(chat);
    }
    getChat();
  }, []);

  useEffect(() => {
    console.log("ChatScreen get messages -- initial load", Number(id));
    async function getMessages() {
      const messages = await getAllMessagesByChatId(
        db,
        Number(id),
        ReceiverType.PRIVATE_CHAT,
        true,
      );
      setMessages(messages);
    }
    getMessages();
  }, []);

  useEffect(() => {
    console.log("----- db ChatScreen add Listener -----");

    const listener = addDatabaseChangeListener((event) => {
      console.log("----- db ChatScreen run Listener -----", event);
      if (event.tableName === "message") {
        async function getMessages() {
          const messages = await getAllMessagesByChatId(
            db,
            Number(id),
            ReceiverType.PRIVATE_CHAT,
          );
          setMessages(messages);
        }
        getMessages();
      }
    });

    return () => listener.remove();
  }, [db, id]);

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
          <TopNavBarChat contactId={chat?.contactId} />
          <View className="flex-1">
            <FlatList
              data={messages}
              renderItem={renderItem}
              // ListFooterComponent={ListFooterComponent}
              indicatorStyle={theme === "dark" ? "white" : "black"}
              showsHorizontalScrollIndicator={true}
              inverted={true}
              initialNumToRender={20} // Number of items to render initially
              maxToRenderPerBatch={20} // Number of items to render in each batch
              windowSize={10} // Number of items to keep in memory outside of the visible area
              nestedScrollEnabled={true}
              // ListHeaderComponent={
              //   <HeaderComponent handleSendMessage={() => {}} />
              // }
            />
          </View>
          <HeaderComponent handleSendMessage={() => {}} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const HeaderComponent = ({
  handleSendMessage,
}: {
  handleSendMessage: (query: string) => void;
}) => {
  const theme = useColorScheme();
  const [messageValue, setMessageValue] = useState("");

  return (
    <View className="flex-row">
      <View className="mx-2 mb-2 justify-end">
        <View className="rounded-full bg-primary-light/50 p-3 dark:bg-primary-light">
          <Ionicons
            size={18}
            name={`${messageValue ? "send" : "mic"}`}
            color={theme === "dark" ? "white" : "black"}
          />
        </View>
      </View>
      <View className="mb-2 flex-1 flex-row rounded-lg bg-background-dark/10 dark:bg-background-light/20">
        {!messageValue && (
          <View className="w-10 items-center justify-end">
            <View className="rounded-full p-2">
              <Ionicons
                size={25}
                name="camera-outline"
                color={theme === "dark" ? "white" : "black"}
              />
            </View>
          </View>
        )}
        <View className="w-10 items-center justify-end">
          <View className="rounded-full p-2">
            <Ionicons
              size={25}
              name="attach"
              color={theme === "dark" ? "white" : "black"}
            />
          </View>
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
        <View className="w-10 items-center justify-end">
          <View className="rounded-full p-2">
            <Ionicons
              size={25}
              name="happy-outline"
              color={theme === "dark" ? "white" : "black"}
            />
          </View>
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
