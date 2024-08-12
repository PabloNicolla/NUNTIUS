import { View, ScrollView } from "react-native";
import React from "react";
import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";
import UserAvatar from "@/components/profile/avatar";
import { useSession } from "@/hooks/providers/session-provider";
import ProfileItem from "@/components/profile/profile-item";

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
              editSize={30}
            />
          </View>

          <View>
            <ProfileItem
              size={30}
              leftIcon="person"
              title={`Username: ${user.username}`}
              showBorder
              handlePress={() => {}}
            />
            <ProfileItem
              size={30}
              leftIcon="information-circle"
              title={`First name: ${user.first_name}`}
              description={`Last name: ${user.last_name}`}
              handlePress={() => {}}
              rightIcon="pencil-outline"
            />
            <ProfileItem
              size={30}
              leftIcon="image"
              title={`Change profile image`}
              onlyTitle
              handlePress={() => {}}
              rightIcon="pencil-outline"
            />
            <ProfileItem
              size={30}
              leftIcon="log-out"
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

export default MyProfileScreen;
