import { MessageType, ReceiverType } from "@/db/schemaTypes";
import {
  handleAcknowledgment,
  handleGroupMessage,
  handlePrivateMessage,
  handleStatusUpdate,
} from "./ws-message";
import { SQLiteDatabase } from "expo-sqlite";

export function routeMessage(message: any, db: SQLiteDatabase) {
  switch (message.type) {
    case "PRIVATE_CHAT":
      handlePrivateMessage(message, db);
      break;
    case "GROUP_CHAT":
      handleGroupMessage(message);
      break;
    default:
      console.error("Unknown message type:", message.type);
  }
}
