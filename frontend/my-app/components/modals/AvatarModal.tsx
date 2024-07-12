import React from "react";
import { Modal, Pressable, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AvatarModal = ({
  isVisible,
  onClose,
  imageURL,
}: Readonly<{
  isVisible: boolean;
  onClose: () => void;
  imageURL?: string;
}>) => {
  console.log("AvatarModal");

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-[#00000050]"
        onPress={() => {
          onClose();
        }}
      >
        <SafeAreaView className="flex-1 items-center justify-center">
          <View className="h-[40%] w-[80%]">
            <Pressable className="h-full w-full">
              <Image
                source={{ uri: imageURL }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </Pressable>
          </View>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
};
export default AvatarModal;
