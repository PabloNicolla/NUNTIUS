import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export enum ConnectionStatus {
  CONNECTED,
  CONNECTING,
  DISCONNECTED,
  RECONNECTING,
  ERROR,
}

type WebSocketControllerContextType = {
  socket: WebSocket | null;
  changeSocket: (newSocket: WebSocket | null) => void;
  connectionStatus: ConnectionStatus;
  changeConnectionStatus: (newStatus: ConnectionStatus) => void;
};

const WebsocketController = createContext<
  WebSocketControllerContextType | undefined
>(undefined);

export const useWebSocketController = () => {
  const context = useContext(WebsocketController);
  if (!context) {
    throw new Error(
      "useWebSocketController must be used within a WebsocketControllerProvider",
    );
  }
  return context;
};

export const WebsocketControllerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED,
  );

  useEffect(() => {
    if (
      [ConnectionStatus.DISCONNECTED, ConnectionStatus.ERROR].includes(
        connectionStatus,
      )
    ) {
      socket?.close();
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
    }
  }, [connectionStatus, socket]);

  const changeConnectionStatus = (newStatus: ConnectionStatus) => {
    setConnectionStatus(newStatus);
  };

  const changeSocket = (newSocket: WebSocket | null) => {
    setSocket(newSocket);
  };

  const contextMemo = useMemo(
    () => ({
      socket,
      connectionStatus,
      changeConnectionStatus,
      changeSocket,
    }),
    [socket, connectionStatus],
  );

  return (
    <WebsocketController.Provider value={contextMemo}>
      {children}
    </WebsocketController.Provider>
  );
};
