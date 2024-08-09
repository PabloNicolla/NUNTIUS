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
  url: `${process.env.EXPO_PUBLIC_REST_API_SERVER}/api/v1/auth/jwt/refresh/`,
});
