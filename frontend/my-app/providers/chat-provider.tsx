import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SelectionContextType = {
  isSelectionActive: boolean;
  selectedChatItems: Set<number>;
  selectModeHandler: (id: number) => void;
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
    }
  }, [selectedChatItems]);

  const selectModeHandler = (id: number) => {
    setSelectedChatItems((prevSelectedChatItems) => {
      const newSelectedChatItems = new Set(prevSelectedChatItems);
      if (!newSelectedChatItems.has(id)) {
        newSelectedChatItems.add(id);
        setIsSelectionActive(true);
      } else {
        newSelectedChatItems.delete(id);
      }
      return newSelectedChatItems;
    });
  };

  const contextMemo = useMemo(
    () => ({ isSelectionActive, selectedChatItems, selectModeHandler }),
    [isSelectionActive, selectedChatItems],
  );

  return (
    <SelectionContext.Provider value={contextMemo}>
      {children}
    </SelectionContext.Provider>
  );
};
