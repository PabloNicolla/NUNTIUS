import React from "react";
import { View, Text } from "react-native";
import { format } from "date-fns";

type DateDividerProps = {
  date: Date;
};

const DateDivider: React.FC<DateDividerProps> = ({ date }) => {
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
    <View style={{ padding: 10, alignItems: "center" }}>
      <Text style={{ fontSize: 14, color: "grey" }}>{formattedDate}</Text>
    </View>
  );
};

export default DateDivider;
