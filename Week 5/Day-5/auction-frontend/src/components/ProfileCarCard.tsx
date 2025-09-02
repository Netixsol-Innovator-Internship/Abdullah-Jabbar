'use client'
import React from "react"
import { Star, Clock } from "lucide-react"
import type { Car } from "@/types/car"

type Variant = "mycars" | "bids" | "wishlist"

type Props = {
  car: Car
  variant?: Variant
  onAction?: (car: Car) => void
}

export function CarCard({ car, variant = "mycars", onAction }: Props) {
  const renderBadge = () =>
    car.badge ? (
      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">{car.badge}</span>
    ) : null

  const renderImage = () => (
    <div className={`${variant === "wishlist" ? "h-44" : variant === "bids" ? "h-40" : "h-28"} bg-gray-100 rounded overflow-hidden border`}>
      <img src={car.image} alt={car.title} className="w-full h-full object-cover" />
    </div>
  )

  const actionLabel =
    variant === "mycars" ? (car.status === "active" ? "End Bid" : "Sold") : "Submit A Bid"

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="p-4">
        <div className="relative">
          {renderImage()}
          <div className="absolute top-3 right-3">
            <div className="bg-white rounded-full p-1 border">
              <Star size={14} className="text-yellow-400" />
            </div>
          </div>
          {car.badge && <div className="absolute top-3 left-3">{renderBadge()}</div>}
        </div>

        <h3 className="mt-3 text-sm font-medium text-[#15306B]">{car.title}</h3>

        {/* Pricing badges */}
        <div className="mt-3 flex gap-3 items-center">
          {car.winningBid && (
            <div className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded text-sm">
              {car.winningBid}
              <div className="text-xs text-gray-400">Winning Bid</div>
            </div>
          )}
          {car.currentBid && (
            <div
              className={`px-3 py-2 rounded text-sm ${
                variant === "bids" ? "bg-green-50 text-green-700" : "bg-pink-50 text-pink-700"
              }`}
            >
              {car.currentBid}
              <div className="text-xs text-gray-400">{variant === "bids" ? "Your Current Bid" : "Current Bid"}</div>
            </div>
          )}
        </div>

        {/* meta row */}
        <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <div>
              {car.timeLeft?.days}d {car.timeLeft?.hours}h {car.timeLeft?.mins ?? 0}m
            </div>
          </div>
          <div>{car.totalBids} Total Bids</div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => onAction?.(car)}
            className={`w-full rounded py-2 text-white ${variant === "wishlist" ? "bg-white text-[#27346A] border border-[#27346A]" : "bg-[#27346A]"}`}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}