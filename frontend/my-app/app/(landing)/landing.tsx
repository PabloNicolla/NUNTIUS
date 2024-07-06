import {
  Image,
  StyleSheet,
  Platform,
  Text,
  ImageBackground,
  Pressable,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, router } from "expo-router";
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

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
