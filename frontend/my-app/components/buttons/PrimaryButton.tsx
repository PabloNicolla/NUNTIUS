import { Pressable } from "react-native";
import { ThemedText } from "../ThemedText";

import React from "react";
import { TouchableRipple } from "react-native-paper";

interface Props {
  onPress: () => void;
  title: string;
}

const PrimaryButton = ({ onPress, title }: Props) => {
  return (
    <TouchableRipple
      className="h-[68] w-full items-center justify-center rounded-xl bg-primary-light shadow-2xl shadow-black dark:shadow-white"
      onPress={() => {
        onPress();
      }}
      rippleColor="rgba(0, 0, 0, .32)"
    >
      <ThemedText className="text-xl font-bold text-white">{title}</ThemedText>
    </TouchableRipple>
  );
};

export default PrimaryButton;
