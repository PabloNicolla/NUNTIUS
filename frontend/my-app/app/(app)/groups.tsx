import { SafeAreaView, Pressable, View, Text } from "react-native";
import { router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { StatusBar } from "expo-status-bar";

export default function FavoritesScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <StatusBar style="auto" />
      <Text>asd</Text>
      <View className="h-[80] w-full bg-black">
        <View className="flex-1 flex-row items-center gap-x-2 bg-gray-600 px-2">
          <View className="h-[50] w-[50] rounded-full bg-white"></View>
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
      </View>
    </SafeAreaView>
  );
}
