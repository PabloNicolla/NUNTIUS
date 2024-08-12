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
  editSize,
  handleEdit,
}: {
  firstName: string;
  imageURl?: string;
  isSelectionActive?: boolean;
  isSelected?: boolean;
  size: number;
  editSize?: number;
  handleEdit?: () => void;
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
        {editSize && (
          <Pressable
            onPress={() => {
              console.log("pressed");
              if (handleEdit) {
                handleEdit();
              }
            }}
            className="absolute bottom-0 right-0 z-20 rounded-full bg-primary-light p-2"
          >
            <Ionicons
              name="camera-outline"
              color={"white"}
              className="z-20"
              size={editSize}
            />
          </Pressable>
        )}
      </Pressable>
    </View>
  );
};

export default UserAvatar;
