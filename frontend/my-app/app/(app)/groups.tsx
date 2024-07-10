// groups.tsx

import React, { useState } from "react";
import { View, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatListItem, {
  ChatListItemProps,
} from "@/components/chat/ChatListItem";
import { SelectionProvider, useSelection } from "@/providers/chat-provider";
import { ThemedText } from "@/components/ThemedText";

const App = () => {
  const { selectModeHandler, selectedChatItems } = useSelection();

  const [chats, setChats] = useState<ChatListItemProps[]>([
    {
      id: 1,
      username: "user1",
      chatName: "user1",
      lastMessageTime: Date.now(),
      recentMessage: "hello",
      imageURL: "https://cataas.com/cat",
      isInSelectMode: false,
      selectModeHandler: selectModeHandler,
    },
    {
      id: 2,
      username: "user2",
      chatName: "user2",
      lastMessageTime: Date.now() - 1000,
      recentMessage: "bye",
      imageURL: "https://cataas.com/cat",
      isInSelectMode: false,
      selectModeHandler: selectModeHandler,
    },
    {
      id: 3,
      username: "user3",
      chatName: "user3",
      lastMessageTime: Date.now() - 2000,
      recentMessage: "Good",
      imageURL: "https://cataas.com/cat",
      isInSelectMode: false,
      selectModeHandler: selectModeHandler,
    },
    {
      id: 4,
      username: "user4",
      chatName: "user4",
      lastMessageTime: Date.now() - 3000,
      recentMessage: "what?",
      imageURL: "https://cataas.com/cat",
      isInSelectMode: false,
      selectModeHandler: selectModeHandler,
    },
  ]);

  const addOrUpdateChat = (chat: ChatListItemProps) => {
    setChats((prevChats: ChatListItemProps[]) => {
      const existingChatIndex = prevChats.findIndex((c) => c.id === chat.id);
      if (existingChatIndex !== -1) {
        const updatedChats = [...prevChats];
        updatedChats[existingChatIndex] = chat;
        return updatedChats.sort(
          (a, b) => b.lastMessageTime - a.lastMessageTime,
        );
      } else {
        const updatedChats = [...prevChats, chat];
        return updatedChats.sort(
          (a, b) => b.lastMessageTime - a.lastMessageTime,
        );
      }
    });
  };

  const renderItem = ({ item }: { item: ChatListItemProps }) => (
    <ChatListItem {...item} />
  );

  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1">
        <FlatList
          data={chats}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />

        <Pressable
          onPress={() => {
            console.log(selectedChatItems);
          }}
        >
          <ThemedText>ASDSADASDSADASDASDASDSA</ThemedText>
        </Pressable>
      </SafeAreaView>
    </View>
  );
};

export default () => (
  <SelectionProvider>
    <App />
  </SelectionProvider>
);
