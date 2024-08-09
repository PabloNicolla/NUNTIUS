import { View, ScrollView, useColorScheme } from "react-native";
import React from "react";
import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";
import UserAvatar from "@/components/profile/avatar";
import { Ionicons } from "@expo/vector-icons";
import { TouchableRipple } from "react-native-paper";
import { ThemedText } from "@/components/themed-text";
import { useSession } from "@/hooks/providers/session-provider";
import { Colors } from "@/constants/Colors";

type Props = {};

const MyProfileScreen = (props: Props) => {
  const { user, logout } = useSession();

  if (!user) {
    throw new Error("Cannot load profile screen without a logged user");
  }

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          <View className="mb-10 mt-5 items-center justify-center">
            <UserAvatar
              firstName={user.first_name}
              imageURl={user.imageURL}
              size={150}
            />
          </View>

          <View>
            <ProfileItem
              size={30}
              icon="person"
              title={`Username: ${user.username}`}
              showBorder
              handlePress={() => {}}
            />
            <ProfileItem
              size={30}
              icon="information-circle"
              title={`First name: ${user.first_name}`}
              description={`Last name: ${user.last_name}`}
              showBorder
              handlePress={() => {}}
            />
            <ProfileItem
              size={30}
              icon="image"
              title={`Change profile image`}
              onlyTitle
              handlePress={() => {}}
            />
            <ProfileItem
              size={30}
              icon="log-out"
              title={`Logout`}
              onlyTitle
              handlePress={async () => {
                await logout();
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
};

const ProfileItem = ({
  title,
  description,
  icon,
  size,
  showBorder,
  onlyTitle,
  handlePress,
}: {
  title: string;
  description?: string;
  icon: keyof typeof Ionicons.glyphMap;
  size: number;
  showBorder?: boolean;
  onlyTitle?: boolean;
  handlePress: () => void;
}) => {
  const theme = useColorScheme() ?? "dark";

  return (
    <View className="h-[80] w-full">
      <TouchableRipple
        className={`z-20 flex-1`}
        onPress={() => {
          handlePress();
        }}
        rippleColor={
          theme === "dark" ? "rgba(255, 255, 255, .32)" : "rgba(0, 0, 0, .15)"
        }
      >
        <View className="flex-1 flex-row items-center px-2">
          <View className="relative px-2">
            <Ionicons color={Colors[theme].text} name={icon} size={size} />
          </View>

          <View className="h-[50] flex-1 flex-col">
            <ChatDetails
              title={title}
              description={description}
              onlyTitle={onlyTitle}
            />
          </View>

          <View className="relative px-2">
            <Ionicons
              color={Colors[theme].text}
              name={"open-outline"}
              size={size}
            />
          </View>
        </View>
      </TouchableRipple>
      {showBorder && (
        <View className="items-center">
          <View
            style={{ borderBlockColor: Colors[theme].text + "90" }}
            className="w-[75%] border-b-[1px]"
          />
        </View>
      )}
    </View>
  );
};

const ChatDetails = ({
  title,
  description,
  onlyTitle,
}: {
  title: string;
  description?: string;
  onlyTitle?: boolean;
}) => {
  return (
    <View className="h-full w-full justify-between">
      <View className="flex-1 justify-center overflow-hidden">
        <ThemedText
          className="overflow-ellipsis"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </ThemedText>
      </View>
      {!onlyTitle && (
        <View className="flex-1 justify-center overflow-hidden">
          <ThemedText
            className="overflow-ellipsis text-text-light/70 dark:text-text-dark/80"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {description}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

export default MyProfileScreen;
