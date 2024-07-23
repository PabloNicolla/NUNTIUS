import { Image, Pressable, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "../themed-view";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "../themed-text";
import { Avatar } from "react-native-paper";
import { useAvatarModal } from "@/providers/avatarModal-provider";
import { useSQLiteContext } from "expo-sqlite";
import { Contact } from "@/db/schemaTypes";
import { getFirstContact } from "@/db/statements";

type Props = {
  contactId?: number;
};

const TopNavBarChat = ({ contactId }: Props) => {
  const theme = useColorScheme() ?? "light";
  const [contact, setContact] = useState<Contact | null>(null);
  const db = useSQLiteContext();

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
          router.back();
        }}
      >
        <MaterialIcons
          name="arrow-back"
          size={30}
          color={theme === "light" ? "black" : "white"}
        />
      </Pressable>
      <CustomAvatar
        username={contact?.name ?? ""}
        imageURl={contact?.imageURL}
      />
      <ThemedText className="pl-4">{contact?.name}</ThemedText>
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
