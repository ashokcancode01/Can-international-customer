import { baseApi } from "@/api/baseApi";
export interface FlagUrl {
  png: string;
  svg: string;
}
export interface Country {
  _id: string;
  name: string;
  flagUrl: FlagUrl;
}
export interface UnitType {
  _id: string;
  unit: string;
}
export interface AddedBy {
  _id: string;
  name: string;
  email: string;
}
export interface Tracking {
  _id: string;
  addedBy: AddedBy;
  trackingURL: string;
  trackingCode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface OrderProcess {
  _id: string;
  relatedId?: string;
  process: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
export interface OrderNote {
  _id: string;
  content: string;
  type: string;
  createdBy: string;
  updatedBy: string;
  showClient: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface TrackOrderResponse {
  orderId: string;
  senderCountry: Country;
  receiverCountry: Country;
  unitType: UnitType;
  tracking: Tracking[];
  OrderStatus: string;
  orderProcess: OrderProcess[];
  orderNotes: OrderNote[];
}

export const trackorderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrackOrder: builder.query<TrackOrderResponse, string>({ 
      query: (trackingId) => `/public/tracking/${trackingId}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetTrackOrderQuery } = trackorderApi;
