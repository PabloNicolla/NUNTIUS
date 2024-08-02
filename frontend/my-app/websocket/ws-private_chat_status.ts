import { Condition, MessageStatus } from "@/db/schemaTypes";
import { updateMessageStatus } from "@/db/statements";
import { SQLiteDatabase } from "expo-sqlite";
import { MutableRefObject } from "react";
import { Ws_private_chat_status } from "./ws-types";

export async function handlePrivateMessageStatus(
  wsMessage: Ws_private_chat_status,
  db: MutableRefObject<SQLiteDatabase>,
  dbPrefix: string,
) {
  const message = wsMessage.data.message;
  const newStatus = wsMessage.data.status;

  message.chatId = message.senderId;
  message.condition = Condition.STATUS_CHANGED;
  if (newStatus === "RECEIVED") {
    message.status = MessageStatus.RECEIVED;
  } else if (newStatus === "SENT") {
    message.status = MessageStatus.SENT;
  }

  await updateMessageStatus(db.current, dbPrefix, message);
}
