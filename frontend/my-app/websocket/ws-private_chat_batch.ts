import {
  GET_CONTACT_URL,
  GetContactRequestData,
  GetContactResponseData,
} from "@/API/get-contact";
import { Condition, Message } from "@/db/schemaTypes";
import {
  getFirstMessageBySenderRef,
  getFirstPrivateChat,
  getNewestMessageByChatId,
  insertContact,
  insertMessages,
  insertPrivateChat,
  updateMessage,
  updatePrivateChatById,
} from "@/db/statements";
import axios from "axios";
import { SQLiteDatabase } from "expo-sqlite";
import { MutableRefObject } from "react";
import { Ws_private_chat_batch } from "./ws-types";

export async function handlePrivateMessageBatch(
  wsMessage: Ws_private_chat_batch,
  db: MutableRefObject<SQLiteDatabase>,
  dbPrefix: string,
) {
  const messages = wsMessage.data;

  const normalMessages: Message[] = [];

  for (const message of messages) {
    message.chatId = message.senderId;
    switch (message.condition) {
      case Condition.NORMAL:
        normalMessages.push(message);
        break;
      case Condition.DELETED:
      case Condition.EDITED:
        await updateMessage(db.current, dbPrefix, message);
        break;
    }
  }

  if (normalMessages.length > 0) {
    await insertMessages(db.current, dbPrefix, normalMessages);
  }

  const newestMessage = await getNewestMessageByChatId(
    db.current,
    dbPrefix,
    messages[0].senderId,
    messages[0].receiverType,
  );

  if (!newestMessage) {
    console.log("[HANDLE_PRIVATE_MESSAGE_BATCH]: Error chat has no messages");
    return;
  }

  const chat = await getFirstPrivateChat(
    db.current,
    dbPrefix,
    messages[0].senderId,
  );

  if (!chat) {
    const requestData: GetContactRequestData = {
      pk: messages[0].senderId,
    };

    const response: GetContactResponseData = (
      await axios.post(GET_CONTACT_URL, requestData)
    ).data;

    await insertContact(db.current, dbPrefix, response);

    await insertPrivateChat(db.current, dbPrefix, {
      id: newestMessage.senderId,
      contactId: newestMessage.senderId,
      lastMessageId: newestMessage.id,
      lastMessageTimestamp: newestMessage.timestamp,
      lastMessageValue: newestMessage.value,
      notificationCount: normalMessages.length,
    });
  } else {
    await updatePrivateChatById(
      db.current,
      dbPrefix,
      {
        contactId: newestMessage.senderId,
        id: newestMessage.senderId,
        lastMessageId: newestMessage.id,
        lastMessageTimestamp: newestMessage.timestamp,
        lastMessageValue: newestMessage.value,
      },
      normalMessages.length,
    );
  }
}
