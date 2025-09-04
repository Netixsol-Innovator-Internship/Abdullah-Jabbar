// ReviewsSlider.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    name: "Alex K.",
    rating: 5,
    text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
  },
  {
    name: "James L.",
    rating: 5,
    text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    name: "Moona R.",
    rating: 5,
    text: "Absolutely love the variety and fit. Shipping was quick and everything feels premium. Will definitely be ordering again soon!",
  },
  {
    name: "David P.",
    rating: 5,
    text: "Customer service was outstanding and the clothing quality unmatched. Highly recommend Shop.co to anyone.",
  },
];

export default function ReviewsSlider() {
  // index refers to first visible slide
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const interactionRef = useRef(false);

  // Determine how many cards fit (1 / 2 / 3)
  const computeVisible = useCallback(() => {
    const w = window.innerWidth;
    if (w >= 1280) return 5; // xl and up: show 5
    if (w >= 1024) return 4; // lg: show 4
    if (w >= 640) return 2; // sm: show 2
    return 1; // mobile
  }, []);

  useEffect(() => {
    setVisibleCount(computeVisible());
    const handle = () => setVisibleCount(computeVisible());
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, [computeVisible]);

  const maxIndex = Math.max(testimonials.length - visibleCount, 0);

  const clamp = useCallback(
    (i: number) => {
      if (i < 0) return maxIndex;
      if (i > maxIndex) return 0; // simple wrap
      return i;
    },
    [maxIndex]
  );

  const goTo = useCallback(
    (i: number) => {
      setIndex(clamp(i));
    },
    [clamp]
  );

  const next = useCallback(() => {
    setIndex((prev) => clamp(prev + 1));
  }, [clamp]);

  const prev = useCallback(() => {
    setIndex((prev) => clamp(prev - 1));
  }, [clamp]);

  // Scroll to current index
  useEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const child = track.children[index] as HTMLElement | undefined;
    if (!child) return;
    track.scrollTo({
      left: child.offsetLeft,
      behavior: interactionRef.current ? "smooth" : "auto",
    });
  }, [index, visibleCount]);

  // Autoplay (optional) - change interval as needed
  useEffect(() => {
    const id = setInterval(() => {
      if (!interactionRef.current) next();
    }, 6000);
    return () => clearInterval(id);
  }, [next]);

  // Pause autoplay while hovering/focusing
  const pause = () => {
    interactionRef.current = true;
  };
  const resume = () => {
    interactionRef.current = false;
  };

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      interactionRef.current = true;
      next();
    } else if (e.key === "ArrowLeft") {
      interactionRef.current = true;
      prev();
    }
  };

  // Drag / swipe
  const pointer = useRef<{
    startX: number;
    scrollLeft: number;
    active: boolean;
  } | null>(null);

  const startDrag = (x: number) => {
    if (!trackRef.current) return;
    pointer.current = {
      startX: x,
      scrollLeft: trackRef.current.scrollLeft,
      active: true,
    };
    interactionRef.current = true;
  };
  const moveDrag = (x: number) => {
    if (!pointer.current?.active || !trackRef.current) return;
    const delta = x - pointer.current.startX;
    trackRef.current.scrollLeft = pointer.current.scrollLeft - delta;
  };
  const endDrag = () => {
    if (!pointer.current || !trackRef.current) return;
    const track = trackRef.current;
    // Find closest slide
    const children = Array.from(track.children) as HTMLElement[];
    let closest = index;
    let min = Infinity;
    children.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - track.scrollLeft);
      if (d < min) {
        min = d;
        closest = i;
      }
    });
    setIndex(clamp(closest));
    pointer.current.active = false;
    // Resume autoplay after short delay
    setTimeout(() => {
      interactionRef.current = false;
    }, 2500);
  };

  return (
    <section
      className="py-16"
      aria-label="Customer testimonials carousel"
      onKeyDown={onKeyDown}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header with buttons */}
        <div className="flex items-center justify-between mb-10 relative z-20">
          <h2 className="text-3xl font-extrabold tracking-tight text-black">
            OUR HAPPY CUSTOMERS
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Previous testimonials"
              onClick={() => {
                interactionRef.current = true;
                prev();
              }}
              className="h-9 w-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next testimonials"
              onClick={() => {
                interactionRef.current = true;
                next();
              }}
              className="h-9 w-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition"
            >
              →
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocus={pause}
          onBlur={resume}
        >
          {/* Track */}
          <div
            ref={trackRef}
            role="list"
            aria-live="polite"
            className="relative z-0 flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 px-6 lg:px-12 xl:px-28
          select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              startDrag(e.clientX);
            }}
            onPointerMove={(e) => moveDrag(e.clientX)}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onTouchStart={(e) => startDrag(e.touches[0].clientX)}
            onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
            onTouchEnd={endDrag}
          >
            {testimonials.map((t, i) => (
              <article
                key={i}
                role="listitem"
                aria-label={`Testimonial ${i + 1} of ${testimonials.length}`}
                tabIndex={0}
                className="snap-center shrink-0 
              w-[85%] sm:w-[60%] md:w-[45%] lg:w-[30%] 
              bg-white p-6 rounded-xl border border-gray-200 shadow-sm
              transition-shadow hover:shadow-md focus-within:shadow-md"
              >
                <div
                  className="flex items-center gap-1 mb-3"
                  aria-label={`${t.rating} star rating`}
                >
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star
                      key={j}
                      className={`w-5 h-5 ${
                        j < t.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="font-semibold text-black mb-2">{t.name}</p>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {t.text}
                </p>
              </article>
            ))}
          </div>

          {/* blur overlays */}
          <div
            className="pointer-events-none absolute left-0 top-0 h-full 
                w-16 sm:w-20 md:w-28 lg:w-32 bg-white/70 z-10"
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-full 
                w-16 sm:w-20 md:w-28 lg:w-32 bg-white/70 z-10"
          />

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-4 relative z-20">
            {Array.from({
              length: Math.max(testimonials.length - visibleCount + 1, 1),
            }).map((_, dot) => {
              const active = index === dot;
              return (
                <button
                  key={dot}
                  aria-label={`Go to slide ${dot + 1}`}
                  onClick={() => {
                    interactionRef.current = true;
                    goTo(dot);
                  }}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    active
                      ? "bg-black"
                      : "bg-gray-300 hover:bg-gray-400 focus-visible:bg-gray-500"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
