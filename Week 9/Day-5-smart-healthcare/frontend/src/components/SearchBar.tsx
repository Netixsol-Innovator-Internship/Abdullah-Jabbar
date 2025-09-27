"use client";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useProducts } from "../context/ProductsContext";
import toast from "react-hot-toast";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const { searchProducts, fetchProducts, loading } = useProducts();

  // Debounce the search so we don't call the API on every keystroke.
  useEffect(() => {
    const q = query.trim();

    // If empty, restore full product list
    if (!q) {
      // small microtask to avoid blocking render
      fetchProducts();
      return;
    }

    const id = setTimeout(() => {
      searchProducts({ query: q }).catch(() => {
        toast.error("Search failed. Please try again.");
      });
    }, 350);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // trigger an immediate search (cancel debounce)
    searchProducts({ query: query.trim() }).catch(() => {
      toast.error("Search failed. Please try again.");
    });
  };

  const handleClear = () => {
    setQuery("");
    fetchProducts();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "..." : "Search"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
