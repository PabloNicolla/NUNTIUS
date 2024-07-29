import { Contact } from "@/db/schemaTypes";
import React, { createContext, useState, useContext, useMemo } from "react";

export type SessionUser = Contact & {
  email: string;
};

export type SessionAnswer = {
  success: boolean;
  message: string;
};

type SessionContextType = {
  user: SessionUser | null;
  register: (
    username: string,
    password: string,
    email: string,
  ) => SessionAnswer;
  login: (
    identification: string,
    password: string,
    idType: "EMAIL" | "USERNAME",
  ) => SessionAnswer;
  logout: () => SessionAnswer;
  signInWithGoogle: () => SessionAnswer;
  resetPassword: () => SessionAnswer;
  changePassword: () => SessionAnswer;

  verifyIfAccessTokenIsValid: () => SessionAnswer;
  refreshAccessToken: () => SessionAnswer;

  setAccessToken: (token: string) => SessionAnswer;
  getAccessToken: () => SessionAnswer;
  setRefreshToken: (token: string) => SessionAnswer;
  getRefreshToken: () => SessionAnswer;
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

  const register = (
    username: string,
    password: string,
    email: string,
  ): SessionAnswer => {
    return { success: true, message: "" };
  };
  const login = (
    identification: string,
    password: string,
    idType: "EMAIL" | "USERNAME",
  ): SessionAnswer => {
    return { success: true, message: "" };
  };
  const logout = (): SessionAnswer => {
    return { success: true, message: "" };
  };
  const signInWithGoogle = (): SessionAnswer => {
    return { success: true, message: "" };
  };
  const resetPassword = (): SessionAnswer => {
    return { success: true, message: "" };
  };
  const changePassword = (): SessionAnswer => {
    return { success: true, message: "" };
  };

  const verifyIfAccessTokenIsValid = (): SessionAnswer => {
    return { success: true, message: "" };
  };
  const refreshAccessToken = (): SessionAnswer => {
    return { success: true, message: "" };
  };

  const setAccessToken = (token: string): SessionAnswer => {
    return { success: true, message: "" };
  };
  const getAccessToken = (): SessionAnswer => {
    return { success: true, message: "" };
  };
  const setRefreshToken = (token: string): SessionAnswer => {
    return { success: true, message: "" };
  };
  const getRefreshToken = (): SessionAnswer => {
    return { success: true, message: "" };
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
