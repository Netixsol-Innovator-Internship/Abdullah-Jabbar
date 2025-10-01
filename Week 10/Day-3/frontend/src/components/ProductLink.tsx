import React, { useState } from "react";
import { Product } from "../types";

interface ProductLinkProps {
  product: Product;
  isPinned: boolean;
  onPin: (productName: string) => void;
}

const ProductLink: React.FC<ProductLinkProps> = ({
  product,
  isPinned,
  onPin,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync local expanded state with pinned state
  React.useEffect(() => {
    if (!isPinned && isExpanded) {
      // If this product is no longer pinned, collapse it
      setIsExpanded(false);
    }
  }, [isPinned, isExpanded]);

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    // Only close if not pinned
    if (!isPinned) {
      setIsExpanded(false);
    }
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to the main button
    onPin(product.name); // Notify parent to handle pinning logic

    // Handle expansion state based on current pin status
    if (isPinned) {
      // If currently pinned, unpinning will collapse it
      setIsExpanded(false);
    } else {
      // If not currently pinned, pinning will keep it expanded
      setIsExpanded(true);
    }
  };

  const handleMainClick = () => {
    // On mobile or when not using hover, toggle expansion
    if (!isPinned) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="relative">
      <div className="inline-flex items-center bg-white border border-indigo-200 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200">
        {/* Main product area - hoverable */}
        <div
          className="flex items-center gap-2 min-w-0 px-3 py-2 cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleMainClick}
        >
          <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
          <span className="text-sm font-medium text-gray-900 truncate">
            {product.name}
          </span>
          <span className="text-sm font-bold text-indigo-600 flex-shrink-0">
            ${product.price}
          </span>
        </div>

        {/* Chevron button - clickable pin/unpin */}
        <button
          className={`px-2 py-2 border-l border-gray-200 hover:bg-gray-50 transition-colors duration-200 rounded-r-lg ${
            isPinned
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
          onClick={handleChevronClick}
          title={isPinned ? "Unpin to close on hover out" : "Pin to keep open"}
        >
          <svg
            className={`w-3 h-3 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Expanded card on hover/click */}
      {isExpanded && (
        <div className="absolute bottom-full left-0 mb-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 animate-in fade-in-0 zoom-in-95 duration-200">
          <h4 className="font-semibold text-gray-900 text-sm mb-1">
            {product.name}
          </h4>
          <p className="text-xs text-gray-600 mb-2">
            {product.brand} • {product.category}
          </p>
          <p className="text-xs text-gray-700 mb-2 line-clamp-2">
            {product.description}
          </p>

          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-indigo-600">
              ${product.price}
            </span>
            {product.dosage && (
              <span className="text-xs text-gray-500">{product.dosage}</span>
            )}
          </div>

          {product.ingredients && product.ingredients.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Key ingredients:</p>
              <div className="flex flex-wrap gap-1">
                {product.ingredients.slice(0, 3).map((ingredient, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded"
                  >
                    {ingredient}
                  </span>
                ))}
                {product.ingredients.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{product.ingredients.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductLink;
