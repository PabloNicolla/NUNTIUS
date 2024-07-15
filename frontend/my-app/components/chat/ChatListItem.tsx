import { Image, Pressable, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, TouchableRipple } from "react-native-paper";
import { useSelection } from "@/providers/chat-provider";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useAvatarModal } from "@/providers/avatarModal-provider";
import { differenceInDays, format } from "date-fns";
import { router } from "expo-router";

export type ChatListItemProps = {
  id: number;
  contactId: number;
  lastMessageId?: number;
  lastMessageValue?: string;
  lastMessageTimestamp?: number;
  username: string;
  name: string;
  imageURL?: string;

  // isVisible?: boolean;
};

const ChatListItem = React.memo(function ChatListItem({
  id,
  contactId,
  lastMessageId,
  lastMessageValue,
  lastMessageTimestamp,
  username,
  name,
  imageURL,
}: ChatListItemProps) {
  const theme = useColorScheme() ?? "light";
  const { isSelectionActive, selectedChatItems, selectModeHandler } =
    useSelection();
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(selectedChatItems.has(id));
  }, [selectedChatItems, id]);

  console.log("-----------------------------------", id);

  return (
    <View className="h-[80] w-full">
      <TouchableRipple
        className={` ${isSelected && "bg-primary-light/30 dark:bg-primary-light/40"} z-20 flex-1`}
        onPress={() => {
          if (!isSelectionActive) {
            console.log("Pressed");
            router.push({ pathname: `/chat/[id]`, params: { id: id } });
          } else {
            selectModeHandler(id);
          }
          return true;
        }}
        onLongPress={() => {
          console.log("loong");
          setIsSelected(!isSelected);
          selectModeHandler(id);
        }}
        rippleColor={
          theme === "dark" ? "rgba(255, 255, 255, .32)" : "rgba(0, 0, 0, .15)"
        }
      >
        <View className="flex-1 flex-row items-center gap-x-2 px-2">
          <View className="relative">
            <CustomAvatar
              username={username}
              isSelectionActive={isSelectionActive}
              isSelected={isSelected}
              imageURl={imageURL}
            />
          </View>

          <View className="h-[50] flex-1 flex-col">
            <ChatDetails
              chatName={name}
              lastMessageTime={lastMessageTimestamp}
            />
            <MostRecentMessage recentMessage={lastMessageValue} />
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
});

const CustomAvatar = ({
  username,
  isSelectionActive,
  isSelected,
  imageURl,
}: {
  username: string;
  isSelectionActive: boolean;
  isSelected: boolean;
  imageURl?: string;
}) => {
  const [imageError, setImageError] = useState(false);
  const { showModal } = useAvatarModal();

  const getInitials = (name: string) => {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");
    return initials.slice(0, 2).toUpperCase();
  };

  return (
    <View>
      <Pressable
        onPress={() => {
          if (imageURl) showModal(imageURl ?? "");
        }}
        disabled={isSelectionActive}
      >
        {imageError || !imageURl ? (
          <Avatar.Text label={getInitials(username)} size={50} />
        ) : (
          <Image
            source={{ uri: imageURl }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        )}
        {isSelected && (
          <View className="absolute bottom-0 right-0 z-20 h-[20] w-[20] rounded-full bg-primary-light">
            <Ionicons
              name="checkmark"
              color={"white"}
              className="z-20"
              size={20}
            />
          </View>
        )}
      </Pressable>
    </View>
  );
};

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

const MostRecentMessage = ({ recentMessage }: { recentMessage?: string }) => {
  return (
    <View className="h-1/2 w-full justify-center">
      <ThemedText
        className="overflow-ellipsis text-text-light/70 dark:text-text-dark/70"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {recentMessage}
      </ThemedText>
    </View>
  );
};

const formatDate = (lastMessageTime: number) => {
  const now = new Date();
  const messageDate = new Date(lastMessageTime);

  const diffInMinutes = (now.getTime() - messageDate.getTime()) / 60000;
  const diffInDays = differenceInDays(now, messageDate);

  if (diffInMinutes < 1440) {
    // less than 1 day
    return format(messageDate, "hh:mm");
  } else if (diffInDays === 1) {
    // yesterday
    return "yesterday";
  } else {
    return format(messageDate, "yyyy-MM-dd");
  }
};

export default ChatListItem;
