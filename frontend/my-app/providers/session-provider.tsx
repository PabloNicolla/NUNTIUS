import { Contact } from "@/db/schemaTypes";
import React, { createContext, useState, useContext, useMemo } from "react";

const user = {
  id: 999,
  name: "john smith",
  username: "john smith",
  imageURL:
    "https://utfs.io/f/e96b95ab-b00a-4801-bcc7-4946f71c11f2-cnxr61.jpeg",
};

type SessionContextType = {
  isLoggedIn: boolean;
  user: Contact;
  login: () => void;
  logout: () => void;
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  const contextMemo = useMemo(
    () => ({ isLoggedIn, login, logout, user }),
    [isLoggedIn],
  );

  return (
    <SessionContext.Provider value={contextMemo}>
      {children}
    </SessionContext.Provider>
  );
}
