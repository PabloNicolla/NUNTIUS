import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useChatSelected } from "./chat-selection-provider copy";

type SelectionContextType = {
  isSelectionActive: boolean;
  selectModeHandler: (id: number, state: boolean) => void;
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
  const [isSelectionActive, setIsSelectionActive] = useState(false);
  const { action, selectedChats } = useChatSelected();

  useEffect(() => {
    if (selectedChats.size === 0) {
      setIsSelectionActive(false);
    } else if (selectedChats.size !== 0 && !isSelectionActive) {
      setIsSelectionActive(true);
    }
  }, [selectedChats, isSelectionActive]);

  const selectModeHandler = useCallback((id: number, state: boolean) => {
    return action(id, state);
  }, []);

  const contextMemo = useMemo(
    () => ({
      isSelectionActive,
      selectModeHandler,
    }),
    [isSelectionActive, selectModeHandler],
  );

  return (
    <SelectionContext.Provider value={contextMemo}>
      {children}
    </SelectionContext.Provider>
  );
};
