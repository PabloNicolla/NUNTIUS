import { Message } from "@/db/schemaTypes";
import { getAllPrivateChats, insertMessage } from "@/db/statements";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import * as SQLite from "expo-sqlite";

export async function handlePrivateMessage(message: any, db: SQLiteDatabase) {
  const messageOject: Message = message.message;
  console.log(messageOject);

  messageOject.timestamp = Date.now();
  const createdMessage = await insertMessage(db, message);
  console.log("---------------------------------------------", createdMessage);
  // console.log(createdMessage);
}
export function handleGroupMessage(message: any) {}
export function handleStatusUpdate(message: any) {}
export function handleAcknowledgment(message: any) {}
