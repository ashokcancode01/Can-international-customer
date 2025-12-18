import { baseApi } from "@/api/baseApi";
import { RootState, store } from "../store";

export interface NotificationItem {
  createdAt: string;
  isInReadByField: string;
  readBy: string[];
  sourceModel: string;
  title: string;
  updatedAt: string;
  _id: string;
  message: string;
  sourceRef: string;
}
interface NotificationResponse {
  data: NotificationItem[];
  totalItems: number;
}

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationResponse, { isRead: string }>({
      query: (params) => ({
        url: `/notifications`,
        params,
      }),
      providesTags: (result) =>
        result ? [{ type: "Notifications", id: "LIST" }] : [],
    }),
    editNotification: builder.mutation<NotificationResponse, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
    editAllNotifications: builder.mutation<NotificationResponse, void>({
      query: () => ({
        url: `/notifications`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationsQuery,
  useEditNotificationMutation,
  useEditAllNotificationsMutation,
} = notificationsApi;
