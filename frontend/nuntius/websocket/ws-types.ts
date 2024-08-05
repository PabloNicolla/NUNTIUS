import { Message } from "@/db/schemaTypes";

export type SendWsMessage = {
  data: any;
  type: "private_chat_batch" | "private_chat" | "private_chat_confirmation";
  receiver_id: string;
  sender_id: string;
  confirmation_id?: string;
};

export type ReceiveWsMessage = {
  data: any;
  type: "private_chat_batch" | "private_chat" | "private_chat_status";
  receiver_id: string;
  sender_id: string;
  confirmation_id?: string;
};

export type Ws_private_chat = {
  data: Message;
  type: "private_chat";
};

export type Ws_private_chat_status = {
  data:
    | {
        message: Message[];
        status: "RECEIVED" | "SENT";
        message_type: "private_chat_batch";
      }
    | {
        message: Message;
        status: "RECEIVED" | "SENT";
        message_type: "private_chat";
      };
  type: "private_chat_status";
};

export type Ws_private_chat_batch = {
  data: Message[];
  type: "private_chat_batch";
  // receiver_id: string;
};
