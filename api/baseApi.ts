import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";

export const BASE_URL = "https://app.international.nepalcan.com/api";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const userData = state?.auth?.userData;

      if (userData?.token) {
        headers.set("Authorization", `Bearer ${userData?.token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Home", "TrackOrder", "Menu", "Profile" , "Branches"],
  endpoints: () => ({}),
});

export const invalidateAllTags = () => {
  return baseApi.util.invalidateTags(["Home", "TrackOrder", "Menu", "Profile", "TrackOrder", "Branches"]);
};

export const { resetApiState: resetBaseApiState } = baseApi.util;
