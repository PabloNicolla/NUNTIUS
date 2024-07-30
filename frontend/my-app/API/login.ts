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
  url: `http://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/api/v1/auth/login/`,
});
