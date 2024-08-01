import { ThemedText } from "@/components/themed-text";
import { Condition } from "@/db/schemaTypes";
import { SessionUser } from "@/providers/session-provider";
import { useEffect, useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import React from "react";
import { useMessageSelection } from "@/providers/message-selection-provider";
import { Colors } from "@/constants/Colors";
import { MessageItemType } from "@/app/(app)/(chat)/chat/[id]";
import { format } from "date-fns";

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

  const formattedTime = format(new Date(item.timestamp), "HH:mm");

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
        className={`max-w-[80%] items-start rounded-md ${
          item.senderId === user.id
            ? "items-end bg-blue-500/40"
            : "items-start bg-gray-500/40"
        }`}
      >
        <View style={styles.container}>
          <ThemedText style={styles.messageText}>
            {item.condition === Condition.DELETED
              ? "[message was deleted]"
              : item.value}
          </ThemedText>
          <ThemedText className="text-right" style={styles.dateText}>
            {formattedTime}{" "}
            {item.condition === Condition.EDITED ? "edited" : ""}
          </ThemedText>
        </View>
      </View>
    </TouchableRipple>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 4,
    position: "relative",
  },
  messageText: {
    marginBottom: 0,
  },
  dateText: {
    fontSize: 12,
  },
});
export default MessageItem;
