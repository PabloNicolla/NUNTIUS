import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type SelectedContextType = {
  selectedChats: Set<number>;
  action: (id: number, state: boolean) => void;
  clearSelected: () => void;
};

const SelectedContext = createContext<SelectedContextType | undefined>(
  undefined,
);

export const useChatSelected = () => {
  const context = useContext(SelectedContext);
  if (!context) {
    throw new Error(
      "useChatSelected must be used within a ChatSelectedProvider",
    );
  }
  return context;
};

export const ChatSelectedProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedChats, setSelectedChats] = useState<Set<number>>(new Set());

  const action = useCallback((id: number, state: boolean) => {
    setSelectedChats((prevSelectedChats) => {
      if (state) {
        prevSelectedChats.add(id);
      } else {
        prevSelectedChats.delete(id);
      }
      return new Set(prevSelectedChats);
    });
    return state;
  }, []);

  const clearSelected = () => {
    setSelectedChats(new Set());
  };

  const contextMemo = useMemo(
    () => ({
      selectedChats,
      action,
      clearSelected,
    }),
    [selectedChats, action],
  );

  return (
    <SelectedContext.Provider value={contextMemo}>
      {children}
    </SelectedContext.Provider>
  );
};
