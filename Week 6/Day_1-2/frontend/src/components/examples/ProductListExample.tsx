"use client";

import React from "react";
import { useGetProductsQuery } from "@/lib/api/productsApiSlice";
import { useGetCartQuery, useAddToCartMutation } from "@/lib/api/cartApiSlice";

export default function ProductListExample() {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  // Fetch products with RTK Query
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isProductsError,
    error: productsError,
  } = useGetProductsQuery({ page, limit });

  // Get cart data
  const { data: cartData, isLoading: isLoadingCart } = useGetCartQuery({});

  // Add to cart mutation
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  // Handle adding product to cart
  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart({
        productId,
        quantity: 1,
      }).unwrap();
      // Success message could be shown here
    } catch (error) {
      console.error("Failed to add item to cart", error);
    }
  };

  if (isLoadingProducts) {
    return <div className="p-4">Loading products...</div>;
  }

  if (isProductsError) {
    return (
      <div className="p-4 text-red-500">
        Error loading products: {JSON.stringify(productsError)}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {productsData?.items?.map((product) => (
          <div key={product._id} className="border rounded-lg p-4 shadow-sm">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover mb-2 rounded"
              />
            )}
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-gray-600 mb-2">
              ${((product.price ?? 0) as number).toFixed(2)}
            </p>
            <button
              onClick={() => handleAddToCart(product._id)}
              disabled={isAddingToCart}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-6">
        <div>
          <span className="mr-2">Items per page:</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border rounded p-1"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {page} of {Math.ceil((productsData?.total || 0) / limit) || 1}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={
              !productsData ||
              page >= Math.ceil((productsData?.total || 0) / limit)
            }
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="mt-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Cart Summary</h3>
        {isLoadingCart ? (
          <p>Loading cart...</p>
        ) : (
          <>
            <p>{cartData?.items.length || 0} item(s) in cart</p>
            <p className="font-bold">
              Total: ${cartData?.totalAmount.toFixed(2) || "0.00"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
