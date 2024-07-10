import React, { useRef } from "react";
import { Animated, StyleSheet, useColorScheme } from "react-native";
import Header from "@/components/list/TempHeader";

const { diffClamp } = Animated;
const headerHeight = 50 * 2;

type DynamicHeaderProps = {
  scrollY: Animated.Value;
};

const DynamicHeader = ({ scrollY }: DynamicHeaderProps) => {
  const theme = useColorScheme();

  const scrollYClamped = diffClamp(scrollY, 0, headerHeight);
  const translateY = scrollYClamped.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
  });

  return (
    <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
      <Header {...{ headerHeight }} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    backgroundColor: "#1c1c1c",
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1,
  },
});

export default DynamicHeader;
