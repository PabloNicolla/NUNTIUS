import { Message } from "@/db/schemaTypes";
import { getAllPrivateChats, insertMessage } from "@/db/statements";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import * as SQLite from "expo-sqlite";

export async function handlePrivateMessage(message: any, db: SQLiteDatabase) {
  const messageOject: Message = message.message;
  console.log(messageOject);

  const mydb = await SQLite.openDatabaseAsync("local56.db");

  const testing1 = mydb.getAllSync("SELECT * FROM contact");

  messageOject.timestamp = Date.now();
  // const createdMessage = await insertMessage(mydb, message);
  console.log("---------------------------------------------", mydb, db);
  console.log("---------------------------------------------");
  console.log("---------------------------------------------", testing1);
  // console.log(createdMessage);
}
export function handleGroupMessage(message: any) {}
export function handleStatusUpdate(message: any) {}
export function handleAcknowledgment(message: any) {}
