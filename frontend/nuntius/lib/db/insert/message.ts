import { SQLiteDatabase } from "expo-sqlite";
import { Message } from "../schemaTypes";

export const insertMessage = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  message: Message,
) => {
  try {
    return await db.runAsync(
      `INSERT INTO _${dbPrefix}_message (
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

export const insertMessages = async (
  db: SQLiteDatabase,
  dbPrefix: string,
  messages: Message[],
) => {
  try {
    await db.withTransactionAsync(async () => {
      const placeholders = messages
        .map(() => `(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .join(",");
      const query = `
        INSERT INTO _${dbPrefix}_message (
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
        ) VALUES ${placeholders}
      `;

      const values = messages.reduce<(string | number)[]>((acc, message) => {
        return acc.concat(
          message.senderId,
          message.receiverId,
          message.value,
          message.timestamp,
          message.type,
          message.status,
          message.receiverType,
          message.chatId,
          message.senderReferenceId,
          message.condition,
        );
      }, []);

      await db.runAsync(query, values);
    });
  } catch (error) {
    console.log("[STATEMENTS]: insertMessages", error);
  }
};
