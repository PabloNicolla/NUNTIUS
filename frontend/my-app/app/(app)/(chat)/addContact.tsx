import { View, Text, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavBar from "@/components/TopNavBar";

type Props = {};

const AddContact = (props: Props) => {
  const db = useSQLiteContext();
  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <TopNavBar title="New Contact" />
        <View className=""></View>
      </SafeAreaView>
    </ThemedView>
  );
};

export default AddContact;
