import { apiSlice } from "./apiSlice";
import { Product } from "./productsApiSlice";

// Define cart interfaces with backend compatibility
export interface CartItem {
  productId: string;
  quantity: number;
  qty?: number; // Backend uses qty field
  product?: Product;
  price?: number;
}

export interface Cart {
  _id?: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

// Define the cart API slice
export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, { sessionId?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.sessionId) queryParams.append("sessionId", params.sessionId);

        return {
          url: `/cart?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<
      Cart,
      { productId: string; quantity: number; sessionId?: string }
    >({
      query: (data) => ({
        url: "/cart/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation<
      Cart,
      { itemId: string; quantity: number; sessionId?: string }
    >({
      query: (data) => ({
        url: "/cart/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation<
      Cart,
      { itemId: string; sessionId?: string }
    >({
      query: (data) => ({
        url: "/cart/remove",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<{ success: boolean }, { sessionId?: string }>({
      query: (data) => ({
        url: "/cart/clear",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

// Export the hooks
export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApiSlice;
