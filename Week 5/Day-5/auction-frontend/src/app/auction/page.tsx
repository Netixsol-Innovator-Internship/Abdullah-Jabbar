"use client"

import { HeroSection } from "@/components/hero-section"
import { AuctionFilters } from "@/components/auction-filters"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star} from "lucide-react"
import Link from "next/link"

export default function AuctionPage() {
  const auctions = [
    {
      id: "kia-carnival",
      name: "Kia Carnival",
      image: "/blue-kia-carnival-minivan.png",
      price: "$1,07899.99",
      currentBid: "$1,07899.99",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet pretium leo mauris. Molestudunt dignissim tortor elit mauris pretium tincidunt libero. Suspendisse aliquam donec leo nisl purus et quam pulvinar. Odio egestas egestas tristique et lectus viverra in sed mauris.",
      timeRemaining: "06:00pm 03 Jan 2023",
      endType: "End Time",
      status: "trending",
    },
    {
      id: "range-rover",
      name: "Range Rover",
      image: "/white-range-rover-suv.png",
      price: "$1,07899.99",
      currentBid: "$1,07899.99",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet pretium leo mauris. Molestudunt dignissim tortor elit mauris pretium tincidunt libero. Suspendisse aliquam donec leo nisl purus et quam pulvinar. Odio egestas egestas tristique et lectus viverra in sed mauris.",
      timeRemaining: "06:00pm 03 Jan 2023",
      endType: "End Time",
    },
    {
      id: "bentley",
      name: "Bentley",
      image: "/blue-bentley-luxury-sedan.png",
      price: "$1,07899.99",
      currentBid: "$1,07899.99",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet pretium leo mauris. Molestudunt dignissim tortor elit mauris pretium tincidunt libero. Suspendisse aliquam donec leo nisl purus et quam pulvinar. Odio egestas egestas tristique et lectus viverra in sed mauris.",
      timeRemaining: "06:00pm 03 Jan 2023",
      endType: "End Time",
    },
    {
      id: "hyundai-verna",
      name: "Hyundai Verna",
      image: "/white-hyundai-verna-sedan.png",
      price: "$1,07899.99",
      currentBid: "$1,07899.99",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet pretium leo mauris. Molestudunt dignissim tortor elit mauris pretium tincidunt libero. Suspendisse aliquam donec leo nisl purus et quam pulvinar. Odio egestas egestas tristique et lectus viverra in sed mauris.",
      timeRemaining: "06:00pm 03 Jan 2023",
      endType: "End Time",
    },
    {
      id: "mahindra-thar",
      name: "Mahindra Thar",
      image: "/red-mahindra-thar-suv.png",
      price: "$1,07899.99",
      currentBid: "$1,07899.99",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet pretium leo mauris. Molestudunt dignissim tortor elit mauris pretium tincidunt libero. Suspendisse aliquam donec leo nisl purus et quam pulvinar. Odio egestas egestas tristique et lectus viverra in sed mauris.",
      timeRemaining: "06:00pm 03 Jan 2023",
      endType: "End Time",
      status: "trending",
    },
    {
      id: "ferrari",
      name: "Ferrari",
      image: "/yellow-ferrari-sports-car.png",
      price: "$1,07899.99",
      currentBid: "$1,07899.99",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet pretium leo mauris. Molestudunt dignissim tortor elit mauris pretium tincidunt libero. Suspendisse aliquam donec leo nisl purus et quam pulvinar. Odio egestas egestas tristique et lectus viverra in sed mauris.",
      timeRemaining: "06:00pm 03 Jan 2023",
      endType: "End Time",
    },
  ]

  return (
    <>
      <HeroSection
        title="Auction"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Auction" }]}
      />

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-[#4A5FBF] text-white px-4 py-2 rounded">Showing 1-5 of 10 Results</div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by Relevance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Sort by Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6">
                {auctions.map((auction) => (
                  <Card key={auction.id} className="p-6">
                    <div className="flex gap-6">
                      <div className="relative">
                        {auction.status && (
                          <Badge className="absolute top-2 left-2 z-10 bg-red-500">{auction.status}</Badge>
                        )}
                        <img
                          src={auction.image || "/placeholder.svg"}
                          alt={auction.name}
                          className="w-48 h-32 object-cover rounded"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold">{auction.name}</h3>
                          <Star className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer" />
                        </div>

                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < auction.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>

                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{auction.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-8">
                            <div>
                              <div className="text-sm text-gray-600">Current Bid</div>
                              <div className="font-semibold">{auction.currentBid}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">{auction.endType}</div>
                              <div className="text-sm">{auction.timeRemaining}</div>
                            </div>
                          </div>

                          <Link href={`/auction/${auction.id}`}>
                            <Button className="bg-[#4A5FBF] hover:bg-[#3A4FAF]">Submit A Bid</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="outline" size="sm">‹</Button>
                <Button className="bg-[#4A5FBF] hover:bg-[#3A4FAF]" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">4</Button>
                <Button variant="outline" size="sm">5</Button>
                <Button variant="outline" size="sm">...</Button>
                <Button variant="outline" size="sm">10</Button>
                <Button variant="outline" size="sm">›</Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80">
              <AuctionFilters />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
