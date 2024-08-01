import {
  GET_CONTACT_URL,
  GetContactRequestData,
  GetContactResponseData,
} from "@/API/get-contact";
import { Condition, Message } from "@/db/schemaTypes";
import {
  getFirstMessageBySenderRef,
  getFirstPrivateChat,
  insertContact,
  insertMessage,
  insertPrivateChat,
  updateMessage,
  updatePrivateChatById,
} from "@/db/statements";
import axios from "axios";
import { SQLiteDatabase } from "expo-sqlite";
import { MutableRefObject } from "react";

export async function handlePrivateMessage(
  wsMessage: { message: Message; type: string },
  db: MutableRefObject<SQLiteDatabase>,
  dbPrefix: string,
) {
  const message: Message = wsMessage.message;

  if (message.condition === Condition.NORMAL) {
    message.timestamp = Date.now();
    message.chatId = message.senderId;

    const msgOutcome = await insertMessage(db.current, dbPrefix, message);

    if (!msgOutcome) {
      console.log("[handlePrivateMessage]: ERROR message outcome is undefined");
    }

    const chat = await getFirstPrivateChat(
      db.current,
      dbPrefix,
      message.senderId,
    );

    if (!chat) {
      const requestData: GetContactRequestData = {
        pk: message.senderId,
      };

      const response: GetContactResponseData = (
        await axios.post(GET_CONTACT_URL, requestData)
      ).data;

      await insertContact(db.current, dbPrefix, response);

      await insertPrivateChat(db.current, dbPrefix, {
        id: message.senderId,
        contactId: message.senderId,
        lastMessageId: msgOutcome!.lastInsertRowId,
        lastMessageTimestamp: message.timestamp,
        lastMessageValue: message.value,
        notificationCount: 1,
      });
    } else {
      await updatePrivateChatById(
        db.current,
        dbPrefix,
        {
          contactId: message.senderId,
          id: message.senderId,
          lastMessageId: msgOutcome!.lastInsertRowId,
          lastMessageTimestamp: message.timestamp,
          lastMessageValue: message.value,
        },
        true,
      );
    }
  } else {
    message.chatId = message.senderId;
    await updateMessage(db.current, dbPrefix, message);
    const chat = await getFirstPrivateChat(
      db.current,
      dbPrefix,
      message.senderId,
    );
    const localMessage = await getFirstMessageBySenderRef(
      db.current,
      dbPrefix,
      message.chatId,
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
        dbPrefix,
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
