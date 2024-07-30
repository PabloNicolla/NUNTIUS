import { Contact } from "@/db/schemaTypes";
import qs from "query-string";

export type GetContactRequestData = {
  username: string;
};

export type GetContactResponseData = Contact;

export const GET_CONTACT_URL = qs.stringifyUrl({
  url: `http://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/contact/`,
});
