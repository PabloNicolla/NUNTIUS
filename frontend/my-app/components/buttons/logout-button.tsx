import React, { useState } from "react";
import PrimaryButton from "./primary-button";
import { useSession } from "@/providers/session-provider";
import { router } from "expo-router";

type Props = {};

const LogoutButton = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useSession();

  const handlePress = async () => {
    setIsLoading(true);
    logout();
    if (router.canGoBack()) {
      router.dismissAll();
    }
    router.replace("/");
  };

  return (
    <PrimaryButton
      title="Logout"
      handlePress={() => {
        handlePress();
      }}
      isLoading={isLoading}
    />
  );
};

export default LogoutButton;
