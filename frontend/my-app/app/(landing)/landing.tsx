import { ImageBackground, Pressable } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <ThemedView className="flex-1">
      <ImageBackground
        source={require("@/assets/images/landing/background.jpg")}
        className="flex-1"
        resizeMode="cover"
      >
        <ThemedView className="flex-1 bg-[#00000050]">
          <SafeAreaView className="mb-10 flex-1 items-center justify-end">
            <ThemedText className="text-6xl font-bold text-white">
              Hello!
            </ThemedText>
            <ThemedText className="mb-10 text-xl text-white">
              Let's improve your life style
            </ThemedText>
            <Pressable
              className="bg-primary-light h-[68] w-[250] items-center justify-center rounded-xl shadow-2xl shadow-white"
              onPress={() => {
                router.replace("/sign-up");
              }}
            >
              <ThemedText className="text-xl font-bold text-white">
                GET STARTED
              </ThemedText>
            </Pressable>
          </SafeAreaView>
        </ThemedView>
      </ImageBackground>
    </ThemedView>
  );
}
