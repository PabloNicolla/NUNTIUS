import { StyleSheet, Pressable } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Pressable
        onPress={() => {
          router.replace("/");
        }}
      >
        <ThemedText>Click me</ThemedText>
      </Pressable>
    </SafeAreaView>
  );
}
