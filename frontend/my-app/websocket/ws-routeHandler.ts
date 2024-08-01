import { MutableRefObject } from "react";
import { handleGroupMessage, handlePrivateMessage } from "./ws-message";
import { SQLiteDatabase } from "expo-sqlite";
import { insertMessage, updatePrivateChatById } from "@/db/statements";
import { Message } from "@/db/schemaTypes";

export async function routeMessage(
  wsMessage: { message: any; type: string },
  db: MutableRefObject<SQLiteDatabase>,
  dbPrefix: string,
) {
  switch (wsMessage.type) {
    case "private_chat":
      await handlePrivateMessage(wsMessage, db, dbPrefix);
      break;
    case "private_chat_batch":
      console.log("batch received");
      break;
    case "GROUP_CHAT":
      handleGroupMessage(wsMessage);
      break;
    default:
      console.error("Unknown message type:", wsMessage.type);
  }
}
