import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useChatSelected } from "./chat-selected-provider";
import { PrivateChat } from "@/lib/db/schemaTypes";

type SelectionContextType = {
  selectModeHandler: (
    id: PrivateChat["id"],
    state: boolean,
    pressType: "LONG" | "SHORT",
  ) => boolean;
};

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined,
);

export const useChatSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error(
      "useChatSelection must be used within a ChatSelectionProvider",
    );
  }
  return context;
};

export const ChatSelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { action } = useChatSelected();

  const selectModeHandler = useCallback(
    (id: PrivateChat["id"], state: boolean, pressType: "LONG" | "SHORT") => {
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
