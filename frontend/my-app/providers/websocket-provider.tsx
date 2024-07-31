import {
  createContext,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import NetInfo from "@react-native-community/netinfo";
import { useSession } from "./session-provider";
import { SQLiteDatabase } from "expo-sqlite";
import { routeMessage } from "@/websocket/ws-routeHandler";
import {
  ConnectionStatus,
  useWebSocketController,
} from "./ws-controller-provider";

type WebSocketContextType = {
  sendMessage: (message: any) => void;
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

export const WebSocketProvider: React.FC<{
  children: React.ReactNode;
  db: MutableRefObject<SQLiteDatabase>;
}> = ({ children, db }) => {
  const { loadStoredUser, getAccessToken, getRefreshToken, getDbPrefix } =
    useSession();

  const { changeConnectionStatus, changeSocket, connectionStatus, socket } =
    useWebSocketController();

  useEffect(() => {
    console.log("[WEB_SOCKET]: Websocket initial check");
    if (connectionStatus === ConnectionStatus.DISCONNECTED) {
      console.log("[WEB_SOCKET]: No socket initialized... creating one");
      changeConnectionStatus(ConnectionStatus.CONNECTING);
      connect();
    }
  }, [connectionStatus]);

  const connect = async () => {
    let socket: null | WebSocket = null;
    const refreshToken = await getRefreshToken();
    const user = await loadStoredUser();
    const dbPrefix = getDbPrefix();

    if (!user) {
      console.log("[WEB_SOCKET]: User not logged in");
      retryGetAuth();
      return;
    }

    if (!refreshToken) {
      console.log("[WEB_SOCKET]: Access token not found");
      retryGetAuth();
      return;
    }

    if (!dbPrefix) {
      console.log("[WEB_SOCKET]: invalid dbPrefix");
      retryGetAuth();
      return;
    }

    try {
      socket = new WebSocket(
        `ws://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/ws/user/${user.id}/`,
      );

      socket.onopen = () => {
        console.log("[WEB_SOCKET]: Connected");
        changeConnectionStatus(ConnectionStatus.CONNECTED);
      };

      socket.onclose = () => {
        console.log("[WEB_SOCKET]: Disconnected");
        changeConnectionStatus(ConnectionStatus.RECONNECTING);
        if (connectionStatus !== ConnectionStatus.DISCONNECTED) {
          retryConnection();
        }
      };

      socket.onerror = (error) => {
        console.error("[WEB_SOCKET]: Error: ", error);
        socket?.close();
        changeConnectionStatus(ConnectionStatus.ERROR);
        changeSocket(null);
      };

      socket.onmessage = async (event) => {
        const wsMessage = JSON.parse(event.data);
        await routeMessage(wsMessage, db, dbPrefix);
        console.log("[WEB_SOCKET]: Message received: ", wsMessage);
      };
    } catch (error) {
      console.error("[WEB_SOCKET]: Connection error: ", error);
      changeConnectionStatus(ConnectionStatus.ERROR);
      changeSocket(null);
    }
    changeSocket(socket);
  };

  const sendMessage = useCallback(
    (message: any) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("[WEB_SOCKET]: Message sent: ", message);
        socket.send(JSON.stringify(message));
      } else {
        console.warn("[WEB_SOCKET]: WebSocket is not connected");
      }
    },
    [socket],
  );

  const retryConnection = () => {
    const retryInterval = 5000;
    const checkNetworkAndReconnect = () => {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          console.log("[WEB_SOCKET]: Reconnecting");
          connect();
        } else {
          setTimeout(checkNetworkAndReconnect, retryInterval);
        }
      });
    };

    setTimeout(checkNetworkAndReconnect, retryInterval);
  };

  const retryGetAuth = () => {
    const retryInterval = 5000;
    const checkNetworkAndReconnect = () => {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          console.log("[WEB_SOCKET]: Getting user/token");
          connect();
        } else {
          setTimeout(checkNetworkAndReconnect, retryInterval);
        }
      });
    };

    setTimeout(checkNetworkAndReconnect, retryInterval);
  };

  const contextValue = useMemo(() => ({ sendMessage }), [sendMessage]);

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
