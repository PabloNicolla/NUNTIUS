import qs from "query-string";

export type CheckEmailResponseData = {
  message: string;
  code: "IN_USE" | "AVAILABLE";
};

export type CheckEmailRequestData = {
  email: string;
};

export const CHECK_EMAIL_URL = qs.stringifyUrl({
  url: `http://${process.env.EXPO_PUBLIC_LOCAL_IP}:8000/api/v1/user/check-email/`,
});
