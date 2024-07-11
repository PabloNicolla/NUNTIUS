import {
  Pressable,
  View,
  TextInput,
  Image,
  useColorScheme,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { useSession } from "@/providers/session-provider";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import FormTextField from "@/components/form/FormTextField";

export default function SignUpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();

  const { login, isLoggedIn } = useSession();

  const theme = useColorScheme() ?? "light";

  const [emailValue, setEmailValue] = useState(email);
  const [passwordValue, setPasswordValue] = useState("");

  const PasswordInputRef = useRef<TextInput | null>(null);
  const EmailInputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (email && PasswordInputRef.current) {
      const timer = setTimeout(() => {
        PasswordInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        EmailInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <ThemedView className="flex-1">
      <StatusBar style="auto" />

      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-start">
          <View className="w-full flex-row items-center justify-between px-2">
            <View className="flex-row items-center">
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
            <View className="items-center">
              <Pressable
                onPress={() => {
                  router.replace("/sign-in");
                }}
              >
                <ThemedText className="text-lg font-bold">Log in</ThemedText>
              </Pressable>
            </View>
          </View>

          <View className="mt-[10%] w-[80%]">
            <ThemedText className="mb-5 text-3xl font-bold">
              Lets Get Started!
            </ThemedText>
            <ThemedText className="mb-10 text-lg text-text-light/70 dark:text-text-dark/70">
              Create your account
            </ThemedText>

            <FormTextField
              ref={EmailInputRef}
              className="mb-5"
              title="Email"
              value={emailValue}
              handleTextChange={(text) => {
                setEmailValue(text);
              }}
            />

            <FormTextField
              ref={PasswordInputRef}
              className="mb-5"
              title="Password"
              value={passwordValue}
              handleTextChange={(text) => {
                setPasswordValue(text);
              }}
              isSecureText={true}
            />

            <PrimaryButton
              handlePress={() => {
                console.log(isLoggedIn, "before");
                login();
                console.log(isLoggedIn, "after");

                router.dismissAll();
                router.replace("/");
              }}
              title="CREATE ACCOUNT"
            />
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
