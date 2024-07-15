import React, { useEffect, useState, useCallback } from "react";
import { View, Pressable, TextInput, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatListItem, {
  ChatListItemProps,
} from "@/components/chat/ChatListItem";
import { useSelection } from "@/providers/chat-provider";
import { ThemedText } from "@/components/ThemedText";
import { StatusBar } from "expo-status-bar";
import ListWithDynamicHeader from "@/components/list/ListWithHeader";
import { useAvatarModal } from "@/providers/avatarModal-provider";
import AvatarModal from "@/components/modals/AvatarModal";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { FAB, TouchableRipple } from "react-native-paper";
import { router } from "expo-router";
import { addDatabaseChangeListener, useSQLiteContext } from "expo-sqlite";
import useChatReducer from "@/providers/useChatReducer";
import { getAllPrivateChats } from "@/db/statements";

const headerHeight = 50;

const App = () => {
  const db = useSQLiteContext();
  const { hideModal, imageURL, isVisible } = useAvatarModal();
  const [state, dispatch] = useChatReducer();

  // useEffect(() => {
  //   console.log("----- db chat initial load -----");
  //   const fetchPrivateChats = async () => {
  //     const allPrivateChats = await db.getAllAsync(`
  //       SELECT

  //       `);

  //     dispatch({ type: "SET_CHATS", payload: allChats });
  //   };
  //   fetchPrivateChats();
  // }, [db, dispatch]);

  // useEffect(() => {
  //   console.log("----- db chat add Listener -----");
  //   const listener = addDatabaseChangeListener(async (event) => {
  //     console.log("----- db chat run Listener -----", event);
  //     const allChats = await getAllVisibleChats(db);
  //     dispatch({ type: "SET_CHATS", payload: allChats });
  //   });
  //   return () => listener.remove();
  // }, [db, dispatch]);

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
        {/* <ListWithDynamicHeader
          data={state.filteredChats}
          renderItem={renderItem}
          ListHeaderComponent={<HeaderComponent handleSearch={handleSearch} />}
          DynamicHeaderComponent={Header}
          headerHeight={headerHeight}
          ListFooterComponent={ListFooterComponent}
        /> */}

        <AvatarModal
          isVisible={isVisible}
          onClose={hideModal}
          imageURL={imageURL}
        />

        <FAB
          icon="plus"
          className="absolute bottom-0 right-0 m-4 bg-primary-light"
          onPress={() => router.push("/chatOptions")}
          color="white"
        />
      </SafeAreaView>
    </ThemedView>
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

  const db = useSQLiteContext();

  return (
    <View className="w-full items-center justify-center">
      <View className="my-2 h-12 w-[95%] rounded-3xl bg-black/5 px-4 dark:bg-white/10">
        <Pressable
          onPress={async () => {
            const chats = await db.getFirstAsync(
              "SELECT * FROM chat WHERE id = 0",
            );
            console.log(chats);

            console.log(selectedChatItems);
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
      <ThemedText>[APP-NAME]</ThemedText>
    </ThemedView>
  );
};

export default App;
