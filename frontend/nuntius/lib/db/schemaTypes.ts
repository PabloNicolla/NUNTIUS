export type Contact = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  imageURL?: string;
};

export type PrivateChat = {
  id: string;
  contactId: string;
  lastMessageId?: number;
  lastMessageValue?: string;
  lastMessageTimestamp?: number;
  notificationCount?: number;
};

export type PrivateChatJoinContact = {
  id: string;
  contactId: string;
  lastMessageId?: number;
  lastMessageValue?: string;
  lastMessageTimestamp?: number;
  notificationCount?: number;
  username: string;
  first_name: string;
  last_name: string;
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
  STATUS_CHANGED,
}

export type Message = {
  id: number;
  senderId: string;
  receiverId: string;

  value: string;
  timestamp: number;
  type: MessageType;
  status: MessageStatus;

  receiverType: ReceiverType;
  chatId: string;
  senderReferenceId: number;
  condition: Condition;
};
