"use client";
import { useState, useEffect } from "react";
import { Product, SearchFilters, ApiError } from "../types";
import { productsApi } from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const ITEMS_PER_PAGE = 12;

export function useProducts() {
  const { user, initializing } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(!user || initializing);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);
  const [currentSearchQuery, setCurrentSearchQuery] = useState<string>("");

  // Get paginated products for current page
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching all products...");
      const response = await productsApi.getAll();

      if (!response || !response.products) {
        throw new Error("Invalid response format from server");
      }

      setAllProducts(response.products);
      setFilteredProducts(response.products);
      const newTotalPages = Math.max(
        1,
        Math.ceil(response.products.length / itemsPerPage)
      );
      console.log("All products loaded:", {
        total: response.products.length,
        itemsPerPage,
        totalPages: newTotalPages,
      });
      setTotalPages(newTotalPages);
    } catch (error: unknown) {
      console.error("Error fetching products:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to fetch products";
      setError(errorMessage);
      setAllProducts([]);
      setFilteredProducts([]);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (filters: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentSearchQuery(filters.query || "");

      let filtered = [...allProducts];

      if (filters.query) {
        const searchQuery = filters.query.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery) ||
            product.description.toLowerCase().includes(searchQuery) ||
            product.category.toLowerCase().includes(searchQuery)
        );
      }

      if (filters.category) {
        filtered = filtered.filter(
          (product) =>
            product.category.toLowerCase() === filters.category?.toLowerCase()
        );
      }

      if (filters.minPrice) {
        filtered = filtered.filter(
          (product) => product.price >= (filters.minPrice || 0)
        );
      }

      if (filters.maxPrice) {
        filtered = filtered.filter(
          (product) => product.price <= (filters.maxPrice || Infinity)
        );
      }

      setFilteredProducts(filtered);
      const newTotalPages = Math.max(
        1,
        Math.ceil(filtered.length / itemsPerPage)
      );
      console.log("Setting total pages:", {
        filteredLength: filtered.length,
        itemsPerPage,
        totalPages: newTotalPages,
      });
      setTotalPages(newTotalPages);
      setCurrentPage(1); // Reset to first page when search changes
    } catch (error) {
      console.error("Search error:", error);
      setError("Search failed");
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const aiSearch = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await productsApi.aiSearch(query);
      if (result?.products) {
        setFilteredProducts(result.products);
        const newTotalPages = Math.max(
          1,
          Math.ceil(result.products.length / itemsPerPage)
        );
        setTotalPages(newTotalPages);
        setCurrentPage(1);
      }
      return result;
    } catch (error: unknown) {
      console.error("AI Search error:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "AI Search failed";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !initializing) {
      fetchProducts();
    }
  }, [user, initializing]);

  return {
    products: getCurrentPageProducts(),
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    currentSearchQuery,
    fetchProducts,
    searchProducts,
    aiSearch,
    setCurrentPage: (page: number) => {
      if (page !== currentPage && page > 0 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
  };
}
