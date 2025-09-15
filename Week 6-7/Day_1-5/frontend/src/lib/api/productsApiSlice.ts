import { apiSlice } from "./apiSlice";

// Define product interfaces
export interface ProductImage {
  url: string;
  alt?: string;
  order?: number;
}

export interface Product {
  _id: string;
  slug: string;
  title: string;
  shortDescription?: string;
  description?: string;
  categories: string[];
  tags: string[];
  images: ProductImage[];
  defaultVariantId?: string;
  variants: string[];
  basePrice: string | number | { $numberDecimal?: string };
  currency: string;
  salePrice?: string | number | { $numberDecimal?: string };
  discountPercent?: number;
  isOnSale?: boolean;
  saleStartsAt?: string;
  saleEndsAt?: string;
  availableColors?: string[];
  availableSizes?: string[];
  ratingAverage?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  stockStatus?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;

  // Convenience fields used in UI components (may be derived from other fields)
  name?: string;
  imageUrl?: string;
  price?: number;

  featuredImage?: string;   // ✅ add this
}

// Helper to safely parse price values that may be strings, numbers, or
// MongoDB Decimal128 serialized objects like { $numberDecimal: "12.34" }
export function parsePrice(value: unknown): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number.parseFloat(value) || 0;
  if (typeof value === "object") {
    // handle Decimal128 JSON shape
    const obj = value as Record<string, unknown>;
    const numDecimal = obj["$numberDecimal"];
    if (typeof numDecimal === "string")
      return Number.parseFloat(numDecimal) || 0;
    // fallback to calling toString if available
    const toStr = (obj as { toString?: () => string }).toString;
    if (typeof toStr === "function") return Number.parseFloat(toStr()) || 0;
  }
  return 0;
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

// Define the products API slice
export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      ProductsResponse,
      {
        page?: number;
        limit?: number;
        colors?: string | string[];
        sizes?: string | string[];
        minPrice?: number;
        maxPrice?: number;
        isOnSale?: boolean;
        isNewArrival?: boolean;
        isFeatured?: boolean;
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.colors) {
          const colors = Array.isArray(params.colors)
            ? params.colors
            : [params.colors];
          colors.forEach((color) => queryParams.append("colors", color));
        }
        if (params.sizes) {
          const sizes = Array.isArray(params.sizes)
            ? params.sizes
            : [params.sizes];
          sizes.forEach((size) => queryParams.append("sizes", size));
        }
        if (params.minPrice)
          queryParams.append("minPrice", params.minPrice.toString());
        if (params.maxPrice)
          queryParams.append("maxPrice", params.maxPrice.toString());
        if (params.isOnSale !== undefined)
          queryParams.append("isOnSale", params.isOnSale.toString());
        if (params.isNewArrival !== undefined)
          queryParams.append("isNewArrival", params.isNewArrival.toString());
        if (params.isFeatured !== undefined)
          queryParams.append("isFeatured", params.isFeatured.toString());

        return {
          url: `/products?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),

    getProductBySlug: builder.query<Product, string>({
      query: (slug) => ({
        url: `/products/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [
        { type: "Product" as const, id: slug },
      ],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => ({
        url: `/products/id/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Product" as const, id }],
    }),

    createProduct: builder.mutation<
      Product,
      {
        title: string;
        slug: string;
        shortDescription?: string;
        description?: string;
        categories?: string[];
        tags?: string[];
        images?: ProductImage[];
        basePrice?: string;
        salePrice?: string;
        currency?: string;
        stockStatus?: string;
        ratingAverage?: number;
        reviewCount?: number;
        isFeatured?: boolean;
        isNewArrival?: boolean;
        isOnSale?: boolean;
      }
    >({
      query: (data) => ({
        url: `/products`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Product" as const, id: "LIST" },
        { type: "Product" as const, id: "FEATURED" },
        { type: "Product" as const, id: "NEW_ARRIVALS" },
      ],
    }),

    updateProduct: builder.mutation<
      Product,
      { id: string; data: Partial<Product> }
    >({
      query: ({ id, data }) => ({
        url: `/products/id/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product" as const, id },
        { type: "Product" as const, id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/products/id/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product" as const, id },
        { type: "Product" as const, id: "LIST" },
        { type: "Product" as const, id: "FEATURED" },
        { type: "Product" as const, id: "NEW_ARRIVALS" },
      ],
    }),

    // Add more product-related endpoints as needed

    // Convenience endpoints for specific product sections
    getNewArrivals: builder.query<ProductsResponse, { limit?: number }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append("isNewArrival", "true");
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `/products?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product" as const, id: "NEW_ARRIVALS" },
            ]
          : [{ type: "Product" as const, id: "NEW_ARRIVALS" }],
    }),

    getFeaturedProducts: builder.query<ProductsResponse, { limit?: number }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append("isFeatured", "true");
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `/products?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product" as const, id: "FEATURED" },
            ]
          : [{ type: "Product" as const, id: "FEATURED" }],
    }),
  }),
});

// Export the hooks
export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetNewArrivalsQuery,
  useGetFeaturedProductsQuery,
} = productsApiSlice;
