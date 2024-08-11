import { Contact, PrivateChatJoinContact } from "@/lib/db/schemaTypes";
import { useReducer } from "react";

export type ConversationItemType = PrivateChatJoinContact & {
  isSelected?: boolean;
};

export type ChatState = {
  chatIds: Set<string>;
  chats: ConversationItemType[];
  filteredChats: ConversationItemType[];
  searchQuery: string;
};

export type SetChatsAction = {
  type: "SET_CHATS_FULL";
  payload: ConversationItemType[];
};

export type SetChatAction = {
  type: "UPDATE_CHAT" | "ADD_CHAT";
  payload: ConversationItemType;
};

export type DeleteChatAction = {
  type: "DELETE_CHAT";
  payload: null | undefined;
};

export type UpdateContactAction = {
  type: "UPDATE_CHAT_CONTACT";
  payload: Contact;
};

export type SetSearchQueryAction = {
  type: "SET_SEARCH_QUERY";
  payload: string;
};

export type SetSelectedChatsAction = {
  type: "CLEAR_SELECTED";
  payload: undefined | null;
};

export type ChatAction =
  | SetChatsAction
  | SetSearchQueryAction
  | SetChatAction
  | UpdateContactAction
  | SetSelectedChatsAction
  | DeleteChatAction;

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "SET_CHATS_FULL": {
      const chatIds = action.payload.map((chat) => chat.id);
      return {
        ...state,
        chatIds: new Set(chatIds),
        chats: sortChatsByLastMessageTime(action.payload),
        filteredChats: action.payload.filter((chat) =>
          chat.first_name
            .toLowerCase()
            .includes(state.searchQuery.toLowerCase()),
        ),
      };
    }
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
        state.chats.filter((chat) => !chat.isSelected),
      );
      const remainingIds = newChats.map((chat) => chat.id);
      return {
        ...state,
        chatIds: new Set(remainingIds),
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
      state.chats[index] = {
        ...action.payload,
        isSelected: state.chats[index].isSelected,
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
    case "CLEAR_SELECTED": {
      const newChats = state.chats.map((chat) => ({
        ...chat,
        isSelected: false,
      }));
      return {
        ...state,
        chats: sortChatsByLastMessageTime(newChats),
        filteredChats: newChats.filter((chat) =>
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

const sortChatsByLastMessageTime = (chats: ConversationItemType[]) => {
  return chats.sort(
    (a, b) => (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0),
  );
};
