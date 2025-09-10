import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AboutContainer from "../components/AboutItem";
import SingleItem from "../components/SingleItem";
import Recommended from "../components/Recommended";
import Feed from "../components/Feed";
import SocketProvider from "../components/SocketProvider";

import {
  loginWithTeaAppUser,
  isAuthenticated,
  getCurrentUser,
} from "../lib/auth";

export default function SingleProductPage() {
  const { key } = useParams(); // Get product ID from URL
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);

  // Debug: log the product ID
  console.log("Product ID from URL:", key);

  // Fetch product data
  const fetchProduct = async (productKey) => {
    try {
      const base = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
      const response = await axios.get(`${base}/teas/${productKey}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    if (key) {
      fetchProduct(key);
    }
  }, [key]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("=== Starting authentication process ===");

        // Check tokens first
        const teaAppToken = localStorage.getItem("token");
        const reviewsToken = localStorage.getItem("accessToken");
        console.log("Tea App Token:", teaAppToken ? "Present" : "Missing");
        console.log("Reviews Token:", reviewsToken ? "Present" : "Missing");

        // Check if user is already authenticated with reviews backend
        if (!isAuthenticated()) {
          console.log("No reviews token found, setting up authentication...");

          // Check if we have tea-app token
          if (!teaAppToken) {
            console.log("No tea-app token found. User needs to login first.");
            setUser(null);
            setIsLoading(false);
            return;
          }

          // Try to bridge the authentication from tea-app to reviews backend
          try {
            console.log("Attempting to bridge authentication...");
            await loginWithTeaAppUser();
            console.log(
              "Successfully bridged authentication to reviews backend"
            );
          } catch (authError) {
            console.log("Failed to bridge authentication:", authError.message);
            console.error("Bridge error details:", authError);
          }
        }

        // Get current user info
        console.log("Getting current user...");
        const currentUser = await getCurrentUser();
        console.log("Current user:", currentUser);

        // Enable reviews if user has reviews token or is authenticated with tea-app
        if (currentUser) {
          const reviewsEnabled = isAuthenticated();
          console.log("Reviews enabled:", reviewsEnabled);
          setUser({
            ...currentUser,
            isReviewsEnabled: reviewsEnabled,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        // Still try to get a user from tea-app if available
        try {
          const currentUser = await getCurrentUser();
          console.log("Fallback user:", currentUser);
          if (currentUser) {
            setUser({
              ...currentUser,
              isReviewsEnabled: false, // No reviews if main auth failed
            });
          } else {
            setUser(null);
          }
        } catch (fallbackError) {
          console.error("Fallback authentication also failed:", fallbackError);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);
  if (isLoading) {
    return (
      <main className="max-w-320 mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-320 mx-auto">
      <SingleItem />
      <AboutContainer />
      <Recommended />

      {/* Reviews Component with Socket Provider */}
      <SocketProvider>
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Product Reviews {product?.name && `- ${product.name}`}
          </h2>

          <Feed
            currentUser={
              user
                ? {
                    _id: user._id,
                    username: user.username,
                    profilePicture: null,
                  }
                : {
                    _id: "anonymous",
                    username: "Anonymous User",
                    profilePicture: null,
                  }
            }
            postId={key || "default-product"} // Use actual product ID
          />
        </div>
      </SocketProvider>
    </main>
  );
}
