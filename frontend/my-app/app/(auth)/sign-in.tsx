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
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "@/providers/session-provider";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import PrimaryButton from "@/components/buttons/primary-button";
import FormTextField from "@/components/form/form-text-field";
import BottomNavbar from "@/components/custom-nav-bar/bottom-nav-bar";
import { Colors } from "@/constants/Colors";
import { LOGIN_URL, LoginResponseData } from "@/API/login";

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid Email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password too short"),
});

export default function SignIpScreen() {
  const theme = useColorScheme() ?? "light";
  const { email } = useLocalSearchParams<{ email: string }>();
  const { login } = useSession();
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email ?? "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("[SignIpScreen]: SUBMITTING SIGN IN FORM", values);
      setLoginErrorMessage("");

      const response: LoginResponseData = (await axios.post(LOGIN_URL, values))
        .data;

      login(response);

      form.reset();
      router.dismissAll();
      router.replace("/");
    } catch (error) {
      setLoginErrorMessage(
        "Password, email or combination are invalid. Please try again.",
      );
      console.log("[SignIpScreen]:", error);
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
      <BottomNavbar bgColor={Colors.light.primary} styleColor="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        className=""
      >
        <SafeAreaView className="flex-1">
          <View className="flex-1">
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

            <ScrollView
              contentContainerStyle={{
                alignItems: "center",
              }}
              className=""
              keyboardShouldPersistTaps="handled"
            >
              <View className="mt-[10%] w-[80%]">
                {!!loginErrorMessage && (
                  <View className="py-4">
                    <ThemedText className="text-center text-red-500">
                      {loginErrorMessage}
                    </ThemedText>
                  </View>
                )}
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
                      titleTransformX={8}
                      title="Email"
                      value={value}
                      error={error}
                      isLoading={isLoading}
                      keyboardType="email-address"
                      onBlur={onBlur}
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
                  handlePress={form.handleSubmit((data: any) => onSubmit(data))}
                  title="Sign in"
                  isLoading={isLoading}
                />

                <View className="mb-20 mt-10 items-center">
                  <ThemedText className="mb-10 text-lg font-bold text-primary-light">
                    Forgot Password?
                  </ThemedText>
                  <Pressable
                    onPress={() => {
                      router.replace("/sign-up");
                    }}
                  >
                    <ThemedText className="text-lg font-bold text-text-light/70 dark:text-text-dark/70">
                      New to Nuntius?{" "}
                      <ThemedText className="text-lg font-bold text-primary-light">
                        Sign up now.
                      </ThemedText>
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
