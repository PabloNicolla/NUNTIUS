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
import { useSession } from "./session-provider";

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
  const { isLoggedIn, user } = useSession();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED,
  );
  const socket = useRef<WebSocket | null>(null);
  const isConnecting = useRef<boolean>(false);

  const connect = async () => {
    if (isConnecting.current) return;

    isConnecting.current = true;
    try {
      socket.current = new WebSocket(
        `ws://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/ws/user/${user.id}/`,
      );

      socket.current.onopen = () => {
        setConnectionStatus(ConnectionStatus.CONNECTED);
        isConnecting.current = false;
      };

      socket.current.onclose = () => {
        setConnectionStatus(ConnectionStatus.DISCONNECTED);
        retryConnection();
        isConnecting.current = false;
      };

      socket.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        socket.current?.close();
        isConnecting.current = false;
      };

      socket.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const parsedMessage = JSON.parse(message.message);
        routeMessage(parsedMessage);
        console.log("Message from server:", message);
      };
    } catch (error) {
      console.error("Error during WebSocket connection:", error);
      isConnecting.current = false;
    }
  };

  const sendMessage = (message: any) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      console.log(message);
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
    if (!isLoggedIn) {
      connect();
      return () => {
        socket.current?.close();
      };
    }
  }, [isLoggedIn]);

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
