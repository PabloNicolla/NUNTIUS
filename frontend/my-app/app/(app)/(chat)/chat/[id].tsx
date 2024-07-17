import TopNavBarChat from "@/components/custom-nav-bar/top-nav-bar-chat";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Message, PrivateChat } from "@/db/schemaTypes";
import { getFirstPrivateChat } from "@/db/statements";
import { messages } from "@/test-data/message-data";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [chat, setChat] = useState<PrivateChat | null>(null);
  const theme = useColorScheme();

  const db = useSQLiteContext();

  useEffect(() => {
    console.log("ChatScreen", Number(id));
    async function getChatAndContact() {
      const chat = await getFirstPrivateChat(db, Number(id));
      if (!chat) {
        console.log("TopNavBarChat ERROR invalid chatId");
      }
      setChat(chat);
    }
    getChatAndContact();
  }, []);

  const renderItem = ({ item, index }: { item: Message; index: number }) => {
    return (
      <View className={`w-full ${item.id % 2 === 0 ? "items-end" : ""}`}>
        <ThemedText>{item.value}</ThemedText>
      </View>
    );
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <TopNavBarChat contactId={chat?.contactId} />
        <View className="relative flex-1">
          <FlatList
            data={messages}
            renderItem={renderItem}
            // ListFooterComponent={ListFooterComponent}
            ListHeaderComponent={
              <HeaderComponent handleSendMessage={() => {}} />
            }
            indicatorStyle={theme === "dark" ? "white" : "black"}
            showsHorizontalScrollIndicator={true}
            inverted={true}
          />
        </View>
      </SafeAreaView>
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
    <View className="w-full items-center justify-center">
      <View className="my-2 h-12 w-[95%] rounded-3xl bg-black/5 px-4 dark:bg-white/10">
        <Pressable className="flex-1 flex-row items-center" onPress={() => {}}>
          <Ionicons
            size={20}
            name="send"
            color={theme === "dark" ? "white" : "black"}
          />
          <TextInput
            className="ml-2 flex-1 text-text-light dark:text-text-dark"
            placeholder="Message..."
            placeholderTextColor={
              theme === "dark" ? "rgba(225,232,249,0.7)" : "rgba(6,13,30,0.7)"
            }
            numberOfLines={1}
            value={messageValue}
            onChangeText={(text) => {
              setMessageValue(text);
            }}
          />
        </Pressable>
      </View>
    </View>
  );
};
