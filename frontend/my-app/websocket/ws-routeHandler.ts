import { MutableRefObject } from "react";
import { handleGroupMessage, handlePrivateMessage } from "./ws-message";
import { SQLiteDatabase } from "expo-sqlite";
import { insertMessage, updatePrivateChatById } from "@/db/statements";
import { Message } from "@/db/schemaTypes";

export async function routeMessage(
  wsMessage: { message: any; type: string },
  db: MutableRefObject<SQLiteDatabase>,
) {
  switch (wsMessage.type) {
    case "PRIVATE_CHAT":
      await handlePrivateMessage(wsMessage, db);
      break;
    case "GROUP_CHAT":
      handleGroupMessage(wsMessage);
      break;
    default:
      console.error("Unknown message type:", wsMessage.type);
  }
}
