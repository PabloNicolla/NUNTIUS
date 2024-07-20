import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import NetInfo from "@react-native-community/netinfo";
import { routeMessage } from "@/websocket/ws-routeHandler";
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
  const isReconnecting = useRef<boolean>(false);

  const connect = async () => {
    if (isConnecting.current || isReconnecting.current) return;

    isConnecting.current = true;
    try {
      socket.current = new WebSocket(
        `ws://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/ws/user/${user.id}/`,
      );

      socket.current.onopen = () => {
        console.log("[WEB_SOCKET]: OPEN");
        setConnectionStatus(ConnectionStatus.CONNECTED);
        isConnecting.current = false;
      };

      socket.current.onclose = () => {
        console.log("[WEB_SOCKET]: CLOSE");
        setConnectionStatus(ConnectionStatus.DISCONNECTED);
        retryConnection();
        isConnecting.current = false;
      };

      socket.current.onerror = (error) => {
        console.error("[WEB_SOCKET]: ERROR: ", error);
        socket.current?.close();
        isConnecting.current = false;
      };

      socket.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        routeMessage(message);
        console.log("[WEB_SOCKET]: RECEIVE MESSAGE: ", message);
      };
    } catch (error) {
      console.error("[WEB_SOCKET]: Error during WebSocket connection:", error);
      isConnecting.current = false;
    }
  };

  const sendMessage = (message: any) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      console.log("[WEB_SOCKET]: MESSAGE SENT: ", message);
      socket.current.send(JSON.stringify(message));
    } else {
      console.warn("[WEB_SOCKET]: WebSocket is not connected");
    }
  };

  const retryConnection = () => {
    const retryInterval = 5000;
    if (isReconnecting.current) return;
    isReconnecting.current = true;

    const checkNetworkAndReconnect = () => {
      console.log("[WEB_SOCKET]: RECONNECT: %b", isReconnecting.current);
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          connect();
          isReconnecting.current = false;
        } else {
          setTimeout(checkNetworkAndReconnect, retryInterval);
        }
      });
    };
    setTimeout(checkNetworkAndReconnect, retryInterval);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("[WEB_SOCKET]: INITIAL CONNECTION");
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
