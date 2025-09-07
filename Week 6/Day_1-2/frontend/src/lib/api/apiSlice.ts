import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "@/lib/auth-utils";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://abdullah-week6-backend.vercel.app";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
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
  }),
  tagTypes: ["User", "Product", "Cart", "Order"],
  endpoints: () => ({}),
});
