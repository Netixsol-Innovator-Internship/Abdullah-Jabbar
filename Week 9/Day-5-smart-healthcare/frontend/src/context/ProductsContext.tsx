"use client";
import { createContext, useContext } from "react";
import { useProducts as useProductsHook } from "../hooks/useProducts";
import { Product, SearchFilters, AiSearchResult } from "../types";

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  fetchProducts: (page?: number) => Promise<void>;
  searchProducts: (filters: SearchFilters) => Promise<void>;
  aiSearch: (query: string) => Promise<{ products: Product[] } | null>;
  setCurrentPage: (page: number) => void;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const productsData = useProductsHook();

  return (
    <ProductsContext.Provider value={productsData}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
