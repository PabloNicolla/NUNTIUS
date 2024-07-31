import { Image, Pressable, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "../themed-view";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "../themed-text";
import { Avatar, TouchableRipple } from "react-native-paper";
import { useAvatarModal } from "@/providers/avatarModal-provider";
import { useSQLiteContext } from "expo-sqlite";
import { Contact, Message } from "@/db/schemaTypes";
import {
  deleteMessageById,
  deleteMessagesByIds,
  getFirstContact,
  getFirstMessage,
} from "@/db/statements";
import { useMessageSelection } from "@/providers/message-selection-provider";
import { useMessageSelected } from "@/providers/message-selected-provider";
import { useSession } from "@/providers/session-provider";

type Props = {
  contactId?: Contact["id"];
  clearSelectedMessages: () => void;
  deleteSelectedMessages: () => void;
  editSelectedMessage: () => void;
};

const TopNavBarChat = ({
  contactId,
  deleteSelectedMessages,
  clearSelectedMessages,
  editSelectedMessage,
}: Props) => {
  const theme = useColorScheme() ?? "dark";
  const [contact, setContact] = useState<Contact | null>(null);
  const { getDbPrefix } = useSession();
  const db = useSQLiteContext();

  const dbPrefix = getDbPrefix();

  if (!dbPrefix) {
    throw new Error("[TOP_NAV_BAR_CHAT] ERROR: invalid dbPrefix");
  }

  const { isSelectionActive } = useMessageSelection();
  const { clearSelected, selectedMessages } = useMessageSelected();

  useEffect(() => {
    console.log("[TOP_NAV_BAR_CHAT]: for user_id:", contactId);
    async function getChatAndContact() {
      if (!contactId) {
        console.log("[TOP_NAV_BAR_CHAT]: ERROR invalid contactId");
        return;
      }

      const contact = await getFirstContact(db, dbPrefix!, contactId);
      if (!contact) {
        console.log(
          "[TOP_NAV_BAR_CHAT]: ERROR contactId not found in db query",
        );
      }
      setContact(contact ?? null);
    }
    getChatAndContact();
  }, [contactId, db, dbPrefix]);

  const handleDelete = async () => {
    const messageIds = Array.from(selectedMessages);
    await deleteMessagesByIds(db, dbPrefix, messageIds);
    // selectedMessages.forEach(async (messageId) => {
    //   await deleteMessageById(db, dbPrefix, messageId);
    // });
    deleteSelectedMessages();
    clearSelected();
  };

  const handleEdit = async () => {
    editSelectedMessage();
  };

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
          username={contact?.first_name ?? ""}
          imageURl={contact?.imageURL}
        />
      )}
      <ThemedText className="pl-4">
        {isSelectionActive ? selectedMessages.size : contact?.first_name}
      </ThemedText>
      <View
        style={{ display: isSelectionActive ? "flex" : "none" }}
        className="flex-1 items-end justify-center"
      >
        <View className="flex-row">
          {selectedMessages.size === 1 && (
            <CustomIcon
              icon="pencil-outline"
              handlePress={() => {
                handleEdit();
              }}
              showIfOwner={true}
            />
          )}

          <CustomIcon
            icon="trash-outline"
            handlePress={() => {
              handleDelete();
            }}
          />

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

const CustomIcon = ({
  handlePress,
  icon,
  showIfOwner,
}: {
  handlePress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  showIfOwner?: boolean;
}) => {
  const [show, setShow] = useState(false);
  const theme = useColorScheme() ?? "dark";
  const db = useSQLiteContext();
  const { selectedMessages } = useMessageSelected();
  const { getDbPrefix, user } = useSession();

  const dbPrefix = getDbPrefix();

  if (!dbPrefix) {
    throw new Error("[TOP_NAV_BAR_CHAT] ERROR: invalid dbPrefix");
  }

  useEffect(() => {
    const isMessageOwner = async (messageId: number) => {
      let isOwner = false;
      const message = await getFirstMessage(db, dbPrefix, messageId);
      if (message) {
        isOwner = message.senderId === user?.id;
      }
      setShow(isOwner);
    };
    if (showIfOwner) {
      isMessageOwner(selectedMessages.values().next().value);
    } else {
      setShow(true);
    }
  }, [db, dbPrefix, selectedMessages, user?.id, showIfOwner]);

  return (
    <>
      {show && (
        <View className="mr-2 overflow-hidden rounded-full">
          <TouchableRipple
            onPress={async () => {
              handlePress();
            }}
            rippleColor={
              theme === "dark"
                ? "rgba(255, 255, 255, .32)"
                : "rgba(0, 0, 0, .15)"
            }
          >
            <Ionicons
              name={icon}
              color={theme === "dark" ? "white" : "black"}
              size={25}
            />
          </TouchableRipple>
        </View>
      )}
    </>
  );
};

export default TopNavBarChat;
