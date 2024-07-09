import React from "react";
import { TouchableRipple, TouchableRippleProps } from "react-native-paper";
import { ThemedText, ThemedTextProps } from "../ThemedText";
import { View } from "react-native";

export type PrimaryButtonProps = {
  title: string;
  handlePress: () => void;
  isLoading?: boolean;
  style?: TouchableRippleProps["style"];
  rippleColor?: TouchableRippleProps["rippleColor"];
  className?: TouchableRippleProps["className"];
  titleClassName?: ThemedTextProps["className"];
};

const PrimaryButton = ({
  title,
  handlePress,
  isLoading,
  style,
  rippleColor,
  className,
  titleClassName,
}: PrimaryButtonProps) => {
  return (
    <View className="w-full overflow-hidden rounded-xl shadow-2xl shadow-black dark:shadow-white">
      <TouchableRipple
        onPress={handlePress}
        style={style}
        className={`min-h-[68] w-full items-center justify-center bg-primary-light ${isLoading ? "opacity-50" : ""} ${className}`}
        disabled={isLoading}
        rippleColor={rippleColor ?? "rgba(0, 0, 0, .32)"}
      >
        <ThemedText
          className={`${titleClassName ?? "text-xl font-bold text-white"}`}
        >
          {title}
        </ThemedText>
      </TouchableRipple>
    </View>
  );
};

export default PrimaryButton;
