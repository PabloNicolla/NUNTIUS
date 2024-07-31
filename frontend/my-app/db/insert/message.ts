import { SQLiteDatabase } from "expo-sqlite";
import { Message } from "../schemaTypes";

export const insertMessage = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  message: Message,
) => {
  try {
    return await db.runAsync(
      `INSERT INTO ${dbPrefix}_message (
                senderId,
                receiverId,
    
                value,
                timestamp,
                type,
                status,
    
                receiverType,
                chatId,
                senderReferenceId,
                condition
            ) 
            VALUES (
                $senderId,
                $receiverId,
    
                $value,
                $timestamp,
                $type,
                $status,
    
                $receiverType,
                $chatId,
                $senderReferenceId,
                $condition
            )`,
      {
        $senderId: message.senderId,
        $receiverId: message.receiverId,

        $value: message.value,
        $timestamp: message.timestamp,
        $type: message.type,
        $status: message.status,

        $receiverType: message.receiverType,
        $chatId: message.chatId,
        $senderReferenceId: message.senderReferenceId,
        $condition: message.condition,
      },
    );
  } catch (error) {
    console.log("[STATEMENTS]: insertMessage", error);
  }
};
