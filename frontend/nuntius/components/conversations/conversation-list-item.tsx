import { useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableRipple } from "react-native-paper";
import { useChatSelection } from "@/hooks/providers/chat-selection-provider";
import { ThemedText } from "../themed-text";
import { differenceInDays, format } from "date-fns";
import { router } from "expo-router";
import { PrivateChatJoinContact } from "@/lib/db/schemaTypes";
import UserAvatar from "../profile/avatar";
import { ConversationItemType } from "@/hooks/reducers/useChatReducer";

export type ConversationListItemProps = PrivateChatJoinContact;

const ConversationListItem = React.memo(function ChatListItem({
  item,
}: {
  item: ConversationItemType;
}) {
  const theme = useColorScheme() ?? "dark";
  const { selectModeHandler } = useChatSelection();
  const [isSelected, setIsSelected] = useState(item.isSelected);

  useEffect(() => {
    setIsSelected(item.isSelected);
  }, [item.isSelected]);

  console.log("[CHAT_LIST_ITEM]: MOUNTING:", item.id, item.isSelected);

  return (
    <View className="h-[80] w-full">
      <TouchableRipple
        className={` ${item.isSelected && "bg-primary-light/30 dark:bg-primary-light/40"} z-20 flex-1`}
        onPress={() => {
          console.log("Pressed");
          const prevState = item.isSelected;
          item.isSelected = selectModeHandler(
            item.id,
            !item.isSelected,
            "SHORT",
          );
          if (!prevState && !item.isSelected) {
            router.push({
              pathname: `/chat/[id]`,
              params: { id: item.id, contactId: item.contactId },
            });
          } else {
            setIsSelected(item.isSelected);
          }
        }}
        onLongPress={() => {
          console.log("long");
          item.isSelected = selectModeHandler(
            item.id,
            !item.isSelected,
            "LONG",
          );
          setIsSelected(item.isSelected);
        }}
        rippleColor={
          theme === "dark" ? "rgba(255, 255, 255, .32)" : "rgba(0, 0, 0, .15)"
        }
      >
        <View className="flex-1 flex-row items-center gap-x-2 px-2">
          <View className="relative">
            <UserAvatar
              firstName={item.first_name}
              isSelectionActive={item.isSelected}
              isSelected={item.isSelected}
              imageURl={item.imageURL}
              size={50}
            />
          </View>

          <View className="h-[50] flex-1 flex-col">
            <ChatDetails
              chatName={item.first_name}
              lastMessageTime={item.lastMessageTimestamp}
            />
            <MostRecentMessage
              recentMessage={item.lastMessageValue}
              notificationCount={item.notificationCount}
            />
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
});

const ChatDetails = ({
  chatName,
  lastMessageTime,
}: {
  chatName: string;
  lastMessageTime?: number;
}) => {
  return (
    <View className="h-1/2 w-full flex-row justify-between">
      <View className="flex-1 justify-center overflow-hidden">
        <ThemedText
          className="overflow-ellipsis"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {chatName}
        </ThemedText>
      </View>
      <View className="h-full w-[100] items-end justify-center">
        <ThemedText
          className="overflow-ellipsis text-xs"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {lastMessageTime && formatDate(lastMessageTime)}
        </ThemedText>
      </View>
    </View>
  );
};

const MostRecentMessage = ({
  recentMessage,
  notificationCount,
}: {
  recentMessage?: string;
  notificationCount?: number;
}) => {
  return (
    <View className="h-1/2 w-full flex-row justify-between">
      <View className="flex-1 justify-center overflow-hidden">
        <ThemedText
          className="overflow-ellipsis text-text-light/70 dark:text-text-dark/70"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {recentMessage}
        </ThemedText>
      </View>
      {!!notificationCount && (
        <View className="h-full items-end justify-center">
          <View className="min-w-[20] items-center rounded-full bg-primary-light">
            <ThemedText className="text-sm text-text-dark">
              {notificationCount}
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  );
};

const truncateToDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const formatDate = (lastMessageTime: number) => {
  const now = new Date();
  const messageDate = new Date(lastMessageTime);
  const truncatedNow = truncateToDay(now);
  const truncatedMsgDate = truncateToDay(messageDate);

  const diffInDays = differenceInDays(truncatedNow, truncatedMsgDate);

  if (diffInDays === 0) {
    return format(messageDate, "HH:mm");
  } else if (diffInDays === 1) {
    return "yesterday";
  } else {
    return format(messageDate, "yyyy-MM-dd");
  }
};

export default ConversationListItem;
