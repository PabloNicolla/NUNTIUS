import {
  GET_CONTACT_URL,
  GetContactRequestData,
  GetContactResponseData,
} from "@/API/get-contact";
import { Condition, MessageStatus } from "@/db/schemaTypes";
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
import { Ws_private_chat } from "./ws-types";

export async function handlePrivateMessage(
  wsMessage: Ws_private_chat,
  db: MutableRefObject<SQLiteDatabase>,
  dbPrefix: string,
) {
  const message = wsMessage.data;

  const handleNormal = async () => {
    message.chatId = message.senderId;
    message.status = MessageStatus.RECEIVED;

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
        1,
      );
    }
  };

  const handleEditOrDelete = async () => {
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
        "[HANDLE_PRIVATE_MESSAGE]: ERROR localMessage is could not be found",
      );
    }

    if (chat?.lastMessageId === localMessage?.id) {
      await updatePrivateChatById(db.current, dbPrefix, {
        contactId: message.senderId,
        id: message.chatId,
        lastMessageId: localMessage!.id,
        lastMessageTimestamp: localMessage!.timestamp,
        lastMessageValue: localMessage!.value,
      });
    }
  };

  if (message.condition === Condition.NORMAL) {
    await handleNormal();
  } else {
    await handleEditOrDelete();
  }
}
