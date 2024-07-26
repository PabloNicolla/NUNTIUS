import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMessageSelected } from "./message-selected-provider";

type SelectionContextType = {
  isSelectionActive: boolean;
  // selectedMessages: Set<number>;
  selectModeHandler: (id: number, state: boolean) => boolean;
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
  // const [selectedMessages, setSelectedMessages] = useState<Set<number>>(
  //   new Set(),
  // );
  const [isSelectionActive, setIsSelectionActive] = useState(false);
  const { action, selectedMessages } = useMessageSelected();

  useEffect(() => {
    if (selectedMessages.size === 0) {
      setIsSelectionActive(false);
    } else if (selectedMessages.size !== 0 && !isSelectionActive) {
      setIsSelectionActive(true);
    }
  }, [selectedMessages, isSelectionActive]);

  // const selectModeHandler = useCallback((id: number, state: boolean) => {
  //   console.log(selectedMessages);

  //   setSelectedMessages((prevSelectedMessages) => {
  //     if (state) {
  //       prevSelectedMessages.add(id);
  //     } else {
  //       prevSelectedMessages.delete(id);
  //     }

  //     // if (
  //     //   (prevSelectedMessages.size === 1 && state) ||
  //     //   (prevSelectedMessages.size === 0 && !state)
  //     // ) {
  //     //   return new Set(prevSelectedMessages);
  //     // } else {
  //     //   return prevSelectedMessages;
  //     // }
  //     return new Set(prevSelectedMessages);
  //   });
  //   console.log("my sate is", state);

  //   return state;
  // }, []);

  const selectModeHandler = useCallback((id: number, state: boolean) => {
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
