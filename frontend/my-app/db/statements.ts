import { ChatListItemProps } from "@/components/chat/ChatListItem";
import { SQLiteDatabase } from "expo-sqlite";

export const insertChatStatement = async (db: SQLiteDatabase) => {
  return await db.prepareAsync(
    `INSERT INTO chat (
            id,
            username,
            chatName,
            isVisible,
            lastMessageTime,
            recentMessage,
            imageURL
        ) 
        VALUES (
            $id,
            $username,
            $chatName,
            $isVisible,
            $lastMessageTime,
            $recentMessage,
            $imageURL
        )`,
  );
};

export const getAllChats = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<ChatListItemProps>(`SELECT * FROM chat`);
};

export const getAllVisibleChats = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<ChatListItemProps>(
    `SELECT * FROM chat WHERE isVisible = 1`,
  );
};
