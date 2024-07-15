import { ChatListItemProps } from "@/components/chat/ChatListItem";
import { useReducer } from "react";

export type ChatState = {
  chats: ChatListItemProps[];
  filteredChats: ChatListItemProps[];
  searchQuery: string;
};

export type SetChatsAction = {
  type: "SET_CHATS";
  payload: ChatListItemProps[];
};

export type SetSearchQueryAction = {
  type: "SET_SEARCH_QUERY";
  payload: string;
};

export type ChatAction = SetChatsAction | SetSearchQueryAction;

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "SET_CHATS":
      return {
        ...state,
        chats: sortChatsByLastMessageTime(action.payload),
        filteredChats: action.payload.filter((chat) =>
          chat.name.toLowerCase().includes(state.searchQuery.toLowerCase()),
        ),
      };
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
        filteredChats: state.chats.filter((chat) =>
          chat.name.toLowerCase().includes(action.payload.toLowerCase()),
        ),
      };
    default:
      return state;
  }
};

export default function useChatReducer() {
  const initialState: ChatState = {
    chats: [],
    filteredChats: [],
    searchQuery: "",
  };

  return useReducer(chatReducer, initialState);
}

const sortChatsByLastMessageTime = (chats: ChatListItemProps[]) => {
  return chats.sort(
    (a, b) => (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0),
  );
};
