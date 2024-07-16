import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();

  console.log(id);

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Details of user {id} </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
