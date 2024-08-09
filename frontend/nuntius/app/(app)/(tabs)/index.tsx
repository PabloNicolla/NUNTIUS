import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Pressable, TextInput, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatListItem, {
  ChatListItemProps,
} from "@/components/chat/chat-list-item";
import { useChatSelection } from "@/hooks/providers/chat-selection-provider";
import { ThemedText } from "@/components/themed-text";
import { StatusBar } from "expo-status-bar";
import ListWithDynamicHeader from "@/components/list/list-with-dynamic-header";
import { useAvatarModal } from "@/hooks/providers/avatarModal-provider";
import AvatarModal from "@/components/modals/avatar-modal";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed-view";
import { FAB, TouchableRipple } from "react-native-paper";
import { router } from "expo-router";
import { addDatabaseChangeListener, useSQLiteContext } from "expo-sqlite";
import useChatReducer from "@/hooks/reducers/useChatReducer";
import {
  deleteAllMessagesByChatId,
  deletePrivateChat,
  getAllPrivateChatsJoinContacts,
} from "@/lib/db/statements";
import { useChatSelected } from "@/hooks/providers/chat-selection-provider copy";
import { useSession } from "@/hooks/providers/session-provider";
const headerHeight = 50;

const App = () => {
  const db = useSQLiteContext();
  const { getDbPrefix } = useSession();
  const { hideModal, imageURL, isVisible } = useAvatarModal();
  const [state, dispatch] = useChatReducer();

  const dbPrefix = getDbPrefix();

  if (!dbPrefix) {
    throw new Error("[GROUPS] ERROR: invalid dbPrefix");
  }

  const fetchAllPrivateChats = useCallback(async () => {
    const allChats = await getAllPrivateChatsJoinContacts(db, dbPrefix);
    if (!allChats) {
      console.log("[GROUPS]: fetchAllPrivateChats queried undefined");
    }
    dispatch({ type: "SET_CHATS_FULL", payload: allChats ?? [] });
  }, [db, dispatch, dbPrefix]);

  useEffect(() => {
    console.log("[CHAT_LIST]: db chat initial load");
    fetchAllPrivateChats();
  }, [db, dispatch, fetchAllPrivateChats]);

  const useDebounce = (callback: () => void, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedFunction = useCallback(() => {
      if (timeoutRef.current === null) {
        timeoutRef.current = setTimeout(() => {
          console.log("[CHAT_LIST]: useDebounce");
          callback();
          timeoutRef.current = null;
        }, delay);
      }
    }, [callback, delay]);

    return debouncedFunction;
  };

  const debouncedFetchAllChats = useDebounce(fetchAllPrivateChats, 100);

  useEffect(() => {
    console.log("[CHAT_LIST]: db chat add Listener");

    const listener = addDatabaseChangeListener((event) => {
      console.log("[CHAT_LIST]: db chat run Listener", event);
      if (
        event.tableName === `_${dbPrefix}_contact` ||
        event.tableName === `_${dbPrefix}_private_chat`
      ) {
        debouncedFetchAllChats();
      }
    });

    return () => listener.remove();
  }, [db, dispatch, debouncedFetchAllChats, dbPrefix]);

  const handleSearch = useCallback(
    (query: string) => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: query });
    },
    [dispatch],
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: ChatListItemProps;
    index: number;
  }) => <ChatListItem key={item.id} {...item} test-index={index} />;

  return (
    <ThemedView className="flex-1">
      <StatusBar style="auto" />

      <SafeAreaView className="flex-1">
        <View className="relative flex-1">
          <ListWithDynamicHeader
            data={state.filteredChats}
            renderItem={renderItem}
            ListHeaderComponent={
              <HeaderComponent handleSearch={handleSearch} />
            }
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
            onPress={() => router.push("/contactScreen")}
            color="white"
          />

          <ActionsHeaderOnSelect />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
};

const Header = () => {
  const theme = useColorScheme() ?? "dark";

  return (
    <ThemedView
      className={`h-[${headerHeight}] flex-row items-center justify-between px-2`}
    >
      <ThemedText>NUNTIUS</ThemedText>
      <View className="overflow-hidden rounded-full">
        <TouchableRipple
          onPress={async () => {
            console.log("config");
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

const ActionsHeaderOnSelect = () => {
  const theme = useColorScheme() ?? "dark";
  const { isSelectionActive } = useChatSelection();
  const { clearSelected, selectedChats } = useChatSelected();
  const db = useSQLiteContext();
  const { getDbPrefix } = useSession();

  const dbPrefix = getDbPrefix();

  if (!dbPrefix) {
    throw new Error("[GROUPS] ERROR: invalid dbPrefix");
  }

  return (
    <View
      className={`absolute left-0 right-0 top-0 ${isSelectionActive ? "" : "hidden"}`}
    >
      <ThemedView
        className={`h-[${headerHeight}] flex-row items-center justify-between px-2`}
      >
        <ThemedText className="flex-grow">NUNTIUS</ThemedText>
        <View className="flex-row space-x-2">
          <View className="overflow-hidden rounded-full">
            <TouchableRipple
              onPress={async () => {
                selectedChats.forEach(async (chatId) => {
                  await deletePrivateChat(db, dbPrefix, chatId);
                  await deleteAllMessagesByChatId(db, dbPrefix, chatId);
                });
                clearSelected();
              }}
              rippleColor={
                theme === "dark"
                  ? "rgba(255, 255, 255, .32)"
                  : "rgba(0, 0, 0, .15)"
              }
            >
              <Ionicons
                name="trash-outline"
                color={theme === "dark" ? "white" : "black"}
                size={25}
              />
            </TouchableRipple>
          </View>
          <View className="overflow-hidden rounded-full">
            <TouchableRipple
              onPress={async () => {
                console.log("config");
              }}
              rippleColor={
                theme === "dark"
                  ? "rgba(255, 255, 255, .32)"
                  : "rgba(0, 0, 0, .15)"
              }
            >
              <Ionicons
                name="ellipsis-horizontal"
                color={theme === "dark" ? "white" : "black"}
                size={25}
              />
            </TouchableRipple>
          </View>
        </View>
      </ThemedView>
    </View>
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
        <Pressable
          onPress={async () => {
            console.log("Pressed");
          }}
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
      <ThemedText>NUNTIUS</ThemedText>
    </ThemedView>
  );
};

export default App;