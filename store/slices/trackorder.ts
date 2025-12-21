import { baseApi } from "@/api/baseApi";

export interface TrackOrder {
  message: string;
}

export const trackorderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrackOrder: builder.query<TrackOrder, string>({ 
      query: (trackingId) => `/public/tracking/${trackingId}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetTrackOrderQuery } = trackorderApi;
