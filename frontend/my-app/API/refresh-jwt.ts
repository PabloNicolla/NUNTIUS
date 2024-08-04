import qs from "query-string";

export type RefreshJWTRequestData = {
  refresh: string;
  device_id: string;
};

export type RefreshJWTResponseData = {
  access: string;
  refresh: string;
};

export const REFRESH_JWT_URL = qs.stringifyUrl({
  url: `http://${process.env.EXPO_PUBLIC_SERVER_DOMAIN_NAME_OR_IP}:8000/api/v1/auth/jwt/refresh/`,
});
