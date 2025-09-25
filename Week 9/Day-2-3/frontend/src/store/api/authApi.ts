import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// Parse multiple API base URLs from environment variable, same as api.ts
const API_BASES = process.env.NEXT_PUBLIC_API_BASE
  ? process.env.NEXT_PUBLIC_API_BASE.split(",").map((url) => url.trim())
  : ["http://localhost:4000"];

// Custom base query with fallback support
const baseQueryWithFallback: BaseQueryFn = async (args, api, extraOptions) => {
  let lastError: unknown = null;

  for (const baseUrl of API_BASES) {
    try {
      console.log(`Trying auth API endpoint: ${baseUrl}/auth`);

      const baseQuery = fetchBaseQuery({
        baseUrl: `${baseUrl}/auth`,
        prepareHeaders: (headers) => {
          const token = Cookies.get("access_token");
          if (token) {
            headers.set("authorization", `Bearer ${token}`);
          }
          return headers;
        },
        // Add timeout to prevent hanging
        timeout: 10000,
      });

      const result = await baseQuery(args, api, extraOptions);

      if (result.error && result.error.status !== 200) {
        console.warn(`Failed to connect to ${baseUrl}:`, result.error);
        lastError = result.error;
        continue;
      }

      console.log(`Successfully connected to auth API: ${baseUrl}`);
      return result;
    } catch (error) {
      console.warn(`Failed to connect to ${baseUrl}:`, error);
      lastError = error;
      continue;
    }
  }

  // If all URLs failed, return the last error
  return {
    error: lastError || {
      status: "FETCH_ERROR",
      error: `All auth API endpoints failed. Tried: ${API_BASES.join(", ")}`,
    },
  };
};

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithFallback,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          Cookies.set("access_token", data.access_token, { expires: 1 }); // 1 day
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          Cookies.set("access_token", data.access_token, { expires: 1 }); // 1 day
        } catch (error) {
          console.error("Registration failed:", error);
        }
      },
    }),
    getProfile: builder.query<User, void>({
      query: () => "/profile",
      providesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      queryFn: () => {
        Cookies.remove("access_token");
        return { data: undefined };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useLogoutMutation,
} = authApi;
