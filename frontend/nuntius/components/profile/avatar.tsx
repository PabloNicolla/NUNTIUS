import { useAvatarModal } from "@/hooks/providers/avatarModal-provider";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, View } from "react-native";
import { Avatar } from "react-native-paper";

const UserAvatar = ({
  firstName,
  isSelectionActive,
  isSelected,
  imageURl,
  size,
}: {
  firstName: string;
  imageURl?: string;
  isSelectionActive?: boolean;
  isSelected?: boolean;
  size: number;
}) => {
  const [imageError, setImageError] = useState(false);
  const { showModal } = useAvatarModal();

  const getInitials = (name: string) => {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");
    return initials.slice(0, 2).toUpperCase();
  };

  return (
    <View>
      <Pressable
        onPress={() => {
          if (imageURl) showModal(imageURl ?? "");
        }}
        disabled={isSelectionActive}
      >
        {imageError || !imageURl ? (
          <Avatar.Text label={getInitials(firstName)} size={size} />
        ) : (
          <Image
            source={{ uri: imageURl }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        )}
        {isSelected && (
          <View className="absolute bottom-0 right-0 z-20 h-[20] w-[20] rounded-full bg-primary-light">
            <Ionicons
              name="checkmark"
              color={"white"}
              className="z-20"
              size={20}
            />
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default UserAvatar;
