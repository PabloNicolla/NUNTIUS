import { View, Text, ScrollView } from "react-native";
import React from "react";
import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

const MyProfileScreen = (props: Props) => {
  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1"></ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
};

export default MyProfileScreen;
