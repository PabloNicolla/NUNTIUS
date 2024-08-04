import qs from "query-string";

export type GoogleAuthRequestData = {
  access_token: string;
};

export type GoogleAuthResponseData = {
  access: string;
  refresh: string;
};

export const GOOGLE_AUTH = qs.stringifyUrl({
  url: `http://${process.env.EXPO_PUBLIC_SERVER_IP}:8000/api/v1/auth/google/`,
});
