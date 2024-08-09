import React, { createContext, useContext, useMemo, useState } from "react";

type AvatarModelContextType = {
  isVisible: boolean;
  imageURL: string;
  showModal: (url: string) => void;
  hideModal: () => void;
};

const AvatarModelContext = createContext<AvatarModelContextType | undefined>(
  undefined,
);

export const useAvatarModal = () => {
  const context = useContext(AvatarModelContext);
  if (!context) {
    throw new Error("useAvatarModal must be used within a AvatarModalProvider");
  }
  return context;
};

export const AvatarModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const showModal = (url: string) => {
    setImageURL(url);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
    setImageURL("");
  };

  const contextMemo = useMemo(
    () => ({
      isVisible,
      imageURL,
      showModal,
      hideModal,
    }),
    [isVisible, imageURL],
  );

  return (
    <AvatarModelContext.Provider value={contextMemo}>
      {children}
    </AvatarModelContext.Provider>
  );
};
