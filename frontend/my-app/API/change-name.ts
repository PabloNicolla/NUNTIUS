import { SessionUser } from "@/providers/session-provider";
import qs from "query-string";

export type ChangeNameRequestData = {
  first_name: string;
  last_name?: string;
};
export type ChangeNameResponseData = SessionUser;

export const CHANGE_NAME_URL = qs.stringifyUrl({
  url: `http://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/dj-rest-auth/user/`,
});
