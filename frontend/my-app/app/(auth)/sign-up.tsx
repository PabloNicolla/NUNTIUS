import {
  Pressable,
  View,
  TextInput,
  Image,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "@/providers/session-provider";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import PrimaryButton from "@/components/buttons/primary-button";
import FormTextField from "@/components/form/form-text-field";

const formSchema = z.object({
  email: z.string().email("Invalid Email format").min(1, "Email is required"),
  password: z.string().min(8, "Password too short"),
});

export default function SignUpScreen() {
  const theme = useColorScheme() ?? "light";

  const { email } = useLocalSearchParams<{ email: string }>();

  const { login } = useSession();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email ?? "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: any) => {
    try {
      console.log("SUBMITTING SIGN UP FORM", values);
      form.reset();
      login();
      router.dismissAll();
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  const PasswordInputRef = useRef<TextInput | null>(null);
  const EmailInputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (email && PasswordInputRef.current) {
      const timer = setTimeout(() => {
        PasswordInputRef.current?.focus();
      }, 400);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        EmailInputRef.current?.focus();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <ThemedView className="flex-1">
      <StatusBar style="auto" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        className=""
      >
        <SafeAreaView className="flex-1">
          <View className="flex-1">
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

            <ScrollView
              contentContainerStyle={{
                alignItems: "center",
              }}
              className=""
            >
              <View className="w-[80%] pt-[10%]">
                <ThemedText className="mb-5 text-3xl font-bold">
                  Lets Get Started!
                </ThemedText>
                <ThemedText className="mb-10 text-lg text-text-light/70 dark:text-text-dark/70">
                  Create your account
                </ThemedText>

                <Controller
                  control={form.control}
                  name="email"
                  disabled={isLoading}
                  render={({
                    field: { value, onChange, onBlur },
                    fieldState: { error },
                  }) => (
                    <FormTextField
                      ref={EmailInputRef}
                      className="mb-5"
                      handleTextChange={onChange}
                      title="Email"
                      value={value}
                      error={error}
                      isLoading={isLoading}
                      keyboardType="email-address"
                    />
                  )}
                />

                <Controller
                  control={form.control}
                  name="password"
                  disabled={isLoading}
                  render={({
                    field: { value, onChange, onBlur },
                    fieldState: { error },
                  }) => (
                    <FormTextField
                      ref={PasswordInputRef}
                      className="mb-5"
                      handleTextChange={onChange}
                      title="Password"
                      value={value}
                      isSecureText={true}
                      titleTransformX={16}
                      onBlur={onBlur}
                      error={error}
                      isLoading={isLoading}
                      keyboardType="default"
                    />
                  )}
                />

                <PrimaryButton
                  className="mb-20"
                  handlePress={form.handleSubmit((data: any) => onSubmit(data))}
                  title="CREATE ACCOUNT"
                  isLoading={isLoading}
                />
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
