import qs from "query-string";

export type GoogleAuthRequestData = {
  access_token: string;
};

export type GoogleAuthResponseData = {
  access: string;
  refresh: string;
};

export const GOOGLE_AUTH = qs.stringifyUrl({
  url: `${process.env.EXPO_PUBLIC_REST_API_SERVER}/api/v1/auth/google/`,
});
