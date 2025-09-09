import { apiSlice } from "./apiSlice";
import { setAuthToken } from "@/lib/auth-utils";

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

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthSuccess, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { access_token: string }) => {
        // Store token in localStorage for later use
        if (typeof window !== "undefined" && response.access_token) {
          setAuthToken(response.access_token);
        }
        return response;
      },
      invalidatesTags: ["User"],
    }),

    preRegister: builder.mutation<PreRegisterSuccess, { email: string }>({
      query: (data) => ({
        url: "/auth/pre-register",
        method: "POST",
        body: data,
      }),
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
        // Store token in localStorage for later use
        if (typeof window !== "undefined" && response.access_token) {
          setAuthToken(response.access_token);
        }
        return response;
      },
      invalidatesTags: ["User"],
    }),

    verifyEmail: builder.mutation<AuthSuccess, { email: string; otp: string }>({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
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
    }),

    me: builder.query<ProfileResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "POST",
      }),
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
