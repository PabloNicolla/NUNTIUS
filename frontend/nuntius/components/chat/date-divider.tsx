import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { format } from "date-fns";

type DateDividerProps = {
  date: Date;
};

const DateDivider: React.FC<DateDividerProps> = ({ date }) => {
  const theme = useColorScheme() ?? "dark";
  const isOlderThanOneYear = (date: Date) => {
    const now = new Date();
    const oneYearAgo = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate(),
    );
    return date < oneYearAgo;
  };

  const formattedDate = isOlderThanOneYear(date)
    ? format(date, "dd-MMMM-yyyy")
    : format(date, "dd-MMMM");

  return (
    <View className="items-center p-2">
      <Text className="rounded-full p-1 text-sm" style={{ color: "grey" }}>
        {formattedDate}
      </Text>
    </View>
  );
};

export default DateDivider;
