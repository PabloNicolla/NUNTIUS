import qs from "query-string";

export type CheckEmailResponseData = {
  message: string;
  code: "IN_USE" | "AVAILABLE";
};

export type CheckEmailRequestData = {
  email: string;
};

export const CHECK_EMAIL_URL = qs.stringifyUrl({
  url: `${process.env.EXPO_PUBLIC_REST_API_SERVER}/api/v1/user/check-email/`,
});
