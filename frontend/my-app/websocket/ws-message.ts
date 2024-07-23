import { Condition, Message } from "@/db/schemaTypes";
import {
  getAllPrivateChats,
  getFirstMessage,
  getFirstMessageBySenderRef,
  getFirstPrivateChat,
  insertMessage,
  updateMessage,
  updatePrivateChatById,
} from "@/db/statements";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import * as SQLite from "expo-sqlite";
import { MutableRefObject } from "react";

export async function handlePrivateMessage(
  wsMessage: { message: Message; type: string },
  db: MutableRefObject<SQLiteDatabase>,
) {
  const message: Message = wsMessage.message;

  if (message.condition === Condition.NORMAL) {
    message.timestamp = Date.now();
    message.chatId = message.senderId;

    const msgOutcome = await insertMessage(db.current, message);

    if (!msgOutcome) {
      console.log("[handlePrivateMessage]: ERROR message outcome is undefined");
    }

    console.log("=-=-=-=-", msgOutcome);

    await updatePrivateChatById(
      db.current,
      {
        contactId: message.senderId,
        id: message.senderId,
        lastMessageId: msgOutcome!.lastInsertRowId,
        lastMessageTimestamp: message.timestamp,
        lastMessageValue: message.value,
      },
      true,
    );
  } else {
    await updateMessage(db.current, message);
    const chat = await getFirstPrivateChat(db.current, message.senderId);
    const localMessage = await getFirstMessageBySenderRef(
      db.current,
      message.senderId,
      message.senderReferenceId,
      message.senderId,
    );

    if (!localMessage) {
      console.log(
        "[handlePrivateMessage]: ERROR localMessage is could not be found",
      );
    }

    if (chat?.lastMessageId === localMessage?.id) {
      await updatePrivateChatById(
        db.current,
        {
          contactId: message.senderId,
          id: message.chatId,
          lastMessageId: localMessage!.id,
          lastMessageTimestamp: localMessage!.timestamp,
          lastMessageValue: localMessage!.value,
        },
        false,
      );
    }
  }
}
export function handleGroupMessage(message: any) {}
export function handleStatusUpdate(message: any) {}
export function handleAcknowledgment(message: any) {}
