import React, { createContext, useContext, useEffect, useState } from "react";

type ChatType = {
  id: number;
};

type SelectionContextType = {
  isSelectionActive: boolean;
  selectedChatItems: ChatType[];
  selectModeHandler: (id: number) => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined,
);

export const SelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSelectionActive, setIsSelectionActive] = useState(false);
  const [selectedChatItems, setSelectedChatItems] = useState<ChatType[]>([]);

  useEffect(() => {
    if (selectedChatItems.length === 0) {
      setIsSelectionActive(false);
    }
  }, [selectedChatItems]);

  const selectModeHandler = (id: number) => {
    if (!isSelectionActive) {
      setIsSelectionActive(true);
      setSelectedChatItems([{ id: id }]);
    } else {
      const chat = selectedChatItems.find((chat) => chat.id === id);
      if (!chat) {
        setSelectedChatItems([...selectedChatItems, { id: id }]);
      } else {
        const chats = selectedChatItems.filter((chat) => chat.id !== id);
        setSelectedChatItems([...chats]);
      }
    }
  };

  return (
    <SelectionContext.Provider
      value={{ isSelectionActive, selectedChatItems, selectModeHandler }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
};
