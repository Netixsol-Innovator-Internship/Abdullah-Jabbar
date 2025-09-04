// ProductCard.tsx
import Link from "next/link";
import { Star } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  discount?: number;
}

export default function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  discount,
}: ProductCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <Link href={`/product/${id}`} className="group">
      <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="font-medium text-black mb-2 group-hover:text-gray-700 transition-colors">
        {name}
      </h3>
      <div className="flex items-center mb-2">
        <div className="flex items-center mr-2">{renderStars(rating)}</div>
        <span className="text-sm text-gray-600">{rating}/5</span>
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
