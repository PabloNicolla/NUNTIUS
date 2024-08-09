import { ThemedText } from "@/components/themed-text";
import { Condition, MessageStatus } from "@/lib/db/schemaTypes";
import { SessionUser } from "@/hooks/providers/session-provider";
import { useEffect, useState } from "react";
import { useColorScheme, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import React from "react";
import { useMessageSelection } from "@/hooks/providers/message-selection-provider";
import { Colors } from "@/constants/Colors";
import { MessageItemType } from "@/app/(app)/(chat)/chat/[id]";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

const MessageItem = React.memo(function MessageItem({
  item,
  user,
  previousMessageSender,
}: {
  item: MessageItemType;
  user: SessionUser;
  previousMessageSender: string | null;
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
      className={`${item.senderId === user.id ? "items-end" : "items-start"}`}
      style={{
        backgroundColor: isSelected
          ? Colors[theme].primary + "40"
          : "#00000000",
        marginTop: previousMessageSender === item.senderId ? 4 : 12,
      }}
    >
      <View
        className={`max-w-[80%] items-start rounded-md ${
          item.senderId === user.id
            ? "items-end bg-blue-500/40"
            : "items-start bg-gray-500/40"
        }`}
      >
        <View className="px-2 pt-1">
          <ThemedText>
            {item.condition === Condition.DELETED
              ? "[message was deleted]"
              : item.value}
          </ThemedText>
          <ThemedText className="text-right text-xs">
            {formattedTime}{" "}
            {item.condition === Condition.EDITED ? "edited" : ""}{" "}
            {item.senderId === user.id && (
              <MessageStatusIcon status={item.status} />
            )}
          </ThemedText>
        </View>
      </View>
    </TouchableRipple>
  );
});

const MessageStatusIcon = ({ status }: { status: MessageStatus }) => {
  const theme = useColorScheme() ?? "dark";
  let icon: keyof typeof Ionicons.glyphMap;
  let color = null;
  switch (status) {
    case MessageStatus.PENDING:
      icon = "ellipsis-horizontal-outline";
      break;
    case MessageStatus.SENT:
      icon = "checkmark-outline";
      break;
    case MessageStatus.RECEIVED:
      icon = "checkmark-done-outline";
      break;
    case MessageStatus.READ:
      icon = "checkmark-done-outline";
      color = "#00ff00";
      break;
  }

  return <Ionicons name={icon} size={10} color={color || Colors[theme].text} />;
};

export default MessageItem;
