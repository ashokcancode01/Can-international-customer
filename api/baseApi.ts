import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";

export const BASE_URL = "https://can-logistic-vluop.ondigitalocean.app/api";

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
  tagTypes: [
    "Order",
    "VendorOrder",
    "CanId",
    "Profile",
    "Marketplace",
    "Notifications",
    "Comments",
    "Documents",
    "Announcements",
    "DigitalStamp",
    "Voucher",
    "CategoryFilter",
    "CustomerAddress",
    "VendorStoreReview",
  ],
  endpoints: () => ({}),
});

export const invalidateAllTags = () => {
  return baseApi.util.invalidateTags([
    "Order",
    "VendorOrder",
    "CanId",
    "Profile",
    "Marketplace",
    "Notifications",
    "Comments",
    "Documents",
    "Announcements",
    "DigitalStamp",
    "Voucher",
    "CategoryFilter",
    "CustomerAddress",
    "VendorStoreReview",
  ]);
};

export const { resetApiState: resetBaseApiState } = baseApi.util;
