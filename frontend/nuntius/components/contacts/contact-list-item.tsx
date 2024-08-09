import { useColorScheme, View } from "react-native";
import React from "react";
import { TouchableRipple } from "react-native-paper";
import { ThemedText } from "../themed-text";
import { router } from "expo-router";
import { Contact } from "@/lib/db/schemaTypes";
import UserAvatar from "../profile/avatar";

export type ContactListItemProps = Contact;

const ContactListItem = React.memo(function ContactListItem({
  id,
  username,
  first_name,
  last_name,
  imageURL,
}: ContactListItemProps) {
  const theme = useColorScheme() ?? "dark";

  console.log("[CONTACT_LIST_ITEM]: MOUNTING: %d", id);

  return (
    <View className="h-[80] w-full">
      <TouchableRipple
        className={`z-20 flex-1`}
        onPress={() => {
          console.log("Pressed");
          router.push({
            pathname: `/chat/[id]`,
            params: { id: id, contactId: id, canCreateChatIfNull: "yes" },
          });
          return true;
        }}
        rippleColor={
          theme === "dark" ? "rgba(255, 255, 255, .32)" : "rgba(0, 0, 0, .15)"
        }
      >
        <View className="flex-1 flex-row items-center gap-x-2 px-2">
          <View className="relative">
            <UserAvatar firstName={first_name} size={50} imageURl={imageURL} />
          </View>

          <View className="h-[50] flex-1 flex-col">
            <ChatDetails username={username} firstName={first_name} />
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
});

const ChatDetails = ({
  username,
  firstName,
}: {
  username: string;
  firstName: string;
}) => {
  return (
    <View className="h-full w-full justify-between">
      <View className="flex-1 justify-center overflow-hidden">
        <ThemedText
          className="overflow-ellipsis"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {firstName}
        </ThemedText>
      </View>
      <View className="flex-1 justify-center overflow-hidden">
        <ThemedText
          className="overflow-ellipsis text-text-light/50 dark:text-text-dark/70"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          @{username}
        </ThemedText>
      </View>
    </View>
  );
};

export default ContactListItem;
