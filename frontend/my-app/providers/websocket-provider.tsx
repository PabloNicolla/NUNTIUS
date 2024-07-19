import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import NetInfo from "@react-native-community/netinfo";
import { routeMessage } from "@/handlers/ws-routeHandler";

enum ConnectionStatus {
  CONNECTED,
  DISCONNECTED,
}

type WebSocketContextType = {
  socket: WebSocket | null;
  sendMessage: (message: any) => void;
  connectionStatus: ConnectionStatus;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }

  return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED,
  );
  const socket = useRef<WebSocket | null>(null);

  const connect = () => {
    socket.current = new WebSocket(
      `ws://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/ws/user/${123}/`,
    );

    socket.current.onopen = () => {
      setConnectionStatus(ConnectionStatus.CONNECTED);
    };

    socket.current.onclose = () => {
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      // Attempt to reconnect every 5 seconds
      retryConnection();
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      socket.current?.close();
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // Handle incoming messages
      routeMessage(message);
      console.log("Message from server:", message);
    };
  };

  const sendMessage = (message: any) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  const retryConnection = () => {
    const retryInterval = 5000;
    const checkNetworkAndReconnect = () => {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          connect();
        } else {
          setTimeout(checkNetworkAndReconnect, retryInterval);
        }
      });
    };
    setTimeout(checkNetworkAndReconnect, retryInterval);
  };

  useEffect(() => {
    connect();

    return () => {
      socket.current?.close();
    };
  }, []);

  const contextMemo = useMemo(
    () => ({ socket: socket.current, sendMessage, connectionStatus }),
    [connectionStatus],
  );

  return (
    <WebSocketContext.Provider value={contextMemo}>
      {children}
    </WebSocketContext.Provider>
  );
};
