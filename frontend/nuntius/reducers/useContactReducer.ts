import { Contact } from "@/db/schemaTypes";
import { useReducer } from "react";

export type ContactState = {
  contacts: Contact[];
  filteredContacts: Contact[];
  searchQuery: string;
};

export type SetContactsAction = {
  type: "SET_CONTACTS";
  payload: Contact[];
};

export type SetSearchQueryAction = {
  type: "SET_SEARCH_QUERY";
  payload: string;
};

export type ContactAction = SetContactsAction | SetSearchQueryAction;

const contactReducer = (
  state: ContactState,
  action: ContactAction,
): ContactState => {
  switch (action.type) {
    case "SET_CONTACTS":
      return {
        ...state,
        contacts: action.payload,
        filteredContacts: action.payload.filter((contact) =>
          contact.first_name
            .toLowerCase()
            .includes(state.searchQuery.toLowerCase()),
        ),
      };
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
        filteredContacts: state.contacts.filter((contact) =>
          contact.first_name
            .toLowerCase()
            .includes(action.payload.toLowerCase()),
        ),
      };
    default:
      return state;
  }
};

export default function useContactReducer() {
  const initialState: ContactState = {
    contacts: [],
    filteredContacts: [],
    searchQuery: "",
  };

  return useReducer(contactReducer, initialState);
}
