import { PrivateChat } from "@/lib/db/schemaTypes";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SelectedContextType = {
  selectedChats: Set<PrivateChat["id"]>;
  action: (
    id: PrivateChat["id"],
    state: boolean,
    pressType: "LONG" | "SHORT",
  ) => boolean;
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
  const [selectedChats, setSelectedChats] = useState<Set<PrivateChat["id"]>>(
    new Set(),
  );

  const action = useCallback(
    (id: PrivateChat["id"], state: boolean, pressType: "LONG" | "SHORT") => {
      if (selectedChats.size === 0 && pressType === "SHORT") {
        return false;
      }
      setSelectedChats((prevSelectedChats) => {
        if (prevSelectedChats.size === 0 && pressType === "SHORT") {
          state = false;
          return new Set();
        }

        if (state) {
          prevSelectedChats.add(id);
        } else {
          prevSelectedChats.delete(id);
        }
        return new Set(prevSelectedChats);
      });
      return state;
    },
    [selectedChats.size],
  );

  const clearSelected = () => {
    setSelectedChats(new Set());
  };

  const contextMemo = useMemo(
    () => ({
      selectedChats,
      action,
      clearSelected,
    }),
    [action, selectedChats],
  );

  return (
    <SelectedContext.Provider value={contextMemo}>
      {children}
    </SelectedContext.Provider>
  );
};
