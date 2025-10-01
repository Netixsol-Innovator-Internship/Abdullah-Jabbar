"use client";
import { Product } from "../types";
import { useChatBot } from "../context/ChatBotContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { openChatWithProduct } = useChatBot();

  return (
<>
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
    {/* Top category */}
    <div className="bg-gradient-to-br from-blue-50 to-green-50 py-0.5 px-2">
      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
        {product.category}
      </span>
    </div>

    {/* Content */}
    <div className="p-4 flex flex-col flex-grow">
      {/* Name + brand logic */}
      <div className="mb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          {/* Brand sits right if name is short */}
          <span className="text-sm text-white bg-blue-300 px-2 py-0.5 rounded-md shrink-0 ml-2">
            {product.brand}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
        {product.description}
      </p>

      {/* Price floated right + details */}
      <div className="overflow-hidden mb-3">
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
              {product.ingredients.slice(0, 6).map((ingredient, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {ingredient}
                </span>
              ))}
              {product.ingredients.length > 6 && (
                <span className="text-xs text-gray-500">
                  +{product.ingredients.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CTA pinned bottom */}
      <div className="mt-auto">
        <button
          onClick={() => openChatWithProduct(product.name, product._id)}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
        >
          Ask AI
        </button>
      </div>
    </div>
  </div>
</>
  );
}
