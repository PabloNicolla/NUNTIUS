import { ChatListItemProps } from "@/components/chat/ChatListItem";
import { SQLiteDatabase } from "expo-sqlite";

export const insertChatStatement = async (db: SQLiteDatabase) => {
  return await db.prepareAsync(
    `INSERT INTO chat (
            id,
            username,
            chatName,
            lastMessageTime,
            recentMessage,
            imageURL
        ) 
        VALUES (
            $id,
            $username,
            $chatName,
            $lastMessageTime,
            $recentMessage,
            $imageURL
        )`,
  );
};

export const getAllChat = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<ChatListItemProps>(`SELECT * FROM chat`);
};
