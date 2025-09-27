"use client";
import { useState } from "react";
import { Product } from "../types";
import ChatBot from "./ChatBot";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="bg-gradient-to-br from-blue-50 to-green-50 py-.5 ">
          <div className="flex items-center justify-between">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded ">
              {product.category}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
            {product.name}
          </h3>
          <div className="w-full flex justify-end mb-1">
            <span className="text-sm text-white bg-blue-300 px-2 py-0.5 rounded-md inline-block">
              {product.brand}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price floated right (compact) — other elements will flow to the left and under it */}
          <div className="overflow-hidden">
            <div className="float-right w-fit py-1 rounded-md ml-3">
              <span className="text-2xl font-bold text-green-600">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {product.dosage && (
              <p className="text-xs text-gray-600 mb-2">
                <strong>Dosage:</strong> {product.dosage}
              </p>
            )}

            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-gray-600 mb-1">
                  <strong>Key Ingredients:</strong>
                </p>
                <div className="flex flex-wrap gap-1">
                  {product.ingredients.slice(0, 3).map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {ingredient}
                    </span>
                  ))}
                  {product.ingredients.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{product.ingredients.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex space-x-2 ">
            <button
              onClick={() => setShowChat(true)}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Ask AI
            </button>
          </div>
        </div>
      </div>

      {showChat && <ChatBot productName={product.name} />}
    </>
  );
}
