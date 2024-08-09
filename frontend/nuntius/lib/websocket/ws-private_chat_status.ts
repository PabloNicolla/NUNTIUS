import { Condition, Message, MessageStatus } from "@/lib/db/schemaTypes";
import {
  updateMessagesStatusBulk,
  updateMessageStatus,
} from "@/lib/db/statements";
import { SQLiteDatabase } from "expo-sqlite";
import { MutableRefObject } from "react";
import { Ws_private_chat_status } from "./ws-types";

export async function handlePrivateMessageStatus(
  wsMessage: Ws_private_chat_status,
  db: MutableRefObject<SQLiteDatabase>,
  dbPrefix: string,
) {
  const newStatus = wsMessage.data.status;

  if (wsMessage.data.message_type === "private_chat") {
    const message = wsMessage.data.message;
    if (message.condition === Condition.NORMAL) {
      message.condition = Condition.STATUS_CHANGED;
    }
    if (newStatus === "RECEIVED") {
      message.status = MessageStatus.RECEIVED;
    } else if (newStatus === "SENT") {
      message.status = MessageStatus.SENT;
    }

    await updateMessageStatus(db.current, dbPrefix, message);
    return;
  }

  if (wsMessage.data.message_type === "private_chat_batch") {
    const messages = wsMessage.data.message;
    const updatedMessages = messages.map((message: Message) => {
      if (message.condition === Condition.NORMAL) {
        message.condition = Condition.STATUS_CHANGED;
      }
      if (newStatus === "RECEIVED") {
        message.status = MessageStatus.RECEIVED;
      } else if (newStatus === "SENT") {
        message.status = MessageStatus.SENT;
      }
      return message;
    });

    await updateMessagesStatusBulk(db.current, dbPrefix, updatedMessages);
  }
}
