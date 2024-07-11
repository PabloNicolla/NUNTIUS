import React from "react";
import { Animated, StyleSheet } from "react-native";

const { diffClamp } = Animated;

type DynamicHeaderProps = {
  scrollY: Animated.Value;
  children: React.ReactNode;
  headerHeight: number;
};

const DynamicHeader = ({
  scrollY,
  children,
  headerHeight,
}: DynamicHeaderProps) => {
  const scrollYClamped = diffClamp(scrollY, 0, headerHeight);
  const translateY = scrollYClamped.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
  });

  return (
    <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
      {children}
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
