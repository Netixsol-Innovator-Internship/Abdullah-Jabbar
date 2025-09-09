import { apiSlice } from "./apiSlice";

export interface AddressData {
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
  addressIndex?: string; // For updating existing address
}

export interface User {
  _id: string;
  email: string;
  name?: string;
  roles: string[];
  phone?: string;
  avatarUrl?: string;
  addresses: AddressData[];
  loyaltyPoints: number;
  loyaltyTier?: string;
  isEmailVerified: boolean;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    testConnection: builder.query<{ message: string; userId: string }, void>({
      query: () => ({
        url: "/users/test",
        method: "GET",
      }),
    }),
    updateUserAddress: builder.mutation<User, AddressData>({
      query: (addressData) => ({
        url: "/users/me/address",
        method: "PUT",
        body: addressData,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUserAddress: builder.mutation<User, number>({
      query: (addressIndex) => ({
        url: `/users/me/address/${addressIndex}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useTestConnectionQuery,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
} = usersApiSlice;
