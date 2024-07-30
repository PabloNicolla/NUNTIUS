import qs from "query-string";

export type RefreshTokenRequestData = {
  refresh: string;
  device_id: string;
};

export type RefreshTokenResponseData = {
  access: string;
  refresh: string;
};

export const REFRESH_TOKEN_URL = qs.stringifyUrl({
  url: `http://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/api/v1/auth/jwt/refresh/`,
});
