import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useGetProductByIdQuery, parsePrice } from "@/lib/api/productsApiSlice";

interface CartItemProps {
  productId: string;
  quantity: number;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemove: (productId: string) => void;
  onPriceCalculated?: (
    productId: string,
    price: number,
    quantity: number
  ) => void;
  isUpdating: boolean;
  isRemoving: boolean;
}

export default function CartItem({
  productId,
  quantity,
  onUpdateQuantity,
  onRemove,
  onPriceCalculated,
  isUpdating,
  isRemoving,
}: CartItemProps) {
  // Fetch product data
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId);

  // Calculate and report price when product data is available
  useEffect(() => {
    if (product && onPriceCalculated) {
      const price = product.salePrice
        ? parsePrice(product.salePrice)
        : product.basePrice
          ? parsePrice(product.basePrice)
          : 0;
      onPriceCalculated(productId, price, quantity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, productId, quantity]); // onPriceCalculated is stable due to useCallback

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4 p-6 border border-gray-200 rounded-lg">
        <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex items-center space-x-4 p-6 border border-gray-200 rounded-lg">
        <div className="w-24 h-24 bg-red-100 rounded-lg flex items-center justify-center">
          <span className="text-red-500 text-sm">Error</span>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-red-500 mb-2">Product not found</h3>
          <button
            onClick={() => onRemove(productId)}
            className="text-red-500 hover:text-red-700 transition-colors text-sm"
          >
            Remove from cart
          </button>
        </div>
      </div>
    );
  }

  const price = product.salePrice
    ? parsePrice(product.salePrice)
    : product.basePrice
      ? parsePrice(product.basePrice)
      : 0;
  const originalPrice =
    product.isOnSale && product.salePrice && product.basePrice
      ? parsePrice(product.basePrice)
      : null;
  const imageUrl = product.images?.[0]?.url || "/placeholder.svg";

  return (
    <div className="flex items-center space-x-4 p-6 border border-gray-200 rounded-lg">
      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={imageUrl}
          alt={product.title || "Product"}
          width={96}
          height={96}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-medium text-black mb-2">
          {product.title || "Product"}
        </h3>
        {product.availableSizes?.[0] && (
          <p className="text-sm text-gray-600 mb-1">
            Size: {product.availableSizes[0]}
          </p>
        )}
        {product.availableColors?.[0] && (
          <p className="text-sm text-gray-600 mb-3">
            Color: {product.availableColors[0]}
          </p>
        )}
        <p className="text-xl font-bold text-black">
          ${price.toFixed(2)}
          {originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
          {product.isOnSale && Number(product.discountPercent) > 0 && (
            <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
              -{product.discountPercent}%
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-gray-300 rounded-full">
          <button
            onClick={() => onUpdateQuantity(productId, quantity - 1)}
            className="p-2 hover:bg-gray-100 transition-colors rounded-l-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUpdating || quantity <= 1}
            title={
              quantity <= 1 ? "Minimum quantity is 1" : "Decrease quantity"
            }
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(productId, quantity + 1)}
            className="p-2 hover:bg-gray-100 transition-colors rounded-r-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUpdating}
            title="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => onRemove(productId)}
          className="text-red-500 hover:text-red-700 transition-colors"
          disabled={isRemoving}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
