import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SelectionContextType = {
  isSelectionActive: boolean;
  selectedChatItems: Set<number>;
  selectModeHandler: (id: number, state: boolean) => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined,
);

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
};

export const SelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSelectionActive, setIsSelectionActive] = useState(false);
  const [selectedChatItems, setSelectedChatItems] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    if (selectedChatItems.size === 0) {
      setIsSelectionActive(false);
    } else if (selectedChatItems.size !== 0 && !isSelectionActive) {
      setIsSelectionActive(true);
    }
  }, [selectedChatItems, isSelectionActive]);

  const selectModeHandler = useCallback((id: number, state: boolean) => {
    setSelectedChatItems((prevSelectedChatItems) => {
      if (state) {
        prevSelectedChatItems.add(id);
      } else {
        prevSelectedChatItems.delete(id);
      }

      if (
        (prevSelectedChatItems.size === 1 && state) ||
        (prevSelectedChatItems.size === 0 && !state)
      ) {
        return new Set(prevSelectedChatItems);
      } else {
        return prevSelectedChatItems;
      }
    });
  }, []);

  const contextMemo = useMemo(
    () => ({ isSelectionActive, selectedChatItems, selectModeHandler }),
    [isSelectionActive, selectedChatItems, selectModeHandler],
  );

  return (
    <SelectionContext.Provider value={contextMemo}>
      {children}
    </SelectionContext.Provider>
  );
};
