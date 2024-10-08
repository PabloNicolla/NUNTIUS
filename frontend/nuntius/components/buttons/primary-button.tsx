import React from "react";
import { TouchableRipple, TouchableRippleProps } from "react-native-paper";
import { ThemedText, ThemedTextProps } from "../themed-text";
import { View } from "react-native";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";

export type PrimaryButtonProps = {
  title: string;
  handlePress: () => void;
  isLoading?: boolean;
  style?: ViewProps["style"];
  rippleColor?: TouchableRippleProps["rippleColor"];
  className?: ViewProps["className"];
  titleClassName?: ThemedTextProps["className"];
  minHeight?: number;
};

const PrimaryButton = ({
  title,
  handlePress,
  isLoading,
  style,
  rippleColor,
  titleClassName,
  minHeight,
  className, // IGNORE
}: PrimaryButtonProps) => {
  return (
    <View
      style={[{ minHeight: minHeight ?? 68 }, style]}
      className={`w-full overflow-hidden rounded-xl`}
    >
      <TouchableRipple
        onPress={handlePress}
        className={`flex-1 items-center justify-center bg-primary-light ${isLoading ? "opacity-50" : ""}`}
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
