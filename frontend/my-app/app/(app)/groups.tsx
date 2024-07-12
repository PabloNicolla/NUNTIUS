import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Pressable,
  TextInput,
  StyleSheet,
  FlatList,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatListItem, {
  ChatListItemProps,
} from "@/components/chat/ChatListItem";
import { SelectionProvider, useSelection } from "@/providers/chat-provider";
import { ThemedText } from "@/components/ThemedText";
import { StatusBar } from "expo-status-bar";
import ListWithDynamicHeader from "@/components/list/ListWithHeader";
import {
  AvatarModalProvider,
  useAvatarModal,
} from "@/providers/avatarModal-provider";
import AvatarModal from "@/components/modals/AvatarModal";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { FAB, TouchableRipple } from "react-native-paper";
import { router } from "expo-router";
import { addDatabaseChangeListener, useSQLiteContext } from "expo-sqlite";
import { getAllChat, insertChatStatement } from "@/db/statements";

const headerHeight = 50;

const App = () => {
  const db = useSQLiteContext();
  const theme = useColorScheme();

  const { hideModal, imageURL, isVisible } = useAvatarModal();

  const [chats, setChats] = useState<ChatListItemProps[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatListItemProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      const allChats = await getAllChat(db);
      setChats(allChats);
      setFilteredChats(allChats);
    };
    console.log("initial list db -------");
    fetchChats();
  }, [db]);

  useEffect(() => {
    console.log("db list check -------");
    const listener = addDatabaseChangeListener(async (event) => {
      console.log("db list update -------");
      const allChats = await getAllChat(db);
      setChats(allChats);
      setFilteredChats(
        allChats.filter((chat) =>
          chat.chatName.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    });

    return () => listener.remove();
  }, [db, searchQuery]);

  const handleSearch = useCallback(
    (query: string) => {
      console.log("useCallback ----------");
      setSearchQuery(query);
      setFilteredChats(
        chats.filter((chat) =>
          chat.chatName.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    },
    [chats],
  );

  const renderItem = ({ item }: { item: ChatListItemProps }) => (
    <ChatListItem key={item.id} {...item} />
  );

  return (
    <View className="flex-1">
      <StatusBar style="auto" />
      <SafeAreaView className="flex-1">
        <ListWithDynamicHeader
          data={filteredChats}
          renderItem={renderItem}
          ListHeaderComponent={<HeaderComponent handleSearch={handleSearch} />}
          DynamicHeaderComponent={Header}
          headerHeight={headerHeight}
          ListFooterComponent={ListFooterComponent}
        />

        <AvatarModal
          isVisible={isVisible}
          onClose={hideModal}
          imageURL={imageURL}
        />

        <FAB
          icon="plus"
          className="absolute bottom-0 right-0 m-4 bg-primary-light"
          onPress={() => router.push("/sos")}
          color="white"
        />
      </SafeAreaView>
    </View>
  );
};

const Header = () => {
  const theme = useColorScheme();
  const db = useSQLiteContext();

  return (
    <ThemedView
      className={`h-[${headerHeight}] flex-row items-center justify-between px-2`}
    >
      <ThemedText>Conversations</ThemedText>
      <View className="overflow-hidden rounded-full">
        <TouchableRipple
          onPress={async () => {
            console.log("config");
            const insertChat = await insertChatStatement(db);

            const result = await insertChat.executeAsync({
              $id: 25,
              $username: "first user name",
              $chatName: "first user name",
              $lastMessageTime: Date.now() + 1000,
              $recentMessage: "nothing here",
              $imageURL: "https://cataas.com/cat",
            });
          }}
          rippleColor={
            theme === "dark" ? "rgba(255, 255, 255, .32)" : "rgba(0, 0, 0, .15)"
          }
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

  return (
    <View className="w-full items-center justify-center">
      <View className="my-2 h-12 w-[95%] rounded-3xl bg-background-light/80 px-4 dark:bg-white/10">
        <Pressable
          onPress={() => console.log(selectedChatItems)}
          className="flex-1 flex-row items-center"
        >
          <Ionicons
            size={20}
            name="search"
            color={theme === "dark" ? "white" : "black"}
          />
          <TextInput
            className="ml-2 flex-1 text-text-light dark:text-text-dark"
            placeholder="Search..."
            placeholderTextColor={
              theme === "dark" ? "rgba(225,232,249,0.7)" : "rgba(6,13,30,0.7)"
            }
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

const ListFooterComponent = () => {
  return (
    <ThemedView className="h-[80] w-max items-center justify-center border-t-[1px] border-primary-light/50">
      <ThemedText>[APP-NAME]</ThemedText>
    </ThemedView>
  );
};

export default () => (
  <AvatarModalProvider>
    <SelectionProvider>
      <App />
    </SelectionProvider>
  </AvatarModalProvider>
);
