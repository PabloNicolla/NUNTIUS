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
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
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

    setAccessToken(data.access);
    setRefreshToken(data.refresh);
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
    setUser((user) => {
      if (!user) {
        return null;
      }
      user.first_name = data.first_name;
      user.last_name = data.last_name;
      console.log(user);

      return { ...user };
    });
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
    }),
    [user],
  );

  return (
    <SessionContext.Provider value={contextMemo}>
      {children}
    </SessionContext.Provider>
  );
}
