import { View, Text, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

type Props = {};

const Sos = (props: Props) => {
  const db = useSQLiteContext();
  return (
    <View className="flex-1 bg-green-400">
      <Pressable
        className="h-[200] w-[200] bg-white"
        onPress={() => {
          router.push("/sos/sos2");
        }}
      >
        <Text>Sos</Text>
      </Pressable>
    </View>
  );
};

export default Sos;
