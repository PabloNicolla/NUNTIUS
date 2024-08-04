import { Contact } from "@/db/schemaTypes";
import qs from "query-string";

export type GetContactRequestData =
  | { pk: string; username?: never }
  | { pk?: never; username: string };

export type GetContactResponseData = Contact;

export const GET_CONTACT_URL = qs.stringifyUrl({
  url: `http://${process.env.EXPO_PUBLIC_SERVER_DOMAIN_NAME_OR_IP}:8000/api/v1/user/contact/`,
});
