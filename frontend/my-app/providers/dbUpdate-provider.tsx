import { addDatabaseChangeListener, useSQLiteContext } from "expo-sqlite";
import { createContext, useContext, useMemo, useState } from "react";

type DbUpdateContextType = {};

const DbUpdateContext = createContext<DbUpdateContextType>({});

export const useDbUpdate = () => {
  return useContext(DbUpdateContext);
};

export function DbUpdateProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  addDatabaseChangeListener(async (event) => {
    console.log("----- db chat run Listener -----", event);
  });

  return (
    <DbUpdateContext.Provider value={{}}>{children}</DbUpdateContext.Provider>
  );
}
