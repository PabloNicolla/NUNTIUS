import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type SelectedContextType = {
  selectedMessages: Set<number>;
  action: (id: number, state: boolean) => boolean;
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
  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(
    new Set(),
  );

  const action = useCallback(
    (id: number, state: boolean) => {
      console.log(selectedMessages);
      setSelectedMessages((prevSelectedMessages) => {
        if (state) {
          prevSelectedMessages.add(id);
        } else {
          prevSelectedMessages.delete(id);
        }
        return new Set(prevSelectedMessages);
      });
      console.log("my sate is", state);

      return state;
    },
    [selectedMessages],
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
