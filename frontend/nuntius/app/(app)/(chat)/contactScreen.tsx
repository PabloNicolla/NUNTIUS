import React, { useCallback, useEffect, useState } from "react";
import ChatOption from "@/components/contacts/contact-options";
import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavBar from "@/components/custom-nav-bar/top-nav-bar";
import {
  FlatList,
  Pressable,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { router } from "expo-router";

import { addDatabaseChangeListener, useSQLiteContext } from "expo-sqlite";
import { useAvatarModal } from "@/hooks/providers/avatarModal-provider";
import AvatarModal from "@/components/modals/avatar-modal";
import { Ionicons } from "@expo/vector-icons";
import useContactReducer from "@/hooks/reducers/useContactReducer";
import { getAllContacts } from "@/lib/db/statements";
import { Contact } from "@/lib/db/schemaTypes";
import ContactListItem from "@/components/contacts/contact-list-item";
import { useSession } from "@/hooks/providers/session-provider";

type Props = {};

const ChatOptions = (props: Props) => {
  const theme = useColorScheme() ?? "dark";
  const db = useSQLiteContext();
  const { getDbPrefix } = useSession();
  const { hideModal, imageURL, isVisible } = useAvatarModal();
  const [state, dispatch] = useContactReducer();

  const dbPrefix = getDbPrefix();

  if (!dbPrefix) {
    throw new Error("[ADD_CONTACT]: ERROR: invalid dbPrefix");
  }

  const fetchAllContacts = useCallback(async () => {
    const allContacts = await getAllContacts(db, dbPrefix);
    if (!allContacts) {
      console.log("[CONTACT_SCREEN]: getAllContacts queried undefined");
    }
    dispatch({ type: "SET_CONTACTS", payload: allContacts ?? [] });
  }, [db, dispatch, dbPrefix]);

  useEffect(() => {
    console.log("[CONTACT_SCREEN]: db contact initial load");
    fetchAllContacts();
  }, [db, dispatch, fetchAllContacts]);

  useEffect(() => {
    console.log("[CONTACT_SCREEN]: db contact add listener");
    const listener = addDatabaseChangeListener((event) => {
      console.log("[CONTACT_SCREEN]: db contact run Listener", event);
      if (event.tableName === `_${dbPrefix}_contact`) {
        fetchAllContacts();
      }
    });
    return () => listener.remove();
  }, [db, dispatch, fetchAllContacts, dbPrefix]);

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
  const theme = useColorScheme() ?? "dark";
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View className="w-full items-center justify-center">
      <View className="my-2 h-12 w-[95%] rounded-3xl bg-black/5 px-4 dark:bg-white/10">
        <Pressable className="flex-1 flex-row items-center" onPress={() => {}}>
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
