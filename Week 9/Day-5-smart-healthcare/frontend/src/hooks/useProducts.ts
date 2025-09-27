"use client";
import { useState, useEffect } from "react";
import { Product, SearchFilters, ApiError } from "../types";
import { productsApi } from "../services/api";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 12; // Adjust this value as needed

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);

  const fetchProducts = async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.getAll(page, itemsPerPage);
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to fetch products";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (filters: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.search({
        ...filters,
        page: currentPage,
        limit: itemsPerPage,
      });
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || "Search failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const aiSearch = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await productsApi.aiSearch(query);
      setProducts(result.products || []);
      setTotalPages(1); // AI search doesn't support pagination yet
      return result;
    } catch (error: unknown) {
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
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    fetchProducts,
    searchProducts,
    aiSearch,
    setCurrentPage: (page: number) => {
      if (page !== currentPage) {
        fetchProducts(page);
      }
    },
  };
}
