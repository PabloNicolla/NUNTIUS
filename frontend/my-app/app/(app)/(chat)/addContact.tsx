import { ThemedView } from "@/components/themed-view";
import TopNavBar from "@/components/custom-nav-bar/top-nav-bar";
import PrimaryButton from "@/components/buttons/primary-button";
import * as z from "zod";
import {
  View,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { StatusBar } from "expo-status-bar";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "@/providers/session-provider";
import { ThemedText } from "@/components/themed-text";
import FormTextField from "@/components/form/form-text-field";
import {
  GET_CONTACT_URL,
  GetContactRequestData,
  GetContactResponseData,
} from "@/API/get-contact";
import { insertContact } from "@/db/statements";
import { useSQLiteContext } from "expo-sqlite";
import { router } from "expo-router";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

type Props = {};

const AddContact = (props: Props) => {
  const theme = useColorScheme() ?? "light";
  const { getAccessToken } = useSession();
  const db = useSQLiteContext();
  const [getContactErrorMessage, setGetContactErrorMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("[ADD_CONTACT]: SUBMITTING ADD CONTACT FORM", values);
      setGetContactErrorMessage("");

      const requestData: GetContactRequestData = {
        username: values.username,
      };

      const response: GetContactResponseData = (
        await axios.post(GET_CONTACT_URL, requestData)
      ).data;

      console.log(response);

      await insertContact(db, response);

      form.reset();
      if (router.canGoBack()) {
        router.back();
      }
    } catch (error) {
      setGetContactErrorMessage("No user found with this username.");
      console.log("[SIGN_IN_SCREEN]:", error);
    }
  };

  return (
    <ThemedView className="flex-1">
      <StatusBar style="auto" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        className=""
      >
        <SafeAreaView className="flex-1">
          <TopNavBar title="Add Contact" />
          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
            }}
            className="flex-1"
            keyboardShouldPersistTaps="handled"
          >
            <View className="mt-[10%] w-[80%]">
              {!!getContactErrorMessage && (
                <View className="py-4">
                  <ThemedText className="text-center text-red-500">
                    {getContactErrorMessage}
                  </ThemedText>
                </View>
              )}
              <Controller
                control={form.control}
                name="username"
                disabled={isLoading}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState: { error },
                }) => (
                  <FormTextField
                    className="mb-5"
                    handleTextChange={onChange}
                    titleTransformX={16}
                    title="Username"
                    value={value}
                    error={error}
                    isLoading={isLoading}
                    keyboardType="default"
                    onBlur={onBlur}
                  />
                )}
              />

              <PrimaryButton
                handlePress={form.handleSubmit((data: any) => onSubmit(data))}
                title="Add contact"
                isLoading={isLoading}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default AddContact;
