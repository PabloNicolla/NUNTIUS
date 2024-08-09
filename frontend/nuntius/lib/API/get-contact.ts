import { Contact } from "@/lib/db/schemaTypes";
import qs from "query-string";

export type GetContactRequestData =
  | { pk: string; username?: never }
  | { pk?: never; username: string };

export type GetContactResponseData = Contact;

export const GET_CONTACT_URL = qs.stringifyUrl({
  url: `${process.env.EXPO_PUBLIC_REST_API_SERVER}/api/v1/user/contact/`,
});
