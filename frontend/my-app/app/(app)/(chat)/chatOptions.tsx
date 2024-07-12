import React from "react";
import ChatOption from "@/components/chat/ChatOption";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavBar from "@/components/TopNavBar";
import { View } from "react-native";

type Props = {};

const chatOptions = (props: Props) => {
  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <TopNavBar title="Chat Options" />
        <View className="border-b-[1px] border-gray-500/50">
          <ChatOption icon="person-add" title="New Contact" />
          <ChatOption icon="people" title="New Group" />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
};

export default chatOptions;