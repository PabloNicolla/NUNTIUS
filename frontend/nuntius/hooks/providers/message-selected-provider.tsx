import { Message } from "@/lib/db/schemaTypes";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type SelectedContextType = {
  selectedMessages: Set<Message["id"]>;
  action: (
    id: Message["id"],
    state: boolean,
    pressType: "LONG" | "SHORT",
  ) => boolean;
  clearSelected: () => void;
};

const SelectedContext = createContext<SelectedContextType | undefined>(
  undefined,
);

export const useMessageSelected = () => {
  const context = useContext(SelectedContext);
  if (!context) {
    throw new Error(
      "useMessageSelected must be used within a MessageSelectedProvider",
    );
  }
  return context;
};

export const MessageSelectedProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedMessages, setSelectedMessages] = useState<Set<Message["id"]>>(
    new Set(),
  );

  const action = useCallback(
    (id: Message["id"], state: boolean, pressType: "LONG" | "SHORT") => {
      if (selectedMessages.size === 0 && pressType === "SHORT") {
        return false;
      }
      setSelectedMessages((prevSelectedMessages) => {
        if (prevSelectedMessages.size === 0 && pressType === "SHORT") {
          state = false;
          return new Set();
        }

        if (state) {
          prevSelectedMessages.add(id);
        } else {
          prevSelectedMessages.delete(id);
        }
        return new Set(prevSelectedMessages);
      });
      return state;
    },
    [selectedMessages.size],
  );

  const clearSelected = () => {
    setSelectedMessages(new Set());
  };

  const contextMemo = useMemo(
    () => ({
      selectedMessages,
      action,
      clearSelected,
    }),
    [action, selectedMessages],
  );

  return (
    <SelectedContext.Provider value={contextMemo}>
      {children}
    </SelectedContext.Provider>
  );
};
