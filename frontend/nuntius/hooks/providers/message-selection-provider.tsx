import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMessageSelected } from "./message-selected-provider";
import { Message } from "@/lib/db/schemaTypes";

type SelectionContextType = {
  selectModeHandler: (
    id: Message["id"],
    state: boolean,
    pressType: "LONG" | "SHORT",
  ) => boolean;
};

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined,
);

export const useMessageSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error(
      "useMessageSelection must be used within a MessageSelectionProvider",
    );
  }
  return context;
};

export const MessageSelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { action, selectedMessages } = useMessageSelected();

  const selectModeHandler = useCallback(
    (id: Message["id"], state: boolean, pressType: "LONG" | "SHORT") => {
      return action(id, state, pressType);
    },
    [],
  );

  const contextMemo = useMemo(
    () => ({
      selectModeHandler,
    }),
    [selectModeHandler],
  );

  return (
    <SelectionContext.Provider value={contextMemo}>
      {children}
    </SelectionContext.Provider>
  );
};
