import { Modal, Pressable, View, TextInput, BackHandler } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { ThemedText } from "@/components/ThemedText";

import { useSession } from "@/providers/session-provider";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";

export default function HomeScreen({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const backAction = () => {
      console.log("asdsad");

      if (isVisible) {
        onClose();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [isVisible, onClose]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background-light">
        <StatusBar style="light" backgroundColor="black" />
        <View className="absolute right-[10%] top-[5%]">
          <Pressable onPress={() => onClose()}>
            <MaterialIcons name="close" size={25} />
          </Pressable>
        </View>
        <SafeAreaView className="mt-[30%] flex-1 items-center justify-start">
          <View className="w-[80%]">
            <ThemedText className="mb-5 text-3xl font-bold text-text-light">
              Lets Get Started!
            </ThemedText>
            <ThemedText className="mb-10 text-lg text-text-light/70">
              Enter your email to create or sign in to your account
            </ThemedText>

            <View className="relative mb-5 h-[60] w-full rounded-xl border-2 border-black">
              <View className="ml-2 flex-1 justify-center">
                <ThemedText className="absolute left-0 top-0 text-xs text-text-light/50">
                  Email
                </ThemedText>
                <TextInput
                  className="text-lg"
                  autoFocus={true}
                  keyboardType="email-address"
                ></TextInput>
              </View>
            </View>

            <PrimaryButton
              onPress={() => {
                router.push("/sign-up");
              }}
              title="GET STARTED"
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
