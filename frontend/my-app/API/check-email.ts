export type CheckEmailResponseData = {
  message: string;
  code: "IN_USE" | "AVAILABLE";
};
