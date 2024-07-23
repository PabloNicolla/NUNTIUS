import { MutableRefObject } from "react";
import { handleGroupMessage, handlePrivateMessage } from "./ws-message";
import { SQLiteDatabase } from "expo-sqlite";
import { insertMessage, updatePrivateChatById } from "@/db/statements";
import { Message } from "@/db/schemaTypes";

export async function routeMessage(
  message: any,
  db: MutableRefObject<SQLiteDatabase>,
) {
  switch (message.type) {
    case "PRIVATE_CHAT":
      await handlePrivateMessage(message, db);
      break;
    case "GROUP_CHAT":
      handleGroupMessage(message);
      break;
    default:
      console.error("Unknown message type:", message.type);
  }
}
