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
  KeyboardAvoidingView,
  Platform,
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
      <View
        className={`mb-4 ${item.id % 2 === 0 ? "items-end" : "items-start"}`}
      >
        <View
          className={`max-w-[80%] items-start rounded-md bg-gray-500/40 p-2 ${item.id % 2 === 0 ? "items-end bg-blue-500/40" : "items-start bg-gray-500/40"}`}
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
      >
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
              initialNumToRender={20} // Number of items to render initially
              maxToRenderPerBatch={20} // Number of items to render in each batch
              windowSize={10} // Number of items to keep in memory outside of the visible area
            />
          </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
