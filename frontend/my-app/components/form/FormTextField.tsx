import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
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

type FormTextFieldProps = ViewProps & {
  title: string;
  handleTextChange: (text: string) => void;
  value?: string;
  isSecureText?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
};

const FormTextField = forwardRef<TextInput, FormTextFieldProps>(
  (
    {
      title,
      value,
      handleTextChange,
      isSecureText,
      className,
      keyboardType,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const theme = useColorScheme() ?? "light";

    const inputRef = useRef<TextInput>(null);

    // Forward the ref to the TextInput
    useImperativeHandle(ref, () => inputRef.current as TextInput, [inputRef]);

    return (
      <View
        {...rest}
        className={`${isFocused ? "border-primary-light bg-primary-light/10 dark:border-primary-dark dark:bg-primary-dark/20" : "border-black dark:border-white"} relative min-h-[60] w-full rounded-xl border-2 ${className}`}
      >
        <View className="mx-2 flex-1 flex-row items-center">
          <ThemedText
            className={`${isFocused || value ? "left-0 top-0 text-xs" : "bottom-auto left-0 top-auto"} absolute text-text-light/50 dark:text-text-dark/70`}
          >
            {title}
          </ThemedText>
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
            secureTextEntry={isSecureText ? isPasswordVisible : false}
          ></TextInput>

          {isSecureText && (
            <TouchableRipple
              onPress={() => {
                setIsPasswordVisible(!isPasswordVisible);
              }}
              className={`w-30 ml-2 justify-center`}
              rippleColor={
                theme === "dark"
                  ? "rgba(255, 255, 255, .32)"
                  : "rgba(0, 0, 0, .32)"
              }
            >
              <Ionicons
                name={`${isPasswordVisible ? "eye" : "eye-off"}`}
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
