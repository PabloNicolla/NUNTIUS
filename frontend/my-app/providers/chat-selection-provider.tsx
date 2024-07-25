import { SQLiteDatabase } from "expo-sqlite";
import React, {
  createContext,
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SelectionContextType = {
  isSelectionActive: boolean;
  selectedChatItems: Set<number>;
  selectModeHandler: (id: number) => void;
  clearSelected: () => void;
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
  db,
}: {
  children: React.ReactNode;
  db: MutableRefObject<SQLiteDatabase>;
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

  const clearSelected = () => {
    setSelectedChatItems(new Set());
  };

  const contextMemo = useMemo(
    () => ({
      isSelectionActive,
      selectedChatItems,
      selectModeHandler,
      clearSelected,
    }),
    [isSelectionActive, selectedChatItems],
  );

  return (
    <SelectionContext.Provider value={contextMemo}>
      {children}
    </SelectionContext.Provider>
  );
};