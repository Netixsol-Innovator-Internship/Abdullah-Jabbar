'use client';
import { useGameStore } from "../store/useGameStore";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";

export default function FeaturedSlider() {
  const featured = useGameStore((s) => s.featured);

  return (
    <div id="featured" className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        breakpoints={{
          640: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {featured.map((game) => (
          <SwiperSlide key={game.id}>
            <div className="bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800">
              <div className="relative aspect-[16/9]">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold line-clamp-1">{game.title}</h3>
                <p className="text-sm text-neutral-400 line-clamp-2 mt-1">
                  {game.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-neutral-300">{game.genre}</span>
                  <Link
                    href={`/games#${game.slug}`}
                    className="text-sm text-brand"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
