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
  notificationCount?: number;
};

export type PrivateChatJoinContact = {
  id: number;
  contactId: number;
  lastMessageId?: number;
  lastMessageValue?: string;
  lastMessageTimestamp?: number;
  notificationCount?: number;
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
  PENDING, // ...
  SENT, // v
  RECEIVED, // vv
  READ, // VV
}
export enum ReceiverType {
  PRIVATE_CHAT,
  GROUP_CHAT,
}
export enum Condition {
  NORMAL,
  DELETED,
  EDITED,
}

export type Message = {
  id: number;
  senderId: number;
  receiverId: number;

  value: string;
  timestamp: number;
  type: MessageType;
  status: MessageStatus;

  receiverType: ReceiverType;
  chatId: number;
  senderReferenceId: number;
  condition: Condition;
};
