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
  // Support both `addressLine1` and older `street1` field used in the UI
  addressLine1?: string;
  street1?: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total?: { $numberDecimal?: string } | number; // Decimal128 or number
  totalAmount?: number; // Alternative field
  subtotal?: { $numberDecimal?: string } | number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  orderNumber?: string;
  paymentStatus: "pending" | "paid" | "failed" | string;
  fulfillmentStatus:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | string;
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
    getOrders: builder.query<
      OrdersResponse,
      { page?: number; limit?: number; userId?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.userId) queryParams.append("userId", params.userId);

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
    }),

    // Get orders by user ID (alternative approach for better ObjectID handling)
    getUserOrders: builder.query<
      OrdersResponse,
      { page?: number; limit?: number; userId: string }
    >({
      query: ({ userId, page = 1, limit = 10 }) => {
        return {
          url: `/orders/user/${userId}?page=${page}&limit=${limit}`,
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
    }),

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
        cartId?: string;
        sessionId?: string;
        shippingAddress: ShippingAddress;
        paymentMethod: string;
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
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useGetUserOrdersQuery,
} = ordersApiSlice;

// Export the getOrders hook separately to avoid naming conflicts
export const { useGetOrdersQuery: useGetAllOrdersQuery } = ordersApiSlice;
