// ProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Product, parsePrice } from "@/lib/api/productsApiSlice";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  discount?: number;
  slug?: string;
}

// Helper function to transform backend Product to ProductCard props
export const transformProductToCardProps = (
  product: Product
): ProductCardProps => {
  const basePrice = parsePrice(product.basePrice);
  const salePrice = product.salePrice ? parsePrice(product.salePrice) : null;
  const originalPrice = product.isOnSale && salePrice ? basePrice : undefined;
  const finalPrice = salePrice || basePrice;

  return {
    id: product._id,
    slug: product.slug,
    name: product.title,
    image: product.images?.[0]?.url || "/placeholder.svg",
    price: finalPrice,
    originalPrice,
    rating: product.ratingAverage || 0,
    reviewCount: product.reviewCount || 0,
    discount: product.discountPercent || undefined,
  };
};

export default function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  discount,
  slug,
}: ProductCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  // Use slug if available, otherwise fall back to id
  const href = slug ? `/product/${slug}` : `/product/${id}`;

  return (
    <Link href={href} className="group">
      <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="font-medium text-black mb-2 group-hover:text-gray-700 transition-colors">
        {name}
      </h3>
      <div className="flex items-center mb-2">
        <div className="flex items-center mr-2">{renderStars(rating)}</div>
        <span className="text-sm text-gray-600">
          {reviewCount > 0 ? `${rating}` : "No reviews yet"}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold text-black">${price}</span>
        {originalPrice && (
          <>
            <span className="text-lg text-gray-500 line-through">
              ${originalPrice}
            </span>
            {discount && (
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                -{discount}%
              </span>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
