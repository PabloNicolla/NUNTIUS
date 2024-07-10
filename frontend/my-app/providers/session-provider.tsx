import React, { createContext, useState, useContext, useMemo } from "react";

type SessionContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const SessionContext = createContext<SessionContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const useSession = () => {
  return useContext(SessionContext);
};

export function SessionProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  const contextMemo = useMemo(
    () => ({ isLoggedIn, login, logout }),
    [isLoggedIn],
  );

  return (
    <SessionContext.Provider value={contextMemo}>
      {children}
    </SessionContext.Provider>
  );
}
