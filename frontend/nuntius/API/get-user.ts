import qs from "query-string";

export type GetUserResponseData = {
  email: string;
  first_name: string;
  last_name: string;
  pk: string;
  username: string;
};

export const GET_USER_URL = qs.stringifyUrl({
  url: `http://${process.env.EXPO_PUBLIC_SERVER_DOMAIN_NAME_OR_IP}:8000/api/v1/auth/user/`,
});
