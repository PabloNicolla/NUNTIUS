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
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  useColorScheme,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableRipple } from "react-native-paper";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import { FieldError } from "react-hook-form";
import { ThemedText } from "../themed-text";

export type FormTextFieldProps = ViewProps & {
  title: string;
  handleTextChange: (text: string) => void;
  value?: string;
  isSecureText?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  titleTransformX?: number;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  error?: FieldError;
  isLoading?: boolean;
};

const FormTextField = forwardRef<TextInput, FormTextFieldProps>(
  function FormTextField(
    {
      title,
      value,
      handleTextChange,
      isSecureText,
      keyboardType,
      titleTransformX = 10,
      onBlur,
      error,
      style,
      isLoading,
      ...rest
    },
    ref,
  ) {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const theme = useColorScheme() ?? "dark";

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
        style={[{ minHeight: error ? 88 : 60 }, style]}
        {...rest}
        className={isLoading ? "opacity-50" : ""}
      >
        <View
          className={`${error ? "border-red-600" : isFocused ? "border-primary-light bg-primary-light/10 dark:border-primary-dark dark:bg-primary-dark/20" : "border-black dark:border-white"} relative flex-1 rounded-md border-2`}
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
              editable={!isLoading}
              onFocus={() => {
                setIsFocused(true);
                LayoutAnimation.easeInEaseOut();
              }}
              onBlur={(e) => {
                setIsFocused(false);
                LayoutAnimation.easeInEaseOut();
                if (onBlur) {
                  onBlur(e);
                }
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

        {error && (
          <View className="mt-2 max-h-[20]">
            <ThemedText className="text-red-600">
              {error?.message || "Error"}
            </ThemedText>
          </View>
        )}
      </View>
    );
  },
);

export default FormTextField;
