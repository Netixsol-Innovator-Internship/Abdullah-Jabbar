"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ChatBot from "../components/ChatBot";

export default function Home() {
  const { user, loading, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !initializing && !user) {
      router.push("/login");
    }
  }, [user, loading, initializing, router]);

  if (loading || initializing) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Smart Healthcare
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find the right healthcare products with AI-powered recommendations
          </p>
          <SearchBar />
        </div>
        <ProductList />
      </div>
      {/* Global AI Assistant */}
      <ChatBot />
    </div>
  );
}
