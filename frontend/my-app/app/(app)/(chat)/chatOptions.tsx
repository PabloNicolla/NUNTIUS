import React, { useCallback, useEffect, useState } from "react";
import ChatOption from "@/components/chat/ChatOption";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavBar from "@/components/TopNavBar";
import {
  FlatList,
  Pressable,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { router } from "expo-router";

import { useSQLiteContext } from "expo-sqlite";
import { useAvatarModal } from "@/providers/avatarModal-provider";
import AvatarModal from "@/components/modals/AvatarModal";
import { Ionicons } from "@expo/vector-icons";
import useContactReducer from "@/providers/useContactReducer";
import { getAllContacts } from "@/db/statements";
import { Contact } from "@/db/schemaTypes";
import ContactListItem from "@/components/chat/ContactListItem";

type Props = {};

const ChatOptions = (props: Props) => {
  const theme = useColorScheme();
  const db = useSQLiteContext();
  const { hideModal, imageURL, isVisible } = useAvatarModal();
  const [state, dispatch] = useContactReducer();

  useEffect(() => {
    console.log("----- db chat initial load -----");
    const fetchChats = async () => {
      const allChats = await getAllContacts(db);
      dispatch({ type: "SET_CONTACTS", payload: allChats });
    };
    fetchChats();
  }, [db, dispatch]);

  const handleSearch = useCallback(
    (query: string) => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: query });
    },
    [dispatch],
  );

  const renderItem = ({ item, index }: { item: Contact; index: number }) => (
    <ContactListItem key={item.id} {...item} test-index={index} />
  );

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <TopNavBar title="Chat Options" />
        <View className="border-b-[1px] border-gray-500/50">
          <ChatOption
            icon="person-add"
            title="New Contact"
            handlePress={() => {
              router.push("/addContact");
            }}
          />
          <ChatOption icon="people" title="New Group" handlePress={() => {}} />
        </View>

        <FlatList
          data={state.filteredContacts}
          renderItem={renderItem}
          // ListFooterComponent={ListFooterComponent}
          ListHeaderComponent={<HeaderComponent handleSearch={handleSearch} />}
          indicatorStyle={theme === "dark" ? "white" : "black"}
          showsHorizontalScrollIndicator={true}
        />

        <AvatarModal
          isVisible={isVisible}
          onClose={hideModal}
          imageURL={imageURL}
        />
      </SafeAreaView>
    </ThemedView>
  );
};

const HeaderComponent = ({
  handleSearch,
}: {
  handleSearch: (query: string) => void;
}) => {
  const theme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View className="w-full items-center justify-center">
      <View className="my-2 h-12 w-[95%] rounded-3xl bg-black/5 px-4 dark:bg-white/10">
        <Pressable className="flex-1 flex-row items-center">
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

export default ChatOptions;
