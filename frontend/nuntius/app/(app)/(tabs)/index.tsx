import React, { useEffect, useCallback, useRef } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ListWithDynamicHeader from "@/components/list/list-with-dynamic-header";
import { useAvatarModal } from "@/hooks/providers/avatarModal-provider";
import AvatarModal from "@/components/modals/avatar-modal";
import { ThemedView } from "@/components/themed-view";
import { FAB } from "react-native-paper";
import { router } from "expo-router";
import { addDatabaseChangeListener, useSQLiteContext } from "expo-sqlite";
import useChatReducer from "@/hooks/reducers/useChatReducer";
import {
  getAllPrivateChatsJoinContacts,
  getFirstContactByRowId,
  getFirstPrivateChatJoinContactByRowId,
} from "@/lib/db/statements";
import { useSession } from "@/hooks/providers/session-provider";
import ConversationListItem, {
  ConversationListItemProps,
} from "@/components/conversations/conversation-list-item";
import ListFooterComponent from "@/components/conversations/conversation-list-footer";
import ActionsHeaderOnSelect from "@/components/conversations/conversation-action-header";
import ConversationHeader from "@/components/conversations/conversation-header";
import ConversationHeaderComponent from "@/components/conversations/conversation-list-header";

const headerHeight = 50;

const App = () => {
  const [state, dispatch] = useChatReducer();
  const { hideModal, imageURL, isVisible } = useAvatarModal();
  const { getDbPrefix } = useSession();
  const db = useSQLiteContext();
  const dbPrefix = getDbPrefix();

  if (!dbPrefix) {
    throw new Error("[GROUPS] ERROR: invalid dbPrefix");
  }

  const deleteSelectedChats = () => {};

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

  // const debouncedFetchAllChats = useDebounce(fetchAllPrivateChats, 200);

  useEffect(() => {
    console.log("[CHAT_LIST]: db chat add Listener");

    const listener = addDatabaseChangeListener(async (event) => {
      console.log("[CHAT_LIST]: db chat run Listener", event);
      if (event.tableName === `_${dbPrefix}_private_chat`) {
        const newChat = await getFirstPrivateChatJoinContactByRowId(
          db,
          dbPrefix,
          event.rowId,
        );

        if (!newChat) {
          console.log("[CHAT_LIST]: no chat found with this rowId");
          return;
        }

        dispatch({
          payload: newChat,
          type: state.chatIds.has(newChat.id) ? "UPDATE_CHAT" : "ADD_CHAT",
        });
      } else if (event.tableName === `_${dbPrefix}_contact`) {
        const newContact = await getFirstContactByRowId(
          db,
          dbPrefix,
          event.rowId,
        );

        if (!newContact) {
          console.log("[CHAT_LIST]: no contact found with this rowId");
          return;
        }

        if (state.chatIds.has(newContact.id)) {
          dispatch({ payload: newContact, type: "UPDATE_CHAT_CONTACT" });
        }
      }
    });

    return () => listener.remove();
  }, [db, dispatch, dbPrefix]);

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
    item: ConversationListItemProps;
    index: number;
  }) => <ConversationListItem key={item.id} {...item} test-index={index} />;

  return (
    <ThemedView className="flex-1">
      <StatusBar style="auto" />

      <SafeAreaView className="flex-1">
        <View className="relative flex-1">
          <ListWithDynamicHeader
            data={state.filteredChats}
            renderItem={renderItem}
            ListHeaderComponent={
              <ConversationHeaderComponent handleSearch={handleSearch} />
            }
            DynamicHeaderComponent={DynamicHeaderComponent}
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

          <ActionsHeaderOnSelect headerHeight={headerHeight} />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
};

const DynamicHeaderComponent = () => {
  return <ConversationHeader headerHeight={headerHeight} />;
};

export default App;
