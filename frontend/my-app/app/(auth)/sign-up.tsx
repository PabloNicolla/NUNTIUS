import { useEffect } from "react";
import { StyleSheet, Pressable, Text, View, TextInput } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";

import { ThemedText } from "@/components/ThemedText";

import { useSession } from "@/providers/session-provider";

import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import PrimaryButton from "@/components/buttons/PrimaryButton";

export default function HomeScreen() {
  const { login, isLoggedIn } = useSession();

  // NavigationBar.setBackgroundColorAsync(Colors.light.primary);
  // NavigationBar.setButtonStyleAsync("light");

  const isPresented = router.canGoBack();

  return (
    <View className="flex-1 bg-background-light">
      <StatusBar style="light" backgroundColor="black" />

      <SafeAreaView className="mt-[120] flex-1 justify-start">
        <View className="mx-10">
          <ThemedText className="mb-5 text-3xl font-bold text-text-light">
            Lets Get Started!
          </ThemedText>
          <ThemedText className="mb-10 text-lg text-text-light/70">
            Create your account
          </ThemedText>

          <View className="relative mb-5 h-[60] w-[280] rounded-xl border-2 border-black">
            <View className="ml-2 flex-1 justify-center">
              <ThemedText className="absolute left-0 top-0 text-xs text-text-light/50">
                Email
              </ThemedText>
              <TextInput
                className="text-lg"
                keyboardType="email-address"
              ></TextInput>
            </View>
          </View>
          <View className="relative mb-5 h-[60] w-[280] rounded-xl border-2 border-black">
            <View className="ml-2 flex-1 justify-center">
              <ThemedText className="absolute left-0 top-0 text-xs text-text-light/50">
                Password
              </ThemedText>
              <TextInput
                className="text-lg"
                keyboardType="default"
                placeholder="Password"
              ></TextInput>
            </View>
          </View>

          <PrimaryButton
            onPress={() => {
              console.log(isLoggedIn, "before");
              login();
              console.log(isLoggedIn, "after");
              router.replace("/");
            }}
            title="CREATE ACCOUNT"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
