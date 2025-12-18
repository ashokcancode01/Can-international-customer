import { baseApi } from "@/api/baseApi";
import { RootState, store } from "../store";

interface Domains {
  _id?: string;
  createdAt?: string;
  domain?: string;
  status?: string;
  isSubdomain?: boolean;
  subdomain?: string;
  updatedAt?: string;
}
interface ProfileResponse {
  _id?: string;
  address?: string;
  canId?: string;
  controllingUser: { _id?: string; email?: string; name?: string };
  domain?: Domains[];
  email?: string;
  hasShop?: boolean;
  phone?: string;
  type?: string;
  updatedAt?: string;
  name?: string;
}
interface AuthorizationData {
  _id: string;
  isDefault: boolean;
  level?: string;
  role?: string;
  type?: string;
  schemaVersion?: number;
  status: boolean;
}
interface AccessEntities {
  _id: string;
  isActive: boolean;
  userGroup?: string;
  userType?: string;
  defaultAuthorization: {
    _id: string;
    isDefault: boolean;
    account?: string;
    entity?: string;
    level?: string;
    role?: string;
    type?: string;
    schemaVersion?: number;
    status: boolean;
  };
  authorizations: AuthorizationData[];
  entity: {
    _id: string;
    name?: string;
    userType?: string;
    type?: string;
    isActive: boolean;
    account: {
      _id: string;
      name?: string;
    };
  };
}
interface ProfileByIdResponse {
  _id?: string;
  avatar: { publicId?: string; url?: string };
  category?: string;
  canId?: string;
  createdAt?: string;
  email?: string;
  name?: string;
  phone?: string;
  designation?: string;
  entities: AccessEntities[];
  forceLogin?: boolean;
  isActive?: boolean;
  otp?: string;
  schemaVersion?: number;
  typeRefSource?: string;
  updatedAt?: string;
  typeRef?: string;
}

interface CustomerByIdResponse {
  _id: string;
  type: "Individual";
  name: string;
  email: string;
  phone: string;
  address: string;
  canId: {
    _id: string;
    canId: string;
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
    canAddress: string[]; // or a more specific type if known
  };
  connectedUser: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface ServiceProvider {
  _id?: string;
  contactNumber?: string;
  domain?: string;
  email?: string;
  name?: string;
}

interface UserPasswordData {
  _id?: string;
  userId?: string;
  password?: string;
  confirmPassword?: string;
  previousPassword?: string;
}

interface UserData {
  _id?: string;
  customerId?: string | string[];
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
}

interface ProfileImage {
  avatar: {
    name: string;
    publicId: string;
    size?: number;
    type: string;
    url: string;
  };
  _id: string;
}

export interface ServiceProviderResponse {
  data: ServiceProvider[];
}

export interface CustomerAddress {
  _id: string;
  address: string;
  district: { _id: string; name: string };
  muncipality: { _id: string; name: string };
  ward: any[];
  type: "Primary" | "Secondary";
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => {
        const state = store.getState() as RootState;
        const customerId = state?.auth?.userData?.typeRef;
        return {
          url: `/vendor/${customerId}`,
          method: "GET",
        };
      },
    }),
    getProfileById: builder.query<ProfileByIdResponse, void>({
      query: () => {
        const state = store.getState() as RootState;
        const id = state?.auth?.userData?._id;

        return {
          url: `/users/profile/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "Profile", id: "LIST" }],
    }),

    getCustomerById: builder.query<CustomerByIdResponse, string>({
      query: (id) => {
        return {
          url: `/customer/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "Profile", id: "LIST" }],
    }),

    getServiceProvider: builder.query<ServiceProvider, void>({
      query: () => {
        const state = store.getState() as RootState;
        const customerId = state?.auth?.userData?.typeRef;
        return {
          url: `/vendor/${customerId}/service-providers`,
          method: "GET",
        };
      },
      transformResponse: (response: any): ServiceProvider => {
        return {
          data: response || [],
        };
      },
    }),

    changePassword: builder.mutation<UserPasswordData, UserPasswordData>({
      query: (body) => ({
        url: `users/change-profile-password/${body.userId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Profile", id: "LIST" }],
    }),

    editProfile: builder.mutation<void, UserData>({
      query: (body) => {
        const url = `/customer/${body.customerId}`;

        const payload = { ...body };

        return {
          url,
          method: "PUT",
          body: payload,
        };
      },
      invalidatesTags: [{ type: "Profile", id: "LIST" }],
    }),

    changeProfileImage: builder.mutation<void, ProfileImage>({
      query: (body) => {
        const url = `/users/change-profile/${body._id}`;

        return {
          url,
          method: "PUT",
          body: { avatar: body?.avatar },
        };
      },
      invalidatesTags: [{ type: "Profile", id: "LIST" }],
    }),
    deleteProfile: builder.mutation<void, { password: string }>({
      query: (payload) => {
        return {
          url: "/users/me/delete",
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: [{ type: "Profile", id: "LIST" }],
    }),
    getCustomerAddresses: builder.query<CustomerAddress[], void>({
      query: () => {
        const state = store.getState() as RootState;
        const customerId = state?.auth?.userData?.typeRef;
        return {
          url: `/customer-address/activeAddressMarketplace/${customerId}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((address) => ({
                type: "CustomerAddress" as const,
                id: address._id,
              })),
              { type: "CustomerAddress", id: "LIST" },
            ]
          : [{ type: "CustomerAddress", id: "LIST" }],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetProfileQuery,
  useGetProfileByIdQuery,
  useGetCustomerByIdQuery,
  useDeleteProfileMutation,
  useGetServiceProviderQuery,
  useChangePasswordMutation,
  useEditProfileMutation,
  useChangeProfileImageMutation,
  useGetCustomerAddressesQuery,
} = profileApi;
