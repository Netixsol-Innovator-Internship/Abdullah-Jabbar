import { useGetProductByIdQuery, parsePrice } from "@/lib/api/productsApiSlice";
import { useMemo } from "react";

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartTotals {
  subtotal: number;
  isLoading: boolean;
  error: boolean;
}

export function useCartTotals(cartItems: CartItem[]): CartTotals {
  // Create stable product IDs array
  const productIds = useMemo(
    () => cartItems.map((item) => item.productId),
    [cartItems]
  );

  // Use conditional queries based on whether we have items
  const productQueries = productIds.map((productId) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGetProductByIdQuery(productId, { skip: !productId })
  );

  const isLoading = productQueries.some((query) => query.isLoading);
  const error = productQueries.some((query) => query.isError);

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item, index) => {
      const productQuery = productQueries[index];
      if (!productQuery.data) return total;

      const product = productQuery.data;
      const price = product.salePrice
        ? parsePrice(product.salePrice)
        : product.basePrice
          ? parsePrice(product.basePrice)
          : 0;

      return total + price * item.quantity;
    }, 0);
  }, [cartItems, productQueries]);

  return {
    subtotal,
    isLoading,
    error,
  };
}
