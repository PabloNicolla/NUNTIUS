import { Message } from "@/db/schemaTypes";
import {
  getAllPrivateChats,
  insertMessage,
  updatePrivateChatById,
} from "@/db/statements";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import * as SQLite from "expo-sqlite";
import { MutableRefObject } from "react";

export async function handlePrivateMessage(
  message: any,
  db: MutableRefObject<SQLiteDatabase>,
) {
  const v: Message = message.message;

  v.timestamp = Date.now();
  v.chatId = v.senderId;

  console.log("|||=-=-====-=-", v);

  const ret = await insertMessage(db.current, v);
  console.log("=-=-====-=-", ret);
  const ret2 = await updatePrivateChatById(
    db.current,
    {
      contactId: v.senderId,
      id: v.chatId,
      lastMessageId: ret.lastInsertRowId,
      lastMessageTimestamp: v.timestamp,
      lastMessageValue: v.value,
    },
    true,
  );

  console.log(ret2);
}
export function handleGroupMessage(message: any) {}
export function handleStatusUpdate(message: any) {}
export function handleAcknowledgment(message: any) {}
