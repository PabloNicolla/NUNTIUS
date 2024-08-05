import qs from "query-string";

export type RefreshTokenRequestData = {
  refresh: string;
};

export type RefreshTokenResponseData = {
  access: string;
  access_expiration: string;
};

export const REFRESH_TOKEN_URL = qs.stringifyUrl({
  url: `http://${process.env.EXPO_PUBLIC_SERVER_DOMAIN_NAME_OR_IP}:8000/api/v1/auth/token/refresh/`,
});
