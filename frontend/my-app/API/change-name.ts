import qs from "query-string";

export type ChangeNameRequestData = {
  first_name: string;
  last_name?: string;
};
export type ChangeNameResponseData = {
  email: string;
  first_name: string;
  last_name: string;
  pk: string;
  username: string;
};

export const CHANGE_NAME_URL = qs.stringifyUrl({
  url: `http://${process.env.EXPO_PUBLIC_SERVER_IP}:8000/api/v1/auth/user/`,
});
