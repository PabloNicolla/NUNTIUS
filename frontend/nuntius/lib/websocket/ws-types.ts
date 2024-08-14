import { Message } from "@/lib/db/schemaTypes";

export type SendWsMessage = {
  data: any;
  type: "private_chat_batch" | "private_chat" | "private_chat_confirmation";
  receiver_id: string;
  sender_id: string;
  confirmation_id?: string;
};

export type ReceiveWsMessage = {
  data: any;
  type:
    | "private_chat_batch"
    | "private_chat"
    | "private_chat_status"
    | "keep_alive";
  receiver_id: string;
  sender_id: string;
  confirmation_id?: string;
};

export type Ws_private_chat = {
  data: Message;
  type: "private_chat";
};

export type Ws_private_chat_batch = {
  data: Message[];
  type: "private_chat_batch";
  // receiver_id: string;
};

export type messageStatus = {id: Message["id"], condition: Message["condition"], status: Message["status"]}

export type Ws_private_chat_status = {
  data:
    | {
        message: messageStatus[];
        status: "RECEIVED" | "SENT";
        message_type: "private_chat_batch";
      }
    | {
        message: messageStatus;
        status: "RECEIVED" | "SENT";
        message_type: "private_chat";
      };
  type: "private_chat_status";
};

