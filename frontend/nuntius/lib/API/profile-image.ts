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
  url: `${process.env.EXPO_PUBLIC_REST_API_SERVER}/api/v1/user/profile/imageURL/`,
});
