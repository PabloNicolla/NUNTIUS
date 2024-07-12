// groups.tsx

import React, { useState } from "react";
import { View, Pressable, useColorScheme, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatListItem, {
  ChatListItemProps,
} from "@/components/chat/ChatListItem";
import { SelectionProvider, useSelection } from "@/providers/chat-provider";
import { ThemedText } from "@/components/ThemedText";
import { StatusBar } from "expo-status-bar";
import { chats_data } from "@/test-data/chat-data";
import ListWithDynamicHeader from "@/components/list/ListWithHeader";
import {
  AvatarModalProvider,
  useAvatarModal,
} from "@/providers/avatarModal-provider";
import AvatarModal from "@/components/modals/AvatarModal";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { TouchableRipple } from "react-native-paper";

const headerHeight = 50;

const App = () => {
  const theme = useColorScheme();
  const [chats, setChats] = useState<ChatListItemProps[]>(chats_data);

  const [chatsToRender, setChatsToRender] =
    useState<ChatListItemProps[]>(chats_data);

  const filterItems = (query: string) => {
    const filtered = chats.filter((chat) => {
      return chat.chatName.toLowerCase().includes(query.toLowerCase());
    });
    setChatsToRender(filtered);
    console.log(query);
  };

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
    <ChatListItem key={item.id} {...item} />
  );

  const { hideModal, imageURL, isVisible } = useAvatarModal();

  return (
    <View className="flex-1">
      <StatusBar style="auto" />

      <SafeAreaView className="flex-1">
        <ListWithDynamicHeader
          data={chatsToRender}
          renderItem={renderItem}
          ListHeaderComponent={HeaderComponent({ handleSearch: filterItems })}
          DynamicHeaderComponent={Header}
          headerHeight={headerHeight}
        />

        <AvatarModal
          isVisible={isVisible}
          onClose={() => {
            hideModal();
          }}
          imageURL={imageURL}
        />
      </SafeAreaView>
    </View>
  );
};

const Header = () => {
  const theme = useColorScheme();

  return (
    <ThemedView
      className={`h-[${headerHeight}] flex-row items-center justify-between px-2`}
    >
      <ThemedText>Conversations</ThemedText>
      <View className="overflow-hidden rounded-full">
        <TouchableRipple
          onPress={() => {
            console.log("config");
          }}
          rippleColor={
            theme === "dark" ? "rgba(255, 255, 255, .32)" : "rgba(0, 0, 0, .15)"
          }
          className=""
        >
          <Ionicons
            name="ellipsis-horizontal"
            color={theme === "dark" ? "white" : "black"}
            size={25}
          />
        </TouchableRipple>
      </View>
    </ThemedView>
  );
};

const HeaderComponent = ({
  handleSearch,
}: {
  handleSearch: (query: string) => void;
}) => {
  const theme = useColorScheme();
  const { selectedChatItems } = useSelection();
  const [searchQuery, setSearchQuery] = useState("");
  console.log("issue");

  return (
    <View className="w-full items-center justify-center">
      <View className="my-2 h-12 w-[95%] rounded-3xl bg-background-light/80 px-6 dark:bg-white/10">
        <Pressable
          onPress={() => {
            console.log(selectedChatItems);
          }}
          className="flex-1 justify-center"
        >
          <TextInput
            className="flex-1 text-text-light dark:text-text-dark"
            placeholder="Search..."
            placeholderTextColor={theme === "dark" ? "white" : "black"}
            numberOfLines={1}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              handleSearch(text);
            }}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default () => (
  <AvatarModalProvider>
    <SelectionProvider>
      <App />
    </SelectionProvider>
  </AvatarModalProvider>
);
