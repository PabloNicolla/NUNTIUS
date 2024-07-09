import React, { useState } from "react";
import { SafeAreaView, View, Text, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Avatar, TouchableRipple } from "react-native-paper";

export default function FavoritesScreen() {
  const [imageError, setImageError] = useState(false);
  const userName = "John Doe"; // Replace with the actual user's name

  const getInitials = (name: string) => {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");
    return initials.slice(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <StatusBar style="auto" />
      <Text>asd</Text>
      <View className="h-[80] w-full">
        <TouchableRipple
          className="z-20 flex-1"
          onPress={() => console.log("Pressed")}
          rippleColor="rgba(255, 255, 255, .32)"
        >
          <View className="flex-1 flex-row items-center gap-x-2 px-2">
            <View className="h-[50] w-[50] rounded-full bg-white">
              {imageError ? (
                <Avatar.Text label={getInitials(userName)} size={50} />
              ) : (
                <Image
                  source={{ uri: "https://cataas.com/cat" }}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                  onError={() => setImageError(true)}
                  resizeMode="cover"
                />
              )}
            </View>
            <View className="h-[50] flex-1 flex-col bg-white">
              <View className="h-1/2 w-full flex-row justify-between bg-green-400">
                <View className="flex-1 justify-center overflow-hidden bg-blue-500">
                  <Text
                    className="overflow-hidden"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    adasdasdasdsasdaadadasdasasdasadasdas
                  </Text>
                </View>
                <View className="h-full w-[80] items-end justify-center overflow-hidden bg-yellow-300">
                  <Text
                    className="overflow-hidden"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    2024/02/22
                  </Text>
                </View>
              </View>
              <View className="h-1/2 w-full justify-center bg-red-400">
                <Text
                  className="overflow-hidden"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  adasdasadasdasadasdasadasdasadasdasadasdasadasdasadasdasadasdasadasdasadasdas
                </Text>
              </View>
            </View>
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
}
