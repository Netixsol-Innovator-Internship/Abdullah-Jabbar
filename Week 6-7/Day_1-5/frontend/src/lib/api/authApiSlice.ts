import { apiSlice } from "./apiSlice";
import { setAuthToken } from "@/lib/auth-utils";
import type {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";

// Types from original authApi.ts
export type AuthSuccess = { access_token: string };
export type AuthError = { error: string; status?: number };
export type PreRegisterSuccess = { success: true; message: string };
export type RegisterSuccessAuth = AuthSuccess;

export type ProfileResponse = {
  _id?: string;
  email?: string;
  name?: string;
  roles?: string[];
  phone?: string;
  avatarUrl?: string;
  addresses?: Array<{
    label?: string;
    fullName?: string;
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    isDefault?: boolean;
  }>;
  loyaltyPoints?: number;
  loyaltyTier?: string;
  isEmailVerified?: boolean;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
} & Record<string, unknown>;

// Utility to extract error message safely
const parseErrorResponse = (error: FetchBaseQueryError): string => {
  if ("data" in error && error.data) {
    const data = error.data as { message?: string; error?: string };
    if (data.message) return data.message;
    if (data.error) return data.error;
  }
  return "An unknown error occurred";
};

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthSuccess, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { access_token: string }) => {
        if (typeof window !== "undefined" && response.access_token) {
          setAuthToken(response.access_token);
        }
        return response;
      },
      transformErrorResponse: (
        response: FetchBaseQueryError,
        _meta: FetchBaseQueryMeta | undefined,
        _arg
      ) => parseErrorResponse(response),
      invalidatesTags: ["User"],
    }),

    preRegister: builder.mutation<PreRegisterSuccess, { email: string }>({
      query: (data) => ({
        url: "/auth/pre-register",
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (
        response: FetchBaseQueryError,
        _meta: FetchBaseQueryMeta | undefined,
        _arg
      ) => parseErrorResponse(response),
    }),

    register: builder.mutation<
      RegisterSuccessAuth,
      { email: string; password: string; otp: string; name?: string }
    >({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { access_token: string }) => {
        if (typeof window !== "undefined" && response.access_token) {
          setAuthToken(response.access_token);
        }
        return response;
      },
      transformErrorResponse: (
        response: FetchBaseQueryError,
        _meta: FetchBaseQueryMeta | undefined,
        _arg
      ) => parseErrorResponse(response),
      invalidatesTags: ["User"],
    }),

    verifyEmail: builder.mutation<AuthSuccess, { email: string; otp: string }>({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (
        response: FetchBaseQueryError,
        _meta: FetchBaseQueryMeta | undefined,
        _arg
      ) => parseErrorResponse(response),
    }),

    resendOtp: builder.mutation<
      { success: boolean; message: string },
      { email: string }
    >({
      query: (data) => ({
        url: "/otp/request",
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (
        response: FetchBaseQueryError,
        _meta: FetchBaseQueryMeta | undefined,
        _arg
      ) => parseErrorResponse(response),
    }),

    me: builder.query<ProfileResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "POST",
      }),
      transformErrorResponse: (
        response: FetchBaseQueryError,
        _meta: FetchBaseQueryMeta | undefined,
        _arg
      ) => parseErrorResponse(response),
      providesTags: ["User"],
    }),
  }),
});

// Export hooks for each endpoint
export const {
  useLoginMutation,
  usePreRegisterMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useMeQuery,
} = authApiSlice;
