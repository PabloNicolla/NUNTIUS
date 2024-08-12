import { View, useColorScheme } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableRipple } from "react-native-paper";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/Colors";

const ProfileItem = ({
  title,
  description,
  leftIcon,
  rightIcon,
  size,
  showBorder,
  onlyTitle,
  handlePress,
}: {
  title: string;
  description?: string;
  leftIcon: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  size: number;
  showBorder?: boolean;
  onlyTitle?: boolean;
  handlePress: () => void;
}) => {
  const theme = useColorScheme() ?? "dark";

  return (
    <View className="h-[80] w-full">
      <TouchableRipple
        className={`z-20 flex-1`}
        onPress={() => {
          handlePress();
        }}
        rippleColor={
          theme === "dark" ? "rgba(255, 255, 255, .32)" : "rgba(0, 0, 0, .15)"
        }
      >
        <View className="flex-1 flex-row items-center px-2">
          <View className="relative px-2">
            <Ionicons color={Colors[theme].text} name={leftIcon} size={size} />
          </View>

          <View className="h-[50] flex-1 flex-col">
            <ChatDetails
              title={title}
              description={description}
              onlyTitle={onlyTitle}
            />
          </View>
          {rightIcon && (
            <View className="relative px-2">
              <Ionicons
                color={Colors[theme].text}
                name={rightIcon}
                size={size}
              />
            </View>
          )}
        </View>
      </TouchableRipple>
      {showBorder && (
        <View className="items-center">
          <View
            style={{ borderBlockColor: Colors[theme].text + "90" }}
            className="w-[75%] border-b-[1px]"
          />
        </View>
      )}
    </View>
  );
};

const ChatDetails = ({
  title,
  description,
  onlyTitle,
}: {
  title: string;
  description?: string;
  onlyTitle?: boolean;
}) => {
  return (
    <View className="h-full w-full justify-between">
      <View className="flex-1 justify-center overflow-hidden">
        <ThemedText
          className="overflow-ellipsis"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </ThemedText>
      </View>
      {!onlyTitle && (
        <View className="flex-1 justify-center overflow-hidden">
          <ThemedText
            className="overflow-ellipsis text-text-light/70 dark:text-text-dark/80"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {description}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

export default ProfileItem;
