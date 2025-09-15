import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken, setAuthToken, removeAuthToken } from "@/lib/auth-utils";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

// Base query with automatic token refresh on 401 errors
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    // Get token from localStorage using the correct utility function
    const token = getAuthToken();

    // If we have a token, add it to the headers
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
  credentials: "include", // allows cookie-based auth if added later
});

// Wrapper around fetchBaseQuery with token refresh on 401
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 (Unauthorized), try to refresh the token
  if (result.error && result.error.status === 401) {
    console.log("Token expired, attempting to refresh...");

    // Try to refresh the token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Store the new token
      const newToken = (refreshResult.data as any).access_token;
      if (newToken) {
        setAuthToken(newToken);
        console.log("Token refreshed successfully");

        // Retry the original request with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, remove tokens and redirect to login
        console.log("Token refresh failed - no new token received");
        removeAuthToken();
      }
    } else {
      // Refresh failed, remove tokens and redirect to login
      console.log("Token refresh failed - refresh request failed");
      removeAuthToken();
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Product", "Cart", "Order"],
  endpoints: () => ({}),
});
