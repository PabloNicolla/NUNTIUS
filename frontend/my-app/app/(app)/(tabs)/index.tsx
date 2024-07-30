// import { Redirect } from "expo-router/build/exports";

// export default () => <Redirect href={"/groups"} />;

// SignUpScreen.tsx
import React from "react";
import { View } from "react-native";

import * as WebBrowser from "expo-web-browser";

import LogoutButton from "@/components/buttons/logout-button";

WebBrowser.maybeCompleteAuthSession();

const SignUpScreen = ({}) => {
  return (
    <View className="mt-20">
      <LogoutButton />
    </View>
  );
};

export default SignUpScreen;
