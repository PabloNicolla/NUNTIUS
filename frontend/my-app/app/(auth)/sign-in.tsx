import {
  Pressable,
  View,
  TextInput,
  Image,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";

import { useSession } from "@/providers/session-provider";

import { ThemedView } from "@/components/ThemedView";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const { login, isLoggedIn } = useSession();
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="relative flex-1 items-center justify-start">
          <View className="w-full flex-row items-center px-2">
            <Pressable
              onPress={() => {
                router.back();
              }}
            >
              <MaterialIcons
                name="arrow-back"
                size={30}
                color={theme === "light" ? "black" : "white"}
              />
            </Pressable>
            <Image
              source={require("@/assets/images/brand/Logo.png")}
              className="ml-4 h-[60] w-[60]"
            />
          </View>

          <View className="mt-[10%] w-[80%]">
            <View className="relative mb-5 h-[60] w-full rounded-xl border-2 border-black dark:border-white">
              <View className="ml-2 flex-1 justify-center">
                <ThemedText className="absolute left-0 top-0 text-xs text-text-light/50 dark:text-text-dark/70">
                  Email
                </ThemedText>
                <TextInput
                  className="text-lg text-text-light dark:text-text-dark"
                  autoFocus={true}
                  keyboardType="email-address"
                ></TextInput>
              </View>
            </View>

            <View className="relative mb-5 h-[60] w-full rounded-xl border-2 border-black dark:border-white">
              <View className="ml-2 flex-1 justify-center">
                <ThemedText className="absolute left-0 top-0 text-xs text-text-light/50 dark:text-text-dark/70">
                  Password
                </ThemedText>
                <TextInput
                  className="text-lg text-text-light dark:text-text-dark"
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

                router.dismissAll();
                router.replace("/");
              }}
              title="Sign in"
            />

            <View className="mt-10 items-center">
              <ThemedText className="mb-10 text-lg font-bold text-text-light/70 dark:text-text-dark/70">
                Forgot Password?
              </ThemedText>
              <Pressable
                onPress={() => {
                  router.replace("/sign-up");
                }}
              >
                <ThemedText className="text-lg font-bold text-text-light/70 dark:text-text-dark/70">
                  New to [THIS APP]? Sign up now.
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
