import { apiSlice } from "./apiSlice";

// Define order interfaces
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  totalOrders: number;
  totalPages: number;
}

// Define the orders API slice
export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrdersResponse, { page?: number; limit?: number }>(
      {
        query: (params) => {
          const queryParams = new URLSearchParams();
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());

          return {
            url: `/orders?${queryParams.toString()}`,
            method: "GET",
          };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.orders.map(({ _id }) => ({
                  type: "Order" as const,
                  id: _id,
                })),
                { type: "Order" as const, id: "LIST" },
              ]
            : [{ type: "Order" as const, id: "LIST" }],
      }
    ),

    getOrderById: builder.query<Order, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Order" as const, id }],
    }),

    createOrder: builder.mutation<
      Order,
      {
        items?: OrderItem[];
        shippingAddress: ShippingAddress;
        paymentMethod: string;
        sessionId?: string;
      }
    >({
      query: (data) => ({
        url: "/orders/checkout",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order", "Cart"],
    }),

    // Add more order-related endpoints as needed
  }),
});

// Export the hooks
export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
} = ordersApiSlice;
