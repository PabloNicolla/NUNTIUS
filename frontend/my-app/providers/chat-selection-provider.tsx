import { SQLiteDatabase } from "expo-sqlite";
import React, {
  createContext,
  MutableRefObject,
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
    [isSelectionActive, selectedChatItems, selectModeHandler],
  );

  return (
    <SelectionContext.Provider value={contextMemo}>
      {children}
    </SelectionContext.Provider>
  );
};
