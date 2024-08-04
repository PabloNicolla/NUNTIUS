import {
  createContext,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import NetInfo from "@react-native-community/netinfo";
import { useSession } from "./session-provider";
import { SQLiteDatabase } from "expo-sqlite";
import { routeMessage } from "@/websocket/ws-routeHandler";
import {
  ConnectionStatus,
  useWebSocketController,
} from "./ws-controller-provider";
import { ReceiveWsMessage, SendWsMessage } from "@/websocket/ws-types";
import { getAllPendingMessages } from "@/db/statements";
import { Message } from "@/db/schemaTypes";

type WebSocketContextType = {
  sendMessage: (message: SendWsMessage) => void;
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
  const connectionStatusRef = useRef(connectionStatus);

  useEffect(() => {
    connectionStatusRef.current = connectionStatus;
  }, [connectionStatus]);

  useEffect(() => {
    console.log(
      "[WEB_SOCKET]: Websocket initial check, status:",
      connectionStatusRef.current,
    );
    if (connectionStatusRef.current === ConnectionStatus.DISCONNECTED) {
      console.log("[WEB_SOCKET]: No socket initialized... creating one");
      changeConnectionStatus(ConnectionStatus.CONNECTING);
      connect();
    }
  }, [connectionStatus]);

  useEffect(() => {
    if (connectionStatusRef.current === ConnectionStatus.CONNECTED && socket) {
      console.log("[WEB_SOCKET]: Checking for pending messages...");
      const sendPendingMessages = async () => {
        const dbPrefix = getDbPrefix();
        if (!dbPrefix) {
          return;
        }
        const pendingMessages = await getAllPendingMessages(
          db.current,
          dbPrefix,
        );

        if (!pendingMessages || pendingMessages.length === 0) {
          return;
        }

        const messagesMap = new Map<string, Message[]>();

        pendingMessages.forEach((message) => {
          const receiverId = message.receiverId;
          if (!messagesMap.has(receiverId)) {
            messagesMap.set(receiverId, []);
          }
          messagesMap.get(receiverId)!.push(message);
        });

        messagesMap.forEach((elements) => {
          sendMessage({
            data: elements,
            receiver_id: elements[0].receiverId,
            sender_id: elements[0].senderId,
            type: "private_chat_batch",
          });
        });
      };
      sendPendingMessages();
    }
  }, [connectionStatus, socket]);

  // Use a ref to keep track of the latest connectionStatus

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
        `ws://${process.env.EXPO_PUBLIC_SERVER_IP}:8000/ws/user/${user.id}/`,
      );

      socket.onopen = () => {
        console.log("[WEB_SOCKET]: Connected");
        changeConnectionStatus(ConnectionStatus.CONNECTED);
      };

      socket.onclose = () => {
        console.log("[WEB_SOCKET]: Disconnected");
        if (connectionStatusRef.current !== ConnectionStatus.DISCONNECTED) {
          changeConnectionStatus(ConnectionStatus.RECONNECTING);
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
        const wsMessage: ReceiveWsMessage = JSON.parse(event.data);
        if (wsMessage.confirmation_id) {
          const msg = {
            data: wsMessage.data,
            receiver_id: wsMessage.receiver_id,
            sender_id: wsMessage.sender_id,
            type: "private_chat_confirmation",
            confirmation_id: wsMessage.confirmation_id,
          };
          if (socket && socket.readyState === WebSocket.OPEN) {
            console.log("[WEB_SOCKET]: Message sent: ", msg);
            socket.send(JSON.stringify(msg));
          } else {
            console.warn("[WEB_SOCKET]: WebSocket is not connected111");
          }
        }
        console.log("[WEB_SOCKET]: Message received: ", wsMessage);
        await routeMessage(wsMessage, db, dbPrefix);
      };
    } catch (error) {
      console.error("[WEB_SOCKET]: Connection error: ", error);
      changeConnectionStatus(ConnectionStatus.ERROR);
      changeSocket(null);
    }
    changeSocket(socket);
  };

  const sendMessage = useCallback(
    (message: SendWsMessage) => {
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
      console.log("[WEB_SOCKET]: Reconnecting Loop");
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          if (connectionStatusRef.current === ConnectionStatus.RECONNECTING) {
            console.log("[WEB_SOCKET]: Reconnecting");
            connect();
          }
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
        if (
          state.isConnected &&
          connectionStatusRef.current === ConnectionStatus.CONNECTING
        ) {
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
