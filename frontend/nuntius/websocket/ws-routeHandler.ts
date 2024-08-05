import { MutableRefObject } from "react";
import { handlePrivateMessage } from "./ws-private_chat";
import { SQLiteDatabase } from "expo-sqlite";
import { handlePrivateMessageBatch } from "./ws-private_chat_batch";
import {
  Ws_private_chat,
  Ws_private_chat_batch,
  ReceiveWsMessage,
  Ws_private_chat_status,
} from "./ws-types";
import { handlePrivateMessageStatus } from "./ws-private_chat_status";

export async function routeMessage(
  wsMessage: ReceiveWsMessage,
  db: MutableRefObject<SQLiteDatabase>,
  dbPrefix: string,
) {
  switch (wsMessage.type) {
    case "private_chat":
      await handlePrivateMessage(wsMessage as Ws_private_chat, db, dbPrefix);
      break;
    case "private_chat_batch":
      await handlePrivateMessageBatch(
        wsMessage as Ws_private_chat_batch,
        db,
        dbPrefix,
      );
      break;
    case "private_chat_status":
      await handlePrivateMessageStatus(
        wsMessage as Ws_private_chat_status,
        db,
        dbPrefix,
      );
      break;
    case "keep_alive":
      break;
    default:
      console.error("[ROUTE_MESSAGE]: Unknown message type:", wsMessage.type);
  }
}
