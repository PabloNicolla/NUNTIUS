import { View, Text, Pressable, Animated } from "react-native";
import React, { useRef, useState } from "react";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavBar from "@/components/TopNavBar";
import SimpleFormTextField from "@/components/form/SimpleFormTextField";

type Props = {};

const AddContact = (props: Props) => {
  const db = useSQLiteContext();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <TopNavBar title="New Contact" />
        <View className="flex-1 items-center">
          <View className="flex w-full max-w-[80%] gap-y-8 pt-4">
            <SimpleFormTextField
              className=""
              title="Name"
              value={name}
              handleTextChange={(text) => {
                setName(text);
              }}
              titleTransformX={5}
            />
            <SimpleFormTextField
              className=""
              title="Phone Number"
              value={phoneNumber}
              handleTextChange={(text) => {
                setPhoneNumber(text);
              }}
              titleTransformX={16}
            />
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
};

export default AddContact;
