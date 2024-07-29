import { Contact } from "@/db/schemaTypes";
import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import { LoginResponseData } from "@/API/login";
import { RegisterResponseData } from "@/API/register";
import { ChangeNameResponseData } from "@/API/change-name";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  changeName: (data: ChangeNameResponseData) => void;
  verifyIfAccessTokenIsValid: () => Promise<boolean>;
  refreshAccessToken: () => Promise<boolean>;
  setAccessToken: (token: string) => void;
  getAccessToken: () => Promise<string>;
  setRefreshToken: (token: string) => void;
  getRefreshToken: () => Promise<string>;
  storeUser: (user: SessionUser) => void;
  loadStoredUser: () => Promise<SessionUser | null | undefined>;
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
    const newUser: SessionUser = {
      id: data.user.pk,
      email: data.user.email,
      first_name: data.user.first_name,
      last_name: data.user.last_name,
      username: data.user.username,
    };
    setUser(newUser);
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    await storeUser(newUser);
  };

  const login = async (data: LoginResponseData) => {
    const newUser: SessionUser = {
      id: data.user.pk,
      email: data.user.email,
      first_name: data.user.first_name,
      last_name: data.user.last_name,
      username: data.user.username,
    };
    setUser(newUser);
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    await storeUser(newUser);
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
  const changeName = async (data: ChangeNameResponseData) => {
    try {
      if (!user) {
        throw new Error(
          "Trying to changeName without any user being logged in",
        );
      }
      const newUser: SessionUser = {
        ...user,
        first_name: data.first_name,
        last_name: data.last_name,
      };
      setUser(() => newUser);
      await storeUser(newUser);
    } catch (error) {
      console.log("[ACCESS_TOKEN]:", error);
    }
  };

  const verifyIfAccessTokenIsValid = async () => {
    return false;
  };
  const refreshAccessToken = async () => {
    return false;
  };

  const setAccessToken = async (token: string) => {
    SecureStore.setItem("ACCESS_TOKEN", token);
  };
  const getAccessToken = async () => {
    const token = SecureStore.getItem("ACCESS_TOKEN");
    if (!token) {
      console.log("[SESSION_PROVIDER]: no access token found");
    }
    return token ?? "";
  };
  const setRefreshToken = async (token: string) => {
    SecureStore.setItem("REFRESH_TOKEN", token);
  };
  const getRefreshToken = async () => {
    const token = SecureStore.getItem("REFRESH_TOKEN");
    if (!token) {
      console.log("[SESSION_PROVIDER]: no access token found");
    }
    return token ?? "";
  };
  const storeUser = async (user: SessionUser) => {
    try {
      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem("STORED_USER", jsonValue);
    } catch (error) {
      console.log("[SESSION_PROVIDER]: failed in storing STORED_USER", error);
    }
  };
  const loadStoredUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("STORED_USER");
      if (jsonValue != null) {
        const user: SessionUser = JSON.parse(jsonValue);
        setUser(() => user);
        return user.id ? user : null;
      }
      return null;
    } catch (error) {
      console.log(
        "[SESSION_PROVIDER]: failed in retrieving STORED_USER",
        error,
      );
    }
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
      changeName,
      verifyIfAccessTokenIsValid,
      refreshAccessToken,
      setAccessToken,
      getAccessToken,
      setRefreshToken,
      getRefreshToken,
      storeUser,
      loadStoredUser,
    }),
    [user],
  );

  return (
    <SessionContext.Provider value={contextMemo}>
      {children}
    </SessionContext.Provider>
  );
}
