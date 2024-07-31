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
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "@/providers/session-provider";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import PrimaryButton from "@/components/buttons/primary-button";
import FormTextField from "@/components/form/form-text-field";
import BottomNavbar from "@/components/custom-nav-bar/bottom-nav-bar";
import { Colors } from "@/constants/Colors";
import {
  CHANGE_NAME_URL,
  ChangeNameRequestData,
  ChangeNameResponseData,
} from "@/API/change-name";

const formSchema = z.object({
  first_name: z.string().min(1, "first_name is required"),
  last_name: z.string(),
});

export default function ChangeNameScreen() {
  const theme = useColorScheme() ?? "dark";
  const { email } = useLocalSearchParams<{ email: string }>();
  const { changeName, getAccessToken } = useSession();
  const [changeNameErrorMessage, setChangeNameErrorMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("[CHANGE_NAME_SCREEN]: SUBMITTING CHANGE NAME FORM", values);
      setChangeNameErrorMessage("");

      const accessToken = await getAccessToken();

      console.log(accessToken);

      const requestData: ChangeNameRequestData = {
        first_name: values.first_name,
        last_name: values.last_name,
      };

      console.log(requestData);

      const response: ChangeNameResponseData = (
        await axios.patch(CHANGE_NAME_URL, requestData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data;

      changeName(response);

      form.reset();
      if (router.canGoBack()) {
        router.dismissAll();
      }
      router.replace("/");
    } catch (error) {
      setChangeNameErrorMessage("Something went wrong. Sorry.");
      console.log("[CHANGE_NAME_SCREEN]:", error);
    }
  };

  const usernameInputRef = useRef<TextInput | null>(null);
  const emailInputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (email && usernameInputRef.current) {
      const timer = setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 400);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        emailInputRef.current?.focus();
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
            <View className="w-full flex-row items-center justify-between px-2">
              <View className="flex-row items-center">
                {router.canGoBack() && (
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
                )}

                <Image
                  source={require("@/assets/images/brand/Logo.png")}
                  className="ml-4 h-[60] w-[60]"
                />
              </View>
            </View>

            <ScrollView
              contentContainerStyle={{
                alignItems: "center",
              }}
              className=""
              keyboardShouldPersistTaps="handled"
            >
              <View className="w-[80%] pt-[10%]">
                <ThemedText className="mb-5 text-3xl font-bold">
                  Let choose a display name
                </ThemedText>
                <ThemedText className="mb-10 text-lg text-text-light/70 dark:text-text-dark/70">
                  You can change your display name later
                </ThemedText>

                {!!changeNameErrorMessage && (
                  <View className="py-4">
                    <ThemedText className="text-center text-red-500">
                      {changeNameErrorMessage}
                    </ThemedText>
                  </View>
                )}

                <Controller
                  control={form.control}
                  name="first_name"
                  disabled={isLoading}
                  render={({
                    field: { value, onChange, onBlur },
                    fieldState: { error },
                  }) => (
                    <FormTextField
                      ref={usernameInputRef}
                      className="mb-5"
                      handleTextChange={onChange}
                      titleTransformX={19}
                      title="First Name*"
                      value={value}
                      error={error}
                      isLoading={isLoading}
                    />
                  )}
                />

                <Controller
                  control={form.control}
                  name="last_name"
                  disabled={isLoading}
                  render={({
                    field: { value, onChange, onBlur },
                    fieldState: { error },
                  }) => (
                    <FormTextField
                      ref={usernameInputRef}
                      className="mb-5"
                      handleTextChange={onChange}
                      titleTransformX={18}
                      title="Last Name"
                      value={value}
                      error={error}
                      isLoading={isLoading}
                    />
                  )}
                />

                <PrimaryButton
                  className="mb-20"
                  handlePress={form.handleSubmit((data: any) => onSubmit(data))}
                  title="Update Name"
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
