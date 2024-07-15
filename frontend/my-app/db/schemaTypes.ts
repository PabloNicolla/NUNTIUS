export type Contact = {
  id: number;
  name: string;
  imageUrl?: string;
  username: string;
};

export type PrivateChat = {
  id: number;
  contactId: number;
  lastMessageId?: number;
};

export enum MessageType {
  TEXT,
  IMAGE,
  VIDEO,
  DOCUMENT,
  AUDIO,
}
export enum MessageStatus {
  PENDING,
  SENT,
  RECEIVED,
  READ,
}

export type Message = {
  id: number;
  senderId: number;
  receiverId: number;
  value: string;
  timestamp: number;
  type: MessageType;
  status: MessageStatus;
  sortId: number;
};
