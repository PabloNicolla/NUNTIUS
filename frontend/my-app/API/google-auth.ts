import qs from "query-string";

export type GoogleAuthRequestData = {
  access_token: string;
};

export type GoogleAuthResponseData = {
  access: string;
  refresh: string;
};

export const GOOGLE_AUTH = qs.stringifyUrl({
  url: `http://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/dj-rest-auth/google/`,
});
