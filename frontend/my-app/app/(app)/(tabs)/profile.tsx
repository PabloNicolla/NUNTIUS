import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, useColorScheme } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const duration = 2000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);
const letters = "HEALTHERA".split("");

export default function App() {
  // Initialize shared values for each letter
  const animatedValues = letters.map(() => useSharedValue(0));
  // Initialize the shared value for the loader animation
  const loaderRotation = useSharedValue(0);

  // Define letter animations
  React.useEffect(() => {
    animatedValues.forEach((value, index) => {
      value.value = withDelay(
        index * 200,
        withTiming(1, {
          duration: 500,
          easing: Easing.bezier(0.25, 1, 0.25, 1),
        }),
      );
    });
  }, []);

  // Define the loader animation
  React.useEffect(() => {
    loaderRotation.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
    );
  }, []);

  // Generate animated styles directly in the component
  const animatedStyles = animatedValues.map((value) => {
    return useAnimatedStyle(() => ({
      transform: [
        { scale: value.value * 1.5 },
        { translateY: value.value * -10 },
      ],
      opacity: value.value,
    }));
  });

  // Create animated style for the loader
  const loaderStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${loaderRotation.value * 360}deg` }],
  }));

  const [showSpinner, setShowSpinner] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShowSpinner(true);
    }, letters.length * 210);
  }, []);

  const theme = useColorScheme() ?? "dark";

  return (
    <View
      style={[{ backgroundColor: Colors[theme].background }, styles.container]}
    >
      <View style={styles.titleContainer}>
        {letters.map((letter, index) => (
          <Animated.Text
            key={index}
            style={[styles.letter, animatedStyles[index]]}
          >
            {letter}
          </Animated.Text>
        ))}
      </View>
      <View style={styles.loaderContainer}>
        {showSpinner && <Animated.View style={[styles.loader, loaderStyle]} />}
        {!showSpinner && <View style={styles.loaderSpace} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
  },
  letter: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#77D733",
    marginHorizontal: 4,
  },
  loaderContainer: {
    marginTop: 20,
  },
  loader: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
    // borderTopColor: "transparent",
    // borderStyle: "solid",

    borderTopColor: "#f5f5f5",
    borderRightColor: "#f5f5f5",
    borderBottomColor: "#f5f5f5",
    borderLeftColor: "#77D733",
  },
  loaderSpace: {
    width: 50,
    height: 50,
  },
});
