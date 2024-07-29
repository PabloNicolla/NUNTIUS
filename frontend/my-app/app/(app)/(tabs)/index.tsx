// import { Redirect } from "expo-router/build/exports";

// export default () => <Redirect href={"/groups"} />;

// SignUpScreen.tsx
import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import axios from "axios";

import * as WebBrowser from "expo-web-browser";

import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import LogoutButton from "@/components/buttons/logout-button";

WebBrowser.maybeCompleteAuthSession();

const SignUpScreen = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/dj-rest-auth/login/`,
        {
          username: "NewestUser19",
          password: "test123!@#",
        },
      );
      console.log(response.data);

      // Save access token and navigate to dashboard
    } catch (err) {
      setError("Sign-Up Failed");
    }
  };

  const handleReg = async () => {
    try {
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/dj-rest-auth/registration/`,
        {
          username: "NewestUser20",
          email: "NewestUser@test.com",
          password1: "test123!@#",
          password2: "test123!@#",
        },
        {
          withCredentials: true,
        },
      );
      console.log(response.data);

      // Save access token and navigate to dashboard
    } catch (err) {
      setError("Sign-Up Failed");
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/private/`,
        {
          withCredentials: true, // Ensure cookies are sent with the request
        },
      );
      console.log("Data fetched successfully", response.data);
    } catch (error) {
      console.error("Data fetching failed", error);
    }
  };

  return (
    <View className="mt-20">
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      {error ? <Text>{error}</Text> : null}
      <GoogleSignInMy />
      <Button title="Reg" onPress={handleReg} />
      <Button title="Fetch" onPress={fetchData} />
      <LogoutButton />
    </View>
  );
};

export default SignUpScreen;

const GoogleSignInMy = ({}) => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    redirectUri: makeRedirectUri({ scheme: "com.anonymous.myapp" }),
  });

  useEffect(() => {
    console.log(response);

    if (response?.type === "success") {
      const id_token = response.authentication?.idToken;
      const access_token = response.authentication?.accessToken;
      axios
        .post(
          `http://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/dj-rest-auth/google/`,
          {
            access_token: access_token,
          },
        )
        .then((response) => {
          console.log(response.data);
          //   axios
          //     .get(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/dj-rest-auth/google/`, {
          //       headers: {
          //         Authorization: `Bearer ${response.data.access}`,
          //       },
          //     })
          //     .then((res) => {
          //       console.log(res.data);
          //     })
          //     .catch((error) => {
          //       console.error(error);
          //     });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Sign In with Google"
      onPress={() => promptAsync()}
    />
  );
};
