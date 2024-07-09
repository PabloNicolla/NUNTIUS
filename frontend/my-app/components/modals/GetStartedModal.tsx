import {
  Modal,
  Pressable,
  View,
  TextInput,
  useWindowDimensions,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { ThemedView } from "@/components/ThemedView";

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

export default function GetStartedModal({
  isVisible,
  onClose,
  email,
  setEmail,
}: Readonly<{
  isVisible: boolean;
  onClose: () => void;
  email: string;
  setEmail: (email: string) => void;
}>) {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const theme = useColorScheme() ?? "light";

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

              <View className="relative mb-5 h-[60] w-full rounded-xl border-2 border-black dark:border-white">
                <View className="mx-2 flex-1 justify-center">
                  <ThemedText className="absolute left-0 top-0 text-xs text-text-light/50 dark:text-text-dark/70">
                    Email
                  </ThemedText>
                  <TextInput
                    ref={EmailInputRef}
                    className="text-lg text-text-light dark:text-text-dark"
                    // autoFocus={true}
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  ></TextInput>
                </View>
              </View>

              <PrimaryButton
                handlePress={() => {
                  // Check if email is valid
                  // Call db and check if email exits
                  let pathname = "/sign-up";
                  const emailSearch = "test@test.com";

                  if (!emailSearch) {
                    pathname = "/sign-in";
                  }

                  onClose();
                  router.push({
                    pathname: pathname,
                    params: { email: email },
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
