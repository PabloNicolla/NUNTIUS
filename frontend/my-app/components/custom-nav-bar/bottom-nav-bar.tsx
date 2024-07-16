import React from "react";
import * as NavigationBar from "expo-navigation-bar";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

type Props = {
  bgColor?: string;
  styleColor?: "light" | "dark";
};

const BottomNavbar = ({ bgColor, styleColor }: Props) => {
  const theme = useColorScheme() ?? "dark";

  (async () => {
    await NavigationBar.setBackgroundColorAsync(
      bgColor ??
        (theme === "dark" ? Colors.dark.background : Colors.light.background),
    );
    await NavigationBar.setButtonStyleAsync(
      styleColor ?? (theme === "dark" ? "light" : "dark"),
    );
  })();

  return <></>;
};

export default BottomNavbar;
