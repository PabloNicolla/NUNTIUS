import { useEffect } from "react";
import { StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/providers/session-provider";

export default function HomeScreen() {
  const { login, isLoggedIn } = useSession();

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Pressable
        onPress={() => {
          console.log(isLoggedIn, "before");
          login();
          console.log(isLoggedIn, "after");
          router.replace("/");
        }}
      >
        <ThemedText>Click me</ThemedText>
      </Pressable>
    </SafeAreaView>
  );
}
