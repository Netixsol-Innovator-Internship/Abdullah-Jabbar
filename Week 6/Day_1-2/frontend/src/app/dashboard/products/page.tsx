"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoreHorizontal, Plus, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGetProductsQuery, parsePrice } from "@/lib/api/productsApiSlice";
import { useState } from "react";

export default function AllProductsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const {
    data: productsResponse,
    isLoading,
    isError,
  } = useGetProductsQuery({ page, limit });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading products...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading products</p>
            <p className="text-gray-500 text-sm">Failed to fetch products</p>
          </div>
        </div>
      </div>
    );
  }

  const products = productsResponse?.items || [];
  const totalPages = Math.ceil((productsResponse?.total || 0) / limit);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <Breadcrumb
            items={[
              { label: "Home", href: "/dashboard" },
              { label: "All Products" },
            ]}
          />
        </div>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          ADD NEW PRODUCT
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          products.map((product) => (
            <Card key={product._id} className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0].url || "/placeholder.svg"}
                        alt={product.images[0].alt || product.title}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded"
                        unoptimized={true}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/dashboard/products/${product._id}`}
                      className="font-medium text-gray-900 hover:underline cursor-pointer"
                    >
                      {product.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {product.categories && product.categories.length > 0
                        ? product.categories[0]
                        : "Uncategorized"}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {product.currency}{" "}
                      {parsePrice(product.basePrice).toFixed(2)}
                      {product.isOnSale && product.salePrice && (
                        <span className="ml-2 text-xs text-green-600">
                          Sale: {product.currency}{" "}
                          {parsePrice(product.salePrice).toFixed(2)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Summary
                  </h4>
                  <p className="text-xs text-gray-500">
                    {product.shortDescription ||
                      product.description?.substring(0, 100) + "..." ||
                      "No description available"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reviews</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-3 h-3 text-orange-500" />
                      <span className="text-sm font-medium">
                        {product.reviewCount || 0} (
                        {product.ratingAverage?.toFixed(1) || "N/A"})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          product.stockStatus === "in_stock"
                            ? "bg-green-500"
                            : product.stockStatus === "low_stock"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm font-medium capitalize">
                        {product.stockStatus?.replace("_", " ") || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {product.isOnSale && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">On Sale</span>
                      <span className="text-sm font-medium text-green-600">
                        {product.discountPercent}% OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            PREV
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                className={page === pageNum ? "bg-gray-900 text-white" : ""}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}

          {totalPages > 5 && (
            <>
              <span className="text-gray-500">...</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            NEXT
          </Button>
        </div>
      )}
    </div>
  );
}
