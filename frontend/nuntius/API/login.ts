import qs from "query-string";

export type LoginRequestData = {
  email?: string;
  username?: string;
  password: string;
  device_id: string;
};

export type LoginResponseData = {
  access: string;
  refresh: string;
  user: {
    pk: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
};

export const LOGIN_URL = qs.stringifyUrl({
  url: `${process.env.EXPO_PUBLIC_REST_API_SERVER}/api/v1/auth/login/`,
});
