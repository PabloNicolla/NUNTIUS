import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  Animated,
  LayoutAnimation,
  TextInput,
  TextInputProps,
  useColorScheme,
  View,
} from "react-native";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";

export type SimpleFormTextFieldProps = ViewProps & {
  title: string;
  handleTextChange: (text: string) => void;
  value?: string;
  keyboardType?: TextInputProps["keyboardType"];
  titleTransformX?: number;
};

// TODO: Handle error messages. E.G. user typed invalid value -> make border red & display help message

const SimpleFormTextField = forwardRef<TextInput, SimpleFormTextFieldProps>(
  function FormTextField(
    {
      title,
      value,
      handleTextChange,
      keyboardType,
      titleTransformX = 10,
      ...rest
    },
    ref,
  ) {
    const [isFocused, setIsFocused] = useState(false);

    const animationValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (isFocused || value) {
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else if (!isFocused && !value) {
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }, [isFocused, animationValue, value]);

    const inputRef = useRef<TextInput>(null);
    // Forward the ref to the TextInput
    useImperativeHandle(ref, () => inputRef.current as TextInput, [inputRef]);

    return (
      <View
        {...rest}
        className={` ${isFocused ? "border-primary-light bg-primary-light/10" : "border-black bg-black/5 dark:border-white dark:bg-white/5"} relative min-h-[60] w-full rounded-md border-b-2`}
      >
        <View className="mx-2 flex-1 justify-end">
          <Animated.View
            className={"absolute"}
            style={{
              transform: [
                {
                  translateY: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -30],
                  }),
                },
              ],
            }}
          >
            <Animated.Text
              style={{
                transform: [
                  {
                    scale: animationValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.8],
                    }),
                  },
                  {
                    translateX: animationValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -titleTransformX], // Adjust this value based on the text size
                    }),
                  },
                ],
              }}
              className={`${isFocused ? "text-primary-light" : "text-text-light/70 dark:text-text-dark/70"} text-lg`}
            >
              {title}
            </Animated.Text>
          </Animated.View>

          <TextInput
            ref={inputRef}
            className="text-lg text-text-light dark:text-text-dark"
            keyboardType={keyboardType ?? "default"}
            value={value}
            numberOfLines={1}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            onChangeText={(text) => {
              handleTextChange(text);
            }}
          ></TextInput>
        </View>
      </View>
    );
  },
);

export default SimpleFormTextField;
