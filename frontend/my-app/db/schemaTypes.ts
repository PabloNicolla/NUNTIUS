export type Contact = {
  id: number;
  username: string;
  name: string;
  imageURL?: string;
};

export type PrivateChat = {
  id: number;
  contactId: number;
  lastMessageId?: number;
  lastMessageValue?: string;
  lastMessageTimestamp?: number;
};

export type PrivateChatJoinContact = {
  id: number;
  contactId: number;
  lastMessageId?: number;
  lastMessageValue?: string;
  lastMessageTimestamp?: number;
  username: string;
  name: string;
  imageURL?: string;
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
