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
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { TouchableRipple } from "react-native-paper";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";

export type FormTextFieldProps = ViewProps & {
  title: string;
  handleTextChange: (text: string) => void;
  value?: string;
  isSecureText?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  titleTransformX?: number;
};

// TODO: Handle error messages. E.G. user typed invalid value -> make border red & display help message

const FormTextField = forwardRef<TextInput, FormTextFieldProps>(
  function FormTextField(
    {
      title,
      value,
      handleTextChange,
      isSecureText,
      className,
      keyboardType,
      titleTransformX = 10,
      ...rest
    },
    ref,
  ) {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const theme = useColorScheme() ?? "light";

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
        className={`${isFocused ? "border-primary-light bg-primary-light/10 dark:border-primary-dark dark:bg-primary-dark/20" : "border-black dark:border-white"} relative min-h-[60] w-full rounded-md border-2 ${className}`}
      >
        <View className="mx-2 flex-1 flex-row items-center">
          <Animated.View
            className={"absolute"}
            style={{
              transform: [
                {
                  translateY: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
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
                      outputRange: [1, 0.7],
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
            className="flex-auto text-lg text-text-light dark:text-text-dark"
            keyboardType={keyboardType ?? "default"}
            value={value}
            numberOfLines={1}
            onFocus={() => {
              setIsFocused(true);
              LayoutAnimation.easeInEaseOut();
            }}
            onBlur={() => {
              setIsFocused(false);
              LayoutAnimation.easeInEaseOut();
            }}
            onChangeText={(text) => {
              handleTextChange(text);
            }}
            secureTextEntry={isSecureText ? !isPasswordVisible : false}
          ></TextInput>

          {isSecureText && (
            <TouchableRipple
              onPress={() => {
                setIsPasswordVisible(!isPasswordVisible);
              }}
              className={`ml-2 justify-center`}
              rippleColor={
                theme === "dark"
                  ? "rgba(255, 255, 255, .32)"
                  : "rgba(0, 0, 0, .32)"
              }
            >
              <Ionicons
                name={`${isPasswordVisible ? "eye-off" : "eye"}`}
                size={30}
                color={theme === "dark" ? "white" : "black"}
              />
            </TouchableRipple>
          )}
        </View>
      </View>
    );
  },
);

export default FormTextField;
