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
  url: `${process.env.EXPO_PUBLIC_REST_API_SERVER}/api/v1/auth/user/`,
});
