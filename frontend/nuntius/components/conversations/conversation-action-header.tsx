import React from "react";
import { Pressable, View, useColorScheme } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed-view";
import { TouchableRipple } from "react-native-paper";
import { useChatSelected } from "@/hooks/providers/chat-selected-provider";

type ActionsHeaderOnSelectProps = {
  headerHeight: number;
  handleDelete: () => void;
  handleClearSelected: () => void;
};

const ActionsHeaderOnSelect = ({
  headerHeight,
  handleDelete,
  handleClearSelected,
}: ActionsHeaderOnSelectProps) => {
  const theme = useColorScheme() ?? "dark";
  const { clearSelected, selectedChats } = useChatSelected();
  const isSelectionActive = selectedChats.size > 0;

  return (
    <View
      className={`absolute left-0 right-0 top-0 ${isSelectionActive ? "" : "hidden"}`}
    >
      <ThemedView
        className={`h-[${headerHeight}] w-full flex-row items-center border-b-[1px] border-primary-light/50 px-2`}
      >
        <Pressable
          className="mr-4"
          onPress={() => {
            handleClearSelected();
            clearSelected();
          }}
        >
          <MaterialIcons
            name="arrow-back"
            size={30}
            color={theme === "light" ? "black" : "white"}
          />
        </Pressable>

        <ThemedText className="pl-4">{selectedChats.size}</ThemedText>

        <View className="flex-1 items-end justify-center">
          <View className="flex-row">
            <CustomIcon
              icon="trash-outline"
              handlePress={() => {
                handleDelete();
              }}
            />

            <View className="overflow-hidden rounded-full">
              <TouchableRipple
                onPress={async () => {
                  console.log("config");
                }}
                rippleColor={
                  theme === "dark"
                    ? "rgba(255, 255, 255, .32)"
                    : "rgba(0, 0, 0, .15)"
                }
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  color={theme === "dark" ? "white" : "black"}
                  size={25}
                />
              </TouchableRipple>
            </View>
          </View>
        </View>
      </ThemedView>
    </View>
  );
};

const CustomIcon = ({
  handlePress,
  icon,
}: {
  handlePress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
}) => {
  const theme = useColorScheme() ?? "dark";

  return (
    <View className="mr-2 overflow-hidden rounded-full">
      <TouchableRipple
        onPress={async () => {
          handlePress();
        }}
        rippleColor={
          theme === "dark" ? "rgba(255, 255, 255, .32)" : "rgba(0, 0, 0, .15)"
        }
      >
        <Ionicons
          name={icon}
          color={theme === "dark" ? "white" : "black"}
          size={25}
        />
      </TouchableRipple>
    </View>
  );
};

export default ActionsHeaderOnSelect;
