import { handleGroupMessage, handlePrivateMessage } from "./ws-message";
import { SQLiteDatabase } from "expo-sqlite";

export async function routeMessage(message: any, db: SQLiteDatabase) {
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
