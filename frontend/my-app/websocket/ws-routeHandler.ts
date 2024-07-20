import { MessageType, ReceiverType } from "@/db/schemaTypes";
import {
  handleAcknowledgment,
  handleGroupMessage,
  handlePrivateMessage,
  handleStatusUpdate,
} from "./ws-message";

export function routeMessage(message: any) {
  switch (message.receiverType) {
    case ReceiverType.PRIVATE_CHAT:
      handlePrivateMessage(message);
      break;
    case ReceiverType.GROUP_CHAT:
      handleGroupMessage(message);
      break;
    default:
      console.error("Unknown message type:", message.type);
  }
}
