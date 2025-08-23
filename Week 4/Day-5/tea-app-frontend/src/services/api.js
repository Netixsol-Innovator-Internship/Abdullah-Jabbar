import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Backend base URL
const baseUrl = "https://week4-day5-tea-app-backend.vercel.app/api";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Tea"],
  endpoints: (builder) => ({
    // ----- USER ENDPOINTS -----
    signup: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "/auth/all-users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/auth/delete-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/auth/update-user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // ----- TEA ENDPOINTS -----
    createTea: builder.mutation({
      query: (teaData) => ({
        url: "/teas",
        method: "POST",
        body: teaData,
      }),
      invalidatesTags: ["Tea"],
    }),
    getTeas: builder.query({
      query: () => "/teas",
      providesTags: ["Tea"],
    }),
    getTeaById: builder.query({
      query: (id) => `/teas/${id}`,
      providesTags: ["Tea"],
    }),
    updateTea: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/teas/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Tea"],
    }),
    deleteTea: builder.mutation({
      query: (id) => ({
        url: `/teas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tea"],
    }),
  }),
});

export const {
  // User hooks
  useSignupMutation,
  useLoginMutation,
  useGetProfileQuery,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,

  // Tea hooks
  useCreateTeaMutation,
  useGetTeasQuery,
  useGetTeaByIdQuery,
  useUpdateTeaMutation,
  useDeleteTeaMutation,
} = api;
