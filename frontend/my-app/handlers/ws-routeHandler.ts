import {
  handleAcknowledgment,
  handleGroupMessage,
  handlePrivateMessage,
  handleStatusUpdate,
} from "./ws-message";

export function routeMessage(message: any) {
  switch (message.type) {
    case "private_message":
      handlePrivateMessage(message);
      break;
    case "group_message":
      handleGroupMessage(message);
      break;
    case "status_update":
      handleStatusUpdate(message);
      break;
    case "acknowledgment":
      handleAcknowledgment(message);
      break;
    case "connection_established":
      console.log("WebSocket temporary success acknowledgment");
      break;
    default:
      console.error("Unknown message type:", message.type);
  }
}
