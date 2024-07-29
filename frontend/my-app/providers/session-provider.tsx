import { Contact } from "@/db/schemaTypes";
import React, { createContext, useState, useContext, useMemo } from "react";
import * as SecureStore from "expo-secure-store";
import { LoginResponseData } from "@/API/login";
import { RegisterResponseData } from "@/API/register";

export type SessionUser = Contact & {
  email: string;
};

type SessionContextType = {
  user: SessionUser | null;
  register: (data: RegisterResponseData) => void;
  login: (data: LoginResponseData) => void;
  logout: () => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  resetPassword: () => Promise<boolean>;
  changePassword: () => Promise<boolean>;

  verifyIfAccessTokenIsValid: () => Promise<boolean>;
  refreshAccessToken: () => Promise<boolean>;

  setAccessToken: (token: string) => Promise<boolean>;
  getAccessToken: () => Promise<boolean>;
  setRefreshToken: (token: string) => Promise<boolean>;
  getRefreshToken: () => Promise<boolean>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

export function SessionProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<SessionUser | null>(null);

  const register = async (data: RegisterResponseData) => {
    setUser(() => {
      return {
        id: data.user.pk,
        email: data.user.email,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        username: data.user.username,
      };
    });

    SecureStore.setItem("ACCESS_TOKEN", data.access);
    SecureStore.setItem("REFRESH_TOKEN", data.refresh);
  };

  const login = async (data: LoginResponseData) => {
    setUser(() => {
      return {
        id: data.user.pk,
        email: data.user.email,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        username: data.user.username,
      };
    });

    SecureStore.setItem("ACCESS_TOKEN", data.access);
    SecureStore.setItem("REFRESH_TOKEN", data.refresh);
  };

  const logout = async () => {
    return false;
  };
  const signInWithGoogle = async () => {
    return false;
  };
  const resetPassword = async () => {
    return false;
  };
  const changePassword = async () => {
    return false;
  };

  const verifyIfAccessTokenIsValid = async () => {
    return false;
  };
  const refreshAccessToken = async () => {
    return false;
  };

  const setAccessToken = async (token: string) => {
    return false;
  };
  const getAccessToken = async () => {
    return false;
  };
  const setRefreshToken = async (token: string) => {
    return false;
  };
  const getRefreshToken = async () => {
    return false;
  };

  const contextMemo = useMemo(
    () => ({
      user,
      register,
      login,
      logout,
      signInWithGoogle,
      resetPassword,
      changePassword,
      verifyIfAccessTokenIsValid,
      refreshAccessToken,
      setAccessToken,
      getAccessToken,
      setRefreshToken,
      getRefreshToken,
    }),
    [user],
  );

  return (
    <SessionContext.Provider value={contextMemo}>
      {children}
    </SessionContext.Provider>
  );
}
