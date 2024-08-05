import qs from "query-string";

export type VerifyTokenRequestData = {
  token: string;
};

export const VERIFY_TOKEN_URL = qs.stringifyUrl({
  url: `${process.env.EXPO_PUBLIC_REST_API_SERVER}/api/v1/auth/token/verify/`,
});
