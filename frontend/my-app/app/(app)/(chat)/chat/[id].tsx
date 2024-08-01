import TopNavBarChat from "@/components/custom-nav-bar/top-nav-bar-chat";
import { ThemedView } from "@/components/themed-view";
import {
  Condition,
  Contact,
  Message,
  MessageStatus,
  MessageType,
  PrivateChat,
  ReceiverType,
} from "@/db/schemaTypes";
import {
  getAllMessagesByChatIdWithPagination,
  getFirstMessage,
  getFirstPrivateChat,
  insertMessage,
  insertPrivateChat,
  resetPrivateChatNotificationCount,
  updatePrivateChatById,
} from "@/db/statements";
import { useSession } from "@/providers/session-provider";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { addDatabaseChangeListener, useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { TouchableRipple } from "react-native-paper";
import { useWebSocket } from "@/providers/websocket-provider";
import React from "react";
import EditMessageModal from "@/components/modals/edit-message-modal";
import MessageItem from "@/components/chat/message-list-item";
import DeleteMessageModal from "@/components/modals/delete-message-modal";

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
  const PAGE_LIMIT = 50;

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
    return <MessageItem item={item} user={user} />;
  };

  return (
    <ThemedView className="flex-1">
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
              windowSize={21}
              nestedScrollEnabled={true}
              onEndReachedThreshold={1}
              onEndReached={() => {
                if (!loadingMore) {
                  setRequestMoreMsg(true);
                }
              }}
            />
          </View>
          <FooterComponent
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
      />
    </ThemedView>
  );
}

const FooterComponent = ({
  chat,
  canCreateChatIfNull,
  contactId,
  setChat,
}: {
  chat: PrivateChat | null;
  canCreateChatIfNull: string;
  contactId: Contact["id"];
  setChat: (chat: PrivateChat | null) => void;
}) => {
  const { user, getDbPrefix } = useSession();
  const theme = useColorScheme() ?? "dark";
  const [messageValue, setMessageValue] = useState("");
  const { sendMessage } = useWebSocket();
  const db = useSQLiteContext();

  const dbPrefix = getDbPrefix();

  if (!dbPrefix) {
    throw new Error("[CHAT_SCREEN]: ERROR: invalid dbPrefix");
  }

  const handleSendMessage = async (messageValue: string) => {
    if (canCreateChatIfNull === "yes" && !chat) {
      await insertPrivateChat(db, dbPrefix, { id: contactId, contactId });
      chat = (await getFirstPrivateChat(db, dbPrefix, contactId)) ?? null;
      setChat(chat);
    }

    if (chat && user) {
      const message: Message = {
        id: -1,
        chatId: chat.id,
        condition: Condition.NORMAL,
        receiverId: chat.contactId,
        senderId: user.id,
        receiverType: ReceiverType.PRIVATE_CHAT,
        senderReferenceId: Date.now(),
        status: MessageStatus.PENDING,
        timestamp: Date.now(),
        type: MessageType.TEXT,
        value: messageValue,
      };
      const ret = await insertMessage(db, dbPrefix, message);

      if (!ret) {
        throw new Error(
          "[CHAT_SCREEN]: ERROR: failed to insert new message in DB",
        );
      }

      message.id = ret.lastInsertRowId;
      // message.senderReferenceId = ret.lastInsertRowId;

      if (message.senderId === message.chatId) {
        message.status = MessageStatus.SENT;
      } else {
        sendMessage({
          data: message,
          type: "private_chat",
          receiver_id: message.receiverId,
        });
      }

      await updatePrivateChatById(db, dbPrefix, {
        contactId: message.receiverId,
        id: message.chatId,
        lastMessageId: ret.lastInsertRowId,
        lastMessageTimestamp: message.timestamp,
        lastMessageValue: message.value,
      });
    } else {
      console.log("[CHAT_SCREEN]: ERROR: chat or user is not defined");
    }
  };

  return (
    <View className="flex-row">
      <View className="mx-2 mb-2 justify-end overflow-hidden rounded-full">
        <TouchableRipple
          className="rounded-full bg-primary-light/50 p-3 dark:bg-primary-light"
          onPress={() => {
            console.log("pressed");
            handleSendMessage(messageValue);
            setMessageValue("");
          }}
          rippleColor={
            theme === "dark" ? "rgba(255, 255, 255, .32)" : "rgba(0, 0, 0, .15)"
          }
        >
          <Ionicons
            size={18}
            name={`${messageValue ? "send" : "mic"}`}
            color={theme === "dark" ? "white" : "black"}
          />
        </TouchableRipple>
      </View>
      <View className="mb-2 mr-2 flex-1 flex-row rounded-lg bg-background-dark/10 dark:bg-background-light/20">
        {!messageValue && (
          <View className="w-10 items-center justify-end overflow-hidden rounded-full">
            <TouchableRipple
              className="p-2"
              onPress={() => {}}
              rippleColor={
                theme === "dark"
                  ? "rgba(255, 255, 255, .32)"
                  : "rgba(0, 0, 0, .15)"
              }
            >
              <Ionicons
                size={25}
                name="camera-outline"
                color={theme === "dark" ? "white" : "black"}
              />
            </TouchableRipple>
          </View>
        )}
        <View className="w-10 items-center justify-end overflow-hidden rounded-full">
          <TouchableRipple
            className="p-2"
            onPress={() => {}}
            rippleColor={
              theme === "dark"
                ? "rgba(255, 255, 255, .32)"
                : "rgba(0, 0, 0, .15)"
            }
          >
            <Ionicons
              size={25}
              name="attach"
              color={theme === "dark" ? "white" : "black"}
            />
          </TouchableRipple>
        </View>
        <View className="max-h-40 flex-1 justify-center">
          <View className="justify-center px-2">
            <TextInput
              className="text-lg text-black dark:text-white"
              value={messageValue}
              onChangeText={(text) => {
                setMessageValue(text);
              }}
              multiline={true}
              scrollEnabled={true}
            ></TextInput>
          </View>
        </View>
        <View className="w-10 items-center justify-end overflow-hidden rounded-full">
          <TouchableRipple
            className="p-2"
            onPress={() => {
              console.log("pressed");
            }}
            rippleColor={
              theme === "dark"
                ? "rgba(255, 255, 255, .32)"
                : "rgba(0, 0, 0, .15)"
            }
          >
            <Ionicons
              size={25}
              name="happy-outline"
              color={theme === "dark" ? "white" : "black"}
            />
          </TouchableRipple>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
