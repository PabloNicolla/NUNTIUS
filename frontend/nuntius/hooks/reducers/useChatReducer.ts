import { Contact, PrivateChatJoinContact } from "@/lib/db/schemaTypes";
import { useReducer } from "react";

export type ChatState = {
  chatIds: Set<string>;
  chats: PrivateChatJoinContact[];
  filteredChats: PrivateChatJoinContact[];
  searchQuery: string;
};

export type SetChatsAction = {
  type: "SET_CHATS_FULL";
  payload: PrivateChatJoinContact[];
};

export type SetChatAction = {
  type: "UPDATE_CHAT" | "DELETE_CHAT" | "ADD_CHAT";
  payload: PrivateChatJoinContact;
};

export type UpdateContactAction = {
  type: "UPDATE_CHAT_CONTACT";
  payload: Contact;
};

export type SetSearchQueryAction = {
  type: "SET_SEARCH_QUERY";
  payload: string;
};

export type ChatAction =
  | SetChatsAction
  | SetSearchQueryAction
  | SetChatAction
  | UpdateContactAction;

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "SET_CHATS_FULL":
      return {
        ...state,
        chatIds: new Set(action.payload.map((chat) => chat.id)),
        chats: sortChatsByLastMessageTime(action.payload),
        filteredChats: action.payload.filter((chat) =>
          chat.first_name
            .toLowerCase()
            .includes(state.searchQuery.toLowerCase()),
        ),
      };
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
        filteredChats: state.chats.filter((chat) =>
          chat.first_name.toLowerCase().includes(action.payload.toLowerCase()),
        ),
      };
    case "ADD_CHAT": {
      const newChats = sortChatsByLastMessageTime([
        ...state.chats,
        action.payload,
      ]);
      state.chatIds.add(action.payload.id);
      return {
        ...state,
        chats: newChats,
        filteredChats: newChats.filter((chat) =>
          chat.first_name
            .toLowerCase()
            .includes(state.searchQuery.toLowerCase()),
        ),
      };
    }
    case "DELETE_CHAT": {
      const newChats = sortChatsByLastMessageTime(
        state.chats.filter((chat) => chat.id !== action.payload.id),
      );
      state.chatIds.delete(action.payload.id);
      return {
        ...state,
        chats: newChats,
        filteredChats: newChats.filter((chat) =>
          chat.first_name
            .toLowerCase()
            .includes(state.searchQuery.toLowerCase()),
        ),
      };
    }
    case "UPDATE_CHAT": {
      const index = state.chats.findIndex(
        (chat) => chat.id === action.payload.id,
      );
      state.chats[index] = { ...action.payload };
      return {
        ...state,
        chats: sortChatsByLastMessageTime(state.chats),
        filteredChats: state.chats.filter((chat) =>
          chat.first_name
            .toLowerCase()
            .includes(state.searchQuery.toLowerCase()),
        ),
      };
    }
    case "UPDATE_CHAT_CONTACT": {
      const index = state.chats.findIndex(
        (chat) => chat.id === action.payload.id,
      );
      state.chats[index] = {
        ...state.chats[index],
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        imageURL: action.payload.imageURL,
      };
      return {
        ...state,
        chats: sortChatsByLastMessageTime(state.chats),
        filteredChats: state.chats.filter((chat) =>
          chat.first_name
            .toLowerCase()
            .includes(state.searchQuery.toLowerCase()),
        ),
      };
    }
    default:
      return state;
  }
};

export default function useChatReducer() {
  const initialState: ChatState = {
    chatIds: new Set(),
    chats: [],
    filteredChats: [],
    searchQuery: "",
  };

  return useReducer(chatReducer, initialState);
}

const sortChatsByLastMessageTime = (chats: PrivateChatJoinContact[]) => {
  return chats.sort(
    (a, b) => (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0),
  );
};
