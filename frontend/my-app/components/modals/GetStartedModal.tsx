import {
  Modal,
  Pressable,
  View,
  TextInput,
  useWindowDimensions,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { ThemedView } from "@/components/ThemedView";
import FormTextField from "../form/FormTextField";

export default function GetStartedModal({
  isVisible,
  onClose,
}: Readonly<{
  isVisible: boolean;
  onClose: () => void;
}>) {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const theme = useColorScheme() ?? "light";

  const [emailValue, setEmailValue] = useState("");

  const EmailInputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (isVisible && EmailInputRef.current) {
      const timer = setTimeout(() => {
        EmailInputRef.current?.focus();
      }, 100);
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
        <SafeAreaView className="flex-1">
          <View className="relative flex-1 items-center justify-start">
            <CloseModalX
              windowHeight={windowHeight}
              windowWidth={windowWidth}
              onClose={onClose}
              color={theme === "light" ? "black" : "white"}
            />

            <View className="mt-[30%] w-[80%]">
              <ThemedText className="mb-5 text-3xl font-bold">
                Lets Get Started!
              </ThemedText>
              <ThemedText className="mb-10 text-lg text-text-light/70 dark:text-text-dark/70">
                Enter your email to create or sign in to your account
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

              <PrimaryButton
                handlePress={() => {
                  // Check if email is valid
                  // Call db and check if email exits
                  let pathname = "/sign-up";

                  if (emailValue) {
                    pathname = "/sign-in";
                  }

                  onClose();
                  router.push({
                    pathname: pathname,
                    params: { email: emailValue },
                  });
                }}
                title="GET STARTED"
              />
            </View>
          </View>
        </SafeAreaView>
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
