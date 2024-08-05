import { View, useColorScheme } from "react-native";
import { type ErrorBoundaryProps } from "expo-router";
import { ThemedView } from "../themed-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../themed-text";
import PrimaryButton from "../buttons/primary-button";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const theme = useColorScheme() ?? "dark";
  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center gap-y-6">
          <ThemedText className="text-xl">Something went wrong</ThemedText>
          <ThemedText>Error: </ThemedText>
          <ThemedText>{error.message}</ThemedText>
          <PrimaryButton
            title="Try quick reload"
            handlePress={() => {
              console.log("Recovering from crash");
              retry();
            }}
          />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
