import { apiSlice } from "./apiSlice";

// Types from original authApi.ts
export interface AuthSuccess {
  access_token: string;
}

export interface AuthError {
  error: string;
  status?: number;
}

export interface PreRegisterSuccess {
  success: true;
  message: string;
}

export interface RegisterSuccessAuth extends AuthSuccess {}

export interface ProfileResponse {
  _id?: string;
  email?: string;
  name?: string;
  roles?: string[];
  [k: string]: unknown;
}

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
          localStorage.setItem("token", response.access_token);
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
          localStorage.setItem("token", response.access_token);
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
