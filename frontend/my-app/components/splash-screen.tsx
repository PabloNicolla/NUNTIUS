import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { ThemedView } from "./themed-view";

const duration = 2000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

export default function SplashScreenL() {
  const rotation = useSharedValue<number>(0);
  const borderWidth = useSharedValue<number>(10);

  React.useEffect(() => {
    rotation.value = withRepeat(withTiming(1, { duration, easing }), -1);
    borderWidth.value = withRepeat(
      withTiming(25, { duration: duration / 2, easing }),
      -1,
      true, // This reverses the animation
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 360}deg` }],
    borderWidth: borderWidth.value,
  }));

  // ---------------------

  const scale = useSharedValue<number>(1);

  const scale1 = useSharedValue<number>(1);
  const scale2 = useSharedValue<number>(1);
  const scale3 = useSharedValue<number>(1);

  const scaleStyles1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
  }));
  const scaleStyles2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
  }));
  const scaleStyles3 = useAnimatedStyle(() => ({
    transform: [{ scale: scale3.value }],
  }));

  React.useEffect(() => {
    scale1.value = withRepeat(
      withTiming(scale1.value * 1.5, { duration: 1000 }),
      -1,
      true,
    );
    scale2.value = withDelay(
      200,
      withRepeat(withTiming(scale2.value * 1.5, { duration: 1000 }), -1, true),
    );
    scale3.value = withDelay(
      400,
      withRepeat(withTiming(scale3.value * 1.5, { duration: 1000 }), -1, true),
    );
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.loadingContainer} />
      <Animated.View style={[styles.loading, animatedStyle]} />
      <View className="flex-row">
        <Animated.View style={[styles.ball, scaleStyles1]} />
        <Animated.View style={[styles.ball, scaleStyles2]} />
        <Animated.View style={[styles.ball, scaleStyles3]} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  loadingContainer: {
    height: 120,
    width: 120,
    borderRadius: 60,
    position: "absolute",
  },
  loading: {
    height: 120,
    width: 120,
    backgroundColor: "transparent",
    borderRadius: 60,
    borderBottomEndRadius: 20,
    borderColor: "#0000ff", // Blue border
    position: "absolute",
    borderStyle: "solid", // Solid border to create the animation effect
  },
  ball: {
    height: 10,
    width: 10,
    margin: 5,
    backgroundColor: "#000000",
    borderRadius: 50,
  },
});
