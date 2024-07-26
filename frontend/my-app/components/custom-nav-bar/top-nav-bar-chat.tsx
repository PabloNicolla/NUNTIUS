import { Image, Pressable, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "../themed-view";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "../themed-text";
import { Avatar, TouchableRipple } from "react-native-paper";
import { useAvatarModal } from "@/providers/avatarModal-provider";
import { useSQLiteContext } from "expo-sqlite";
import { Contact } from "@/db/schemaTypes";
import { deleteAllMessageById, getFirstContact } from "@/db/statements";
import { useMessageSelection } from "@/providers/message-selection-provider";
import { useMessageSelected } from "@/providers/message-selected-provider";

type Props = {
  contactId?: number;
  clearSelectedMessages: () => void;
  deleteSelectedMessages: () => void;
};

const TopNavBarChat = ({
  contactId,
  deleteSelectedMessages,
  clearSelectedMessages,
}: Props) => {
  const theme = useColorScheme() ?? "light";
  const [contact, setContact] = useState<Contact | null>(null);
  const db = useSQLiteContext();

  const { isSelectionActive } = useMessageSelection();
  const { clearSelected, selectedMessages } = useMessageSelected();

  useEffect(() => {
    console.log("[TOP_NAV_BAR_CHAT]: for user_id:", contactId);
    async function getChatAndContact() {
      if (contactId) {
        const contact = await getFirstContact(db, contactId);
        if (!contact) {
          console.log("TopNavBarChat ERROR invalid contactId");
        }
        setContact(contact ?? null);
      }
    }
    getChatAndContact();
  }, [contactId, db]);

  return (
    <ThemedView className="h-14 w-full flex-row items-center border-b-[1px] border-primary-light/50 px-2">
      <Pressable
        className="mr-4"
        onPress={() => {
          if (isSelectionActive) {
            clearSelected();
            clearSelectedMessages();
          } else {
            router.back();
          }
        }}
      >
        <MaterialIcons
          name="arrow-back"
          size={30}
          color={theme === "light" ? "black" : "white"}
        />
      </Pressable>
      {!isSelectionActive && (
        <CustomAvatar
          username={contact?.name ?? ""}
          imageURl={contact?.imageURL}
        />
      )}
      <ThemedText className="pl-4">
        {isSelectionActive ? selectedMessages.size : contact?.name}
      </ThemedText>
      <View
        style={{ display: isSelectionActive ? "flex" : "none" }}
        className="flex-1 items-end justify-center"
      >
        <View className="flex-row space-x-2">
          <View className="overflow-hidden rounded-full">
            <TouchableRipple
              onPress={async () => {
                console.log("trash");
                selectedMessages.forEach(async (messageId) => {
                  await deleteAllMessageById(db, messageId);
                });
                deleteSelectedMessages();
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
      </View>
    </ThemedView>
  );
};

const CustomAvatar = ({
  username,
  imageURl,
}: {
  username: string;
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
      >
        {imageError || !imageURl ? (
          <Avatar.Text label={getInitials(username)} size={40} />
        ) : (
          <Image
            source={{ uri: imageURl }}
            style={{ width: 40, height: 40, borderRadius: 25 }}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        )}
      </Pressable>
    </View>
  );
};

export default TopNavBarChat;
