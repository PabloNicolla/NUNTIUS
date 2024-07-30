import qs from "query-string";

export type RefreshTokenRequestData = {
  refresh: string;
};

export type RefreshTokenResponseData = {
  access: string;
};

export const REFRESH_TOKEN_URL = qs.stringifyUrl({
  url: `http://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/dj-rest-auth/token/refresh/`,
});
