import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Link from "next/link"

export interface CarCardProps {
  id: string
  name: string
  image: string
  price: string
  currentBid: string
  timeRemaining: string
  status: "trending" | "ending" | "new" | null
  rating: number
  description?: string
  endTime: string
  endType: string
}

export interface AuctionListingProps extends CarCardProps {
  year: number
  mileage: string
  fuelType: string
  transmission: string
  location: string
}

export function CarCard({ id, name, image, price, currentBid, timeRemaining, status, rating }: CarCardProps) {
  return (
    <Card className=" bg-white">
      <div className="relative h-39">
        <h3 className="py-2 border-b text-center font-semibold text-lg mb-2">{name}</h3>

        {status && (
          <Badge
            className={`absolute top-0 left-0 z-10 ${
              status === "trending" ? "bg-red-500" : status === "ending" ? "bg-orange-500" : "bg-green-500"
            }`}
          >
            {status}
          </Badge>
        )}
        <Star className="absolute top-2 right-2 z-10 w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer" />
        <img src={image || "/placeholder.svg"} alt={name} className="w-full  object-cover" />
      </div>

      <div className="p-4">
        
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          ))}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Current Bid</span>
            <span className="font-semibold">{currentBid}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Time Remaining</span>
            <span className="text-red-500">{timeRemaining}</span>
          </div>
        </div>

        <Link href={`/auction/${id}`}>
          <Button className="w-full bg-[#4A5FBF] hover:bg-[#3A4FAF] cursor-pointer ">Submit A Bid</Button>
        </Link>
      </div>
    </Card>
  )
}
