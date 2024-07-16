import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavBar from "@/components/top-nav-bar";
import SimpleFormTextField from "@/components/form/simple-form-text-field";
import PrimaryButton from "@/components/buttons/primary-button";
import { router } from "expo-router";
import { insertContact } from "@/db/statements";

type Props = {};

const AddContact = (props: Props) => {
  const db = useSQLiteContext();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  return (
    <ThemedView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        className=""
      >
        <SafeAreaView className="flex-1">
          <TopNavBar title="New Contact" />

          <View className="flex-1 items-center">
            <ScrollView className="w-full max-w-[80%] pt-4">
              <SimpleFormTextField
                className="mb-5"
                title="Name"
                value={name}
                handleTextChange={(text) => {
                  setName(text);
                }}
                titleTransformX={5}
              />
              <SimpleFormTextField
                className="mb-5"
                title="Phone Number"
                value={phoneNumber}
                handleTextChange={(text) => {
                  setPhoneNumber(text);
                }}
                titleTransformX={16}
              />
            </ScrollView>
          </View>

          <View className="mb-5 items-center">
            <PrimaryButton
              className="w-[60%]"
              minHeight={51}
              title="Save"
              handlePress={async () => {
                console.log("pressed");

                const phone = parseInt(phoneNumber, 10);

                if (isNaN(phone)) {
                  console.warn(
                    "The phoneNumber string cannot be converted to a number.",
                  );
                } else {
                  console.log(phone);

                  await insertContact(db, {
                    id: phone,
                    name: name,
                    username: name,
                    imageURL: "",
                  });

                  router.back();
                }
              }}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default AddContact;
