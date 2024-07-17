import { Image, Pressable, useColorScheme, View } from "react-native";
import React, { useState } from "react";
import { Avatar, TouchableRipple } from "react-native-paper";
import { ThemedText } from "../themed-text";
import { useAvatarModal } from "@/providers/avatarModal-provider";
import { router } from "expo-router";

export type ContactListItemProps = {
  id: number;
  username: string;
  name: string;
  imageURL?: string;
};

const ContactListItem = React.memo(function ContactListItem({
  id,
  username,
  name,
  imageURL,
}: ContactListItemProps) {
  const theme = useColorScheme() ?? "light";

  console.log("++++++++++++++++++++++", id);

  return (
    <View className="h-[80] w-full">
      <TouchableRipple
        className={`z-20 flex-1`}
        onPress={() => {
          console.log("Pressed");
          router.push({ pathname: `/chat/[id]`, params: { id: id } });
          return true;
        }}
        rippleColor={
          theme === "dark" ? "rgba(255, 255, 255, .32)" : "rgba(0, 0, 0, .15)"
        }
      >
        <View className="flex-1 flex-row items-center gap-x-2 px-2">
          <View className="relative">
            <CustomAvatar username={username} imageURl={imageURL} />
          </View>

          <View className="h-[50] flex-1 flex-col">
            <ChatDetails chatName={name} />
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
});

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
          <Avatar.Text label={getInitials(username)} size={50} />
        ) : (
          <Image
            source={{ uri: imageURl }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        )}
      </Pressable>
    </View>
  );
};

const ChatDetails = ({ chatName }: { chatName: string }) => {
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
    </View>
  );
};

export default ContactListItem;
