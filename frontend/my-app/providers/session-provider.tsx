import React, { createContext, useState, useContext } from "react";

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

  return (
    <SessionContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}
