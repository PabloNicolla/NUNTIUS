import TopNavBarChat from "@/components/custom-nav-bar/top-nav-bar-chat";
import { ThemedView } from "@/components/themed-view";
import {
  Condition,
  Message,
  PrivateChat,
  ReceiverType,
} from "@/lib/db/schemaTypes";
import {
  getAllMessagesByChatIdWithPagination,
  getFirstMessage,
  getFirstPrivateChat,
  resetPrivateChatNotificationCount,
} from "@/lib/db/statements";
import { useSession } from "@/hooks/providers/session-provider";
import { useLocalSearchParams } from "expo-router";
import { addDatabaseChangeListener, useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import React from "react";
import EditMessageModal from "@/components/modals/edit-message-modal";
import MessageItem from "@/components/chat/message-list-item";
import DeleteMessageModal from "@/components/modals/delete-message-modal";
import DateDivider from "@/components/chat/date-divider";
import { StatusBar } from "expo-status-bar";
import ChatMessageFooter from "@/components/chat/chat-message-footer";

export type MessageItemType = Message & {
  isSelected?: boolean;
};

export default function ChatScreen() {
  const [chat, setChat] = useState<PrivateChat | null>(null);
  const [messages, setMessages] = useState<MessageItemType[]>([]);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [requestMoreMsg, setRequestMoreMsg] = useState(false);
  const [openEditMsgModal, setOpenEditMsgModal] = useState(false);
  const [openDeleteMsgModal, setOpenDeleteMsgModal] = useState(false);
  const PAGE_LIMIT = 20;

  const { id: chatId, contactId, canCreateChatIfNull } = useLocalSearchParams();
  const theme = useColorScheme() ?? "dark";
  const db = useSQLiteContext();
  const { user, getDbPrefix } = useSession();

  const dbPrefix = getDbPrefix();

  if (!dbPrefix) {
    throw new Error("[CHAT_SCREEN]: ERROR: invalid dbPrefix");
  }

  if (!user) {
    throw new Error("[CHAT_SCREEN]: ERROR: user most be logged in");
  }

  if (!contactId) {
    console.log("[CHAT_SCREEN]: ERROR: missing contactId");
  }

  const clearSelectedMessages = () => {
    setMessages((prevMessages) => {
      const newMessages = prevMessages.map((message) => {
        message.isSelected = false;
        return message;
      });
      return [...newMessages];
    });
  };

  const deleteSelectedMessages = () => {
    setOpenDeleteMsgModal(true);
  };

  const confirmMessagesDeletion = () => {
    setMessages((prevMessages) => {
      const newMessages = prevMessages.filter((message) => {
        return !message.isSelected;
      });
      return [...newMessages];
    });
  };

  const editSelectedMessage = () => {
    setOpenEditMsgModal(true);
    clearSelectedMessages();
  };

  useEffect(() => {
    return () => {
      resetPrivateChatNotificationCount(db, dbPrefix, String(chatId));
    };
  }, []);

  useEffect(() => {
    async function loadMessages() {
      setRequestMoreMsg(false);
      if (loadingMore) return;

      setLoadingMore(true);
      const newMessages = await getAllMessagesByChatIdWithPagination(
        db,
        dbPrefix!,
        String(chatId),
        ReceiverType.PRIVATE_CHAT,
        PAGE_LIMIT,
        page * PAGE_LIMIT,
        true,
      );
      if (newMessages) {
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
        setPage((prevPage) => prevPage + 1);
      }
      setLoadingMore(false);
    }
    loadMessages();
  }, [chatId, db, requestMoreMsg, dbPrefix]);

  useEffect(() => {
    console.log("[CHAT_SCREEN]: GET CHAT BY ID: %d", String(chatId));
    async function getChat() {
      const chat = await getFirstPrivateChat(db, dbPrefix!, String(chatId));
      if (!chat) {
        console.log("[CHAT_SCREEN]: getFirstPrivateChat ERROR: invalid chatId");
      }
      setChat(chat ?? null);
    }
    getChat();
    resetPrivateChatNotificationCount(db, dbPrefix, String(chatId));
  }, []);

  useEffect(() => {
    const listener = addDatabaseChangeListener(async (event) => {
      if (event.tableName !== `_${dbPrefix}_message`) {
        return;
      }
      const new_message = await getFirstMessage(db, dbPrefix, event.rowId);
      if (!new_message || new_message?.chatId !== String(chatId)) {
        return;
      }

      if (new_message.condition === Condition.NORMAL) {
        setMessages((prevMessages) => [new_message, ...prevMessages]);
      } else {
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === new_message.id ? new_message : message,
          ),
        );
      }
    });

    return () => listener.remove();
  }, [db, chatId, dbPrefix]);

  const renderItem = ({ item, index }: { item: Message; index: number }) => {
    const currentMessageDate = new Date(item.timestamp);
    const previousMessageDate =
      index < messages.length - 1
        ? new Date(messages[index + 1].timestamp)
        : null;

    const showDateDivider =
      !previousMessageDate ||
      currentMessageDate.getDate() !== previousMessageDate.getDate() ||
      currentMessageDate.getMonth() !== previousMessageDate.getMonth() ||
      currentMessageDate.getFullYear() !== previousMessageDate.getFullYear();

    const previousMessageSender =
      index < messages.length - 1 ? messages[index + 1].senderId : null;
    return (
      <View>
        {showDateDivider && <DateDivider date={currentMessageDate} />}
        <MessageItem
          item={item}
          user={user}
          previousMessageSender={previousMessageSender}
        />
      </View>
    );
  };

  return (
    <ThemedView className="flex-1">
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        className=""
        keyboardVerticalOffset={0}
      >
        <SafeAreaView className="flex-1">
          <TopNavBarChat
            contactId={String(contactId)}
            clearSelectedMessages={() => {
              clearSelectedMessages();
            }}
            deleteSelectedMessages={() => {
              deleteSelectedMessages();
            }}
            editSelectedMessage={() => {
              editSelectedMessage();
            }}
          />
          <View className="flex-1">
            <FlatList
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              indicatorStyle={theme === "dark" ? "white" : "black"}
              showsHorizontalScrollIndicator={true}
              inverted={true}
              initialNumToRender={PAGE_LIMIT}
              maxToRenderPerBatch={PAGE_LIMIT}
              windowSize={6}
              nestedScrollEnabled={true}
              onEndReachedThreshold={1}
              onEndReached={() => {
                if (!loadingMore) {
                  setRequestMoreMsg(true);
                }
              }}
            />
          </View>
          <ChatMessageFooter
            chat={chat}
            canCreateChatIfNull={String(canCreateChatIfNull)}
            contactId={String(contactId)}
            setChat={(chat: PrivateChat | null) => {
              setChat(chat);
            }}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>

      <EditMessageModal
        isVisible={openEditMsgModal}
        onClose={() => {
          setOpenEditMsgModal(false);
        }}
      />

      <DeleteMessageModal
        isVisible={openDeleteMsgModal}
        onClose={() => {
          setOpenDeleteMsgModal(false);
        }}
        confirmDeletion={() => {
          confirmMessagesDeletion();
        }}
        chat={chat}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
