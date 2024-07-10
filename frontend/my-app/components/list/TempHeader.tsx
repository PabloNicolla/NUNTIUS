import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Header = ({ headerHeight }: { headerHeight: number }) => {
  return (
    <>
      <View
        style={[
          styles.subHeader,
          {
            height: headerHeight / 2,
          },
        ]}
      >
        <Ionicons name="menu" size={25} />
        <Text style={styles.conversation}>Conversations</Text>
        <Ionicons name="menu" size={25} />
      </View>
      <View
        style={[
          styles.subHeader,
          {
            height: headerHeight / 2,
          },
        ]}
      >
        <View style={styles.searchBox}>
          <Ionicons name="menu" size={25} />

          <Text style={styles.searchText}>Search for messages or users</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  subHeader: {
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#1c1c1c",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conversation: { color: "white", fontSize: 16, fontWeight: "bold" },
  searchText: {
    color: "#8B8B8B",
    fontSize: 17,
    lineHeight: 22,
    marginLeft: 8,
  },
  searchBox: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#0F0F0F",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
export default Header;
