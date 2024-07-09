import { Modal, Pressable, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AvatarModal({
  isVisible,
  onClose,
}: Readonly<{
  isVisible: boolean;
  onClose: () => void;
}>) {
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
                source={{ uri: "https://cataas.com/cat" }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </Pressable>
          </View>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
}
