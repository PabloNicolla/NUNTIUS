import { Pressable } from "react-native";
import { ThemedText } from "../ThemedText";

import React from "react";

interface Props {
  onPress: () => void;
  title: string;
}

const PrimaryButton = ({ onPress, title }: Props) => {
  return (
    <Pressable
      className="h-[68] w-[280] items-center justify-center rounded-xl bg-primary-light shadow-2xl shadow-white"
      onPress={() => {
        onPress();
      }}
    >
      <ThemedText className="text-xl font-bold text-white">{title}</ThemedText>
    </Pressable>
  );
};

export default PrimaryButton;
