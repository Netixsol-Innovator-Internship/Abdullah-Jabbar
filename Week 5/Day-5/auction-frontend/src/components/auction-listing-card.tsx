import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star} from "lucide-react"
import Link from "next/link"

export interface AuctionListingCardProps {
  id: string
  name: string
  image: string
  price: string
  totalBids: number
  timeLeft: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
  endTime: string
  rating: number
  description: string
  status?: "trending" | "ending" | "new" | null
}

export function AuctionListingCard({
  id,
  name,
  image,
  price,
  totalBids,
  timeLeft,
  endTime,
  rating,
  description,
  status,
}: AuctionListingCardProps) {
  return (
    <Card className="overflow-hidden bg-white">
      <div className="flex">
        {/* Left: Car Image */}
        <div className="relative w-64 h-32 flex-shrink-0">
          {status && (
            <Badge
              className={`absolute top-2 left-2 z-10 text-xs ${
                status === "trending" ? "bg-red-500" : status === "ending" ? "bg-orange-500" : "bg-green-500"
              }`}
            >
              {status}
            </Badge>
          )}
          <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        </div>

        {/* Middle: Car Details */}
        <div className="flex-1 p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-900">{name}</h3>

          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
            ))}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
            <Link href={`/auction/${id}`} className="text-[#4A5FBF] hover:underline ml-1">
              View Details
            </Link>
          </p>
        </div>

        {/* Right: Auction Info */}
        <div className="w-72 p-4 border-l border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-bold text-gray-900">{price}</span>
            <Star className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer" />
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">{totalBids}</span> Total Bids
          </div>

          {/* Countdown Timer */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm mb-1">
              <div className="bg-gray-100 px-2 py-1 rounded text-center min-w-[32px]">
                <div className="font-bold">{timeLeft.days}</div>
                <div className="text-xs text-gray-500">Days</div>
              </div>
              <div className="bg-gray-100 px-2 py-1 rounded text-center min-w-[32px]">
                <div className="font-bold">{timeLeft.hours}</div>
                <div className="text-xs text-gray-500">Hours</div>
              </div>
              <div className="bg-gray-100 px-2 py-1 rounded text-center min-w-[32px]">
                <div className="font-bold">{timeLeft.minutes}</div>
                <div className="text-xs text-gray-500">mins</div>
              </div>
              <div className="bg-gray-100 px-2 py-1 rounded text-center min-w-[32px]">
                <div className="font-bold">{timeLeft.seconds}</div>
                <div className="text-xs text-gray-500">secs</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">Time Left</div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <div>{endTime}</div>
            <div className="text-xs">End Time</div>
          </div>

          <Link href={`/auction/${id}`} className="mt-auto">
            <Button className="w-full bg-[#4A5FBF] hover:bg-[#3A4FAF]">Submit A Bid</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
