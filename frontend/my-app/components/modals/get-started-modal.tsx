import {
  Modal,
  Pressable,
  View,
  TextInput,
  useWindowDimensions,
  useColorScheme,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { ThemedText } from "@/components/themed-text";
import PrimaryButton from "@/components/buttons/primary-button";
import { ThemedView } from "@/components/themed-view";
import FormTextField from "@/components/form/form-text-field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CHECK_EMAIL_URL,
  CheckEmailRequestData,
  CheckEmailResponseData,
} from "@/API/check-email";

type GetStartedModalProps = {
  isVisible: boolean;
  onClose: () => void;
};
const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid Email format"),
});

export default function GetStartedModal({
  isVisible,
  onClose,
}: GetStartedModalProps) {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const theme = useColorScheme() ?? "light";

  const EmailInputRef = useRef<TextInput | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("[GetStartedModal]: SUBMITTING GET STARTED FORM", values);
      form.reset();

      const requestData: CheckEmailRequestData = {
        email: values.email,
      };

      const response: CheckEmailResponseData = (
        await axios.post(CHECK_EMAIL_URL, requestData)
      ).data;

      let pathname = "/sign-up";
      if (response.code === "IN_USE") {
        pathname = "/sign-in";
      } else if (response.code !== "AVAILABLE") {
        console.log(
          "[GetStartedModal]: ERROR: response.code not matching any correct value",
        );
      }

      onClose();
      router.push({
        pathname: pathname,
        params: { email: values.email },
      });
    } catch (error) {
      console.log("[GetStartedModal]:", error);
    }
  };

  useEffect(() => {
    if (isVisible && EmailInputRef.current) {
      const timer = setTimeout(() => {
        EmailInputRef.current?.focus();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <ThemedView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          className=""
        >
          <SafeAreaView className="flex-1">
            <View className="relative flex-1">
              <CloseModalX
                windowHeight={windowHeight}
                windowWidth={windowWidth}
                onClose={onClose}
                color={theme === "light" ? "black" : "white"}
              />

              <ScrollView
                contentContainerStyle={{
                  alignItems: "center",
                }}
                className=""
                keyboardShouldPersistTaps="handled"
              >
                <View className="mt-[30%] w-[80%]">
                  <ThemedText className="mb-5 text-3xl font-bold">
                    Lets Get Started!
                  </ThemedText>
                  <ThemedText className="mb-10 text-lg text-text-light/70 dark:text-text-dark/70">
                    Enter your email to create or sign in to your account
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
                        onBlur={onBlur}
                      />
                    )}
                  />

                  <PrimaryButton
                    className="mb-20"
                    handlePress={form.handleSubmit((data: any) =>
                      onSubmit(data),
                    )}
                    title="GET STARTED"
                  />
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </ThemedView>
    </Modal>
  );
}

const CloseModalX = ({
  windowHeight,
  windowWidth,
  onClose,
  color,
}: {
  windowHeight: number;
  windowWidth: number;
  onClose: () => void;
  color: string;
}) => {
  return (
    <View
      className="absolute"
      style={{ right: windowWidth * 0.1, top: windowHeight * 0.05 }}
    >
      <Pressable onPress={() => onClose()}>
        <MaterialIcons name="close" size={25} color={color} />
      </Pressable>
    </View>
  );
};
