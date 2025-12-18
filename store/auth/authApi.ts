import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, invalidateAllTags } from "../../api/baseApi";
import {
  setCredentials,
  setAuthLoading,
  clearPreviousSession,
  logout,
} from "./authSlice";
import { resetBaseApiState } from "../../api/baseApi";
import { toastManager } from "@/utils/toastManager";

export interface UserEntity {
  entity: {
    _id: string;
  };
  authorization: {
    _id: string;
  };
}

export interface UserData {
  _id: string;
  email: string;
  name: string;
  token: string;
  selectedEntity: UserEntity;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  name: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  confirmPassword: string;
  email: string;
  otp: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation<UserData, LoginRequest>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setAuthLoading(true));
        try {
          dispatch(clearPreviousSession());

          dispatch(resetBaseApiState());
          dispatch(authApi.util.resetApiState());

          dispatch(invalidateAllTags());

          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          const errorMessage = (error as any)?.data?.message || "Login failed";
          toastManager.error("Sign In", errorMessage);
          dispatch(setAuthLoading(false));
        }
      },
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "users/register",
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordData>({
      query: (data) => ({
        url: "/users/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, ResetPasswordData>({
      query: (data) => {
        return {
          url: "/users/reset-password",
          method: "POST",
          body: data,
        };
      },
    }),
    verifyEmail: builder.mutation({
      query: ({ email, otp }) => {
        return {
          url: "/users/verify-email",
          method: "PUT",
          body: { email, otp },
        };
      },
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/users/verify-email/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
      transformErrorResponse: (response: any) => {
        // For logout, don't treat 401 as an error since it's expected
        if (response.status === 401) {
          return { success: true, message: "Logged out successfully" };
        }
        return response;
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        // Always clear local state regardless of API result
        // This ensures logout works even if server is unreachable
        try {
          await queryFulfilled;
        } catch (error) {
          // Ignore errors for logout - we'll clear locally anyway
        }
        
        // Clear local state in all cases
        dispatch(resetBaseApiState());
        dispatch(authApi.util.resetApiState());
        dispatch(invalidateAllTags());
        dispatch(logout());
      },
    }),
  }),
});

export const { resetApiState: resetAuthApiState } = authApi.util;

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useLogoutMutation,
} = authApi;
