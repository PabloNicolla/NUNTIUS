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
import { useSQLiteContext } from "expo-sqlite";

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
  const db = useSQLiteContext();

  const connect = async () => {
    if (isConnecting.current || isReconnecting.current) {
      console.log("[WEB_SOCKET]: Already connecting or reconnecting");
      return;
    }

    isConnecting.current = true;
    try {
      socket.current = new WebSocket(
        `ws://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/ws/user/${user.id}/`,
      );

      socket.current.onopen = () => {
        console.log("[WEB_SOCKET]: Connected");
        setConnectionStatus(ConnectionStatus.CONNECTED);
        isConnecting.current = false;
      };

      socket.current.onclose = () => {
        console.log("[WEB_SOCKET]: Disconnected");
        setConnectionStatus(ConnectionStatus.DISCONNECTED);
        retryConnection();
        isConnecting.current = false;
      };

      socket.current.onerror = (error) => {
        console.error("[WEB_SOCKET]: Error: ", error);
        socket.current?.close();
        isConnecting.current = false;
      };

      socket.current.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        // routeMessage(message, db);
        console.log("[WEB_SOCKET]: Message received: ", message);
        setTimeout(() => {
          console.log("WWYAY");
          console.log(db);
        }, 5000);
        if (db) {
          try {
            // Ensure database is open before accessing it
            await db.withTransactionAsync(async () => {
              const testing1 = await db.execAsync("SELECT * FROM contact");
              console.log(testing1);
            });
          } catch (dbError) {
            console.error("Database error: ", dbError);
          }
        } else {
          console.error("Database is not initialized.");
        }
      };
    } catch (error) {
      console.error("[WEB_SOCKET]: Connection error: ", error);
      isConnecting.current = false;
    }
  };

  const sendMessage = (message: any) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      console.log("[WEB_SOCKET]: Message sent: ", message);
      socket.current.send(JSON.stringify(message));
    } else {
      console.warn("[WEB_SOCKET]: WebSocket is not connected");
    }
  };

  const retryConnection = () => {
    if (isReconnecting.current || isConnecting.current) {
      console.log("[WEB_SOCKET]: Already reconnecting or connecting");
      return;
    }

    isReconnecting.current = true;

    const retryInterval = 5000;
    const checkNetworkAndReconnect = () => {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          console.log("[WEB_SOCKET]: Reconnecting");
          isReconnecting.current = false;
          connect();
        } else {
          setTimeout(checkNetworkAndReconnect, retryInterval);
        }
      });
    };

    setTimeout(checkNetworkAndReconnect, retryInterval);
  };

  useEffect(() => {
    // if (!isLoggedIn) {
    console.log("[WEB_SOCKET]: Initial connection");
    connect();
    return () => {
      socket.current?.close();
    };
    // }
  }, []);

  const contextValue = useMemo(
    () => ({ socket: socket.current, sendMessage, connectionStatus }),
    [connectionStatus],
  );

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
