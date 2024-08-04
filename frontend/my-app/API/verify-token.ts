import qs from "query-string";

export type VerifyTokenRequestData = {
  token: string;
};

export const VERIFY_TOKEN_URL = qs.stringifyUrl({
  url: `http://${process.env.EXPO_PUBLIC_SERVER_DOMAIN_NAME_OR_IP}:8000/api/v1/auth/token/verify/`,
});
