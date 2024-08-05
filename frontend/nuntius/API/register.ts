import qs from "query-string";

export type RegisterRequestData = {
  email: string;
  username: string;
  password1: string;
  password2: string;
  device_id: string;
};

export type RegisterResponseData = {
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

export const REGISTER_URL = qs.stringifyUrl({
  url: `${process.env.EXPO_PUBLIC_REST_API_SERVER}/api/v1/auth/register/`,
});
