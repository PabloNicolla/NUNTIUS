import { ThemedText } from "@/components/themed-text";
import { Condition } from "@/db/schemaTypes";
import { SessionUser } from "@/providers/session-provider";
import { useEffect, useState } from "react";
import { useColorScheme, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import React from "react";
import { useMessageSelection } from "@/providers/message-selection-provider";
import { Colors } from "@/constants/Colors";
import { MessageItemType } from "@/app/(app)/(chat)/chat/[id]";

const MessageItem = React.memo(function MessageItem({
  item,
  user,
}: {
  item: MessageItemType;
  user: SessionUser;
}) {
  const theme = useColorScheme() ?? "dark";
  const [isSelected, setIsSelected] = useState(item.isSelected);
  const { isSelectionActive, selectModeHandler } = useMessageSelection();

  useEffect(() => {
    setIsSelected(item.isSelected);
  }, [item.isSelected]);

  console.log("MMM", item.id, item.isSelected);

  return (
    <TouchableRipple
      onPress={() => {
        console.log("pressed");
        if (isSelectionActive) {
          item.isSelected = selectModeHandler(item.id, !item.isSelected);
          setIsSelected(item.isSelected);
        }
      }}
      onLongPress={() => {
        console.log("long");
        item.isSelected = selectModeHandler(item.id, !item.isSelected);
        setIsSelected(item.isSelected);
      }}
      rippleColor={
        theme === "dark" ? "rgba(255, 255, 255, .32)" : "rgba(0, 0, 0, .15)"
      }
      className={`mb-4 ${item.senderId === user.id ? "items-end" : "items-start"}`}
      style={{
        backgroundColor: isSelected
          ? Colors[theme].primary + "40"
          : "#00000000",
      }}
    >
      <View
        className={`max-w-[80%] items-start rounded-md bg-gray-500/40 p-2 ${
          item.senderId === user.id
            ? "items-end bg-blue-500/40"
            : "items-start bg-gray-500/40"
        }`}
      >
        <ThemedText>
          {item.condition === Condition.DELETED
            ? "[message was deleted]"
            : item.value}{" "}
          {item.id}
        </ThemedText>
      </View>
    </TouchableRipple>
  );
});

export default MessageItem;
