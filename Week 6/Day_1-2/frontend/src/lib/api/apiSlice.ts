import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage or other storage
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

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
