import qs from "query-string";

export type RefreshTokenRequestData = {
  refresh: string;
};

export type RefreshTokenResponseData = {
  access: string;
  access_expiration: string;
};

export const REFRESH_TOKEN_URL = qs.stringifyUrl({
  url: `${process.env.EXPO_PUBLIC_REST_API_SERVER}/api/v1/auth/token/refresh/`,
});
