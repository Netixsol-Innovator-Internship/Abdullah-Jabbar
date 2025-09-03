"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ImageGalleryProps {
  mainImage: string;
  thumbnails: string[];
  title: string;
  status?: string;
}

export function ImageGallery({
  mainImage,
  thumbnails,
  title,
  status,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage);

  return (
    <div className="space-y-4">
      <div className="bg-[#4A5FBF] text-white p-3 rounded-t-lg flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <Star className="w-5 h-5" />
      </div>

      <div className="relative">
        {status && (
          <Badge className="absolute top-2 left-2 z-10 bg-red-500">
            {status}
          </Badge>
        )}
        <img
          src={selectedImage || "/placeholder.svg"}
          alt={title}
          className="w-full h-80 object-cover rounded-lg"
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {thumbnails.map((thumb, index) => (
          <img
            key={index}
            src={thumb || "/placeholder.svg"}
            alt={`${title} ${index + 1}`}
            className={`w-full h-20 object-cover rounded cursor-pointer border-2 ${
              selectedImage === thumb ? "border-[#4A5FBF]" : "border-gray-200"
            }`}
            onClick={() => setSelectedImage(thumb)}
          />
        ))}
      </div>
    </div>
  );
}
