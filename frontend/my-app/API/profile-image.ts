import qs from "query-string";

export type GET_ProfileImageResponseData = {
  imageURL: string;
};

export type POST_ProfileImageRequestData = {
  imageURL: string;
};

export type POST_ProfileImageResponseData = {
  message: string;
};

export const PROFILE_IMAGE_URL = qs.stringifyUrl({
  url: `http://${process.env.EXPO_PUBLIC_SERVER_DOMAIN_NAME_OR_IP}:8000/api/v1/user/profile/imageURL/`,
});
