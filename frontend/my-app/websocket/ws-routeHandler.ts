import { MutableRefObject } from "react";
import { handlePrivateMessage } from "./ws-private_chat";
import { SQLiteDatabase } from "expo-sqlite";
import { handlePrivateMessageBatch } from "./ws-private_chat_batch";
import {
  Ws_private_chat,
  Ws_private_chat_batch,
  ReceiveWsMessage,
} from "./ws-types";

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
    default:
      console.error("Unknown message type:", wsMessage.type);
  }
}
