import React from "react";
import { Product } from "../types";
import ProductLink from "./ProductLink";

interface AgentBubbleProps {
  message: string;
  suggestedProducts?: Product[];
  pinnedProduct: string | null;
  onProductPin: (productName: string) => void;
}

const AgentBubble: React.FC<AgentBubbleProps> = ({
  message,
  suggestedProducts,
  pinnedProduct,
  onProductPin,
}) => (
  <div className="flex justify-start mb-2">
    <div className="max-w-[85%]">
      <div className="rounded-t-xl rounded-br-xl rounded-bl-sm bg-gray-100 p-3 text-gray-800 shadow-sm">
        {message}
      </div>
      {suggestedProducts && suggestedProducts.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 font-medium mb-2">
            Recommended products:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedProducts.map((product, idx) => (
              <ProductLink
                key={idx}
                product={product}
                isPinned={pinnedProduct === product.name}
                onPin={onProductPin}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default AgentBubble;
