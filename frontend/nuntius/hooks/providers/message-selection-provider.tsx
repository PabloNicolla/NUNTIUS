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
  isSelectionActive: boolean;
  selectModeHandler: (id: Message["id"], state: boolean) => boolean;
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
  const [isSelectionActive, setIsSelectionActive] = useState(false);
  const { action, selectedMessages } = useMessageSelected();

  useEffect(() => {
    if (selectedMessages.size === 0) {
      setIsSelectionActive(false);
    } else if (selectedMessages.size !== 0 && !isSelectionActive) {
      setIsSelectionActive(true);
    }
  }, [selectedMessages, isSelectionActive]);

  const selectModeHandler = useCallback((id: Message["id"], state: boolean) => {
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
