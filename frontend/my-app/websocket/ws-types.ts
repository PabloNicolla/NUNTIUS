import { Message } from "@/db/schemaTypes";

export type SendWsMessage = {
  data: any;
  type: "private_chat_batch" | "private_chat";
  receiver_id: string;
};

export type ReceiveWsMessage = {
  data: any;
  type: "private_chat_batch" | "private_chat";
};

export type Ws_private_chat = {
  data: Message;
  type: "private_chat";
  receiver_id: string;
};

export type Ws_private_chat_batch = {
  data: Message[];
  type: "private_chat_batch";
  receiver_id: string;
};
