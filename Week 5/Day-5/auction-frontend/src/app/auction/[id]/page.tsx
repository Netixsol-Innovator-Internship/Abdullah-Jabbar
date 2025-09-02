"use client"

import { HeroSection } from "@/components/hero-section"
import { ImageGallery } from "@/components/image-gallery"
import { BiddingInterface } from "@/components/bidding-interface"
import { BidderList } from "@/components/bidder-list"
import { Card } from "@/components/ui/card"
import { useParams } from "next/navigation"

export default function AuctionDetailPage() {
  const params = useParams()
  const id = params.id as string

  // Mock data - in real app this would come from API
  const auctionData = {
    title: "Audi Q3",
    description: "Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.",
    mainImage: "/white-audi-q3-suv-luxury.png",
    thumbnails: [
      "/red-audi-q3-front-view.png",
      "/red-audi-q3-side-view.png",
      "/red-audi-q3-rear-view.png",
      "/red-audi-q3-interior-view.png",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    currentBid: "$1,07899.99",
    timeRemaining: "06:00pm",
    totalBids: 100,
    status: "trending",
  }

  const bidders = [
    { name: "Bidder 1", amount: "$ 16,000" },
    { name: "Bidder 2", amount: "$ 14,200" },
    { name: "Bidder 3", amount: "$ 16,000" },
  ]

  const topBidder = {
    name: "Lionel Messi",
    amount: "$1,07899.99",
  }

  return (
    <>
      <HeroSection
        title={auctionData.title}
        description={auctionData.description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Auction Detail" }]}
      />

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image Gallery */}
            <div className="lg:col-span-2">
              <ImageGallery
                mainImage={auctionData.mainImage}
                thumbnails={auctionData.thumbnails}
                title={auctionData.title}
                status={auctionData.status}
              />

              {/* Bidding Interface */}
              <div className="mt-8">
                <BiddingInterface
                  currentBid={auctionData.currentBid}
                  timeRemaining={auctionData.timeRemaining}
                  totalBids={auctionData.totalBids}
                />
              </div>

              {/* Description */}
              <Card className="p-6 mt-8">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Lorem ipsum dolor sit amet consectetur. Duis ac sodales vulputate dolor volutpat ac.
                  Tempor et magna eu molestie nibh lorem gravida. Ipsum et feugiat ut elit elementum vitae
                  suspendisse. Ut sapien mauris elementum eleifend.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  In est eget turpis tellus leo amet arcu. Commodo viverra arcu pellentesque ut non placerat
                  placerat amet vitae. Ultricies velit consequat tempor pellentesque egestas mauris dolor arcu.
                  Odio leo ut in ut. At ut purus vitae ut consequat elit elementum aliquam et fringilla egestas
                  vitae pellentesque.
                </p>
              </Card>

              {/* Top Bidder */}
              <Card className="p-6 mt-8">
                <h3 className="text-lg font-semibold mb-4 bg-[#4A5FBF] text-white p-3 -m-6 rounded-t-lg">
                  Top Bidder
                </h3>
                <div className="flex items-center gap-4">
                  <img
                    src="/professional-headshot.png"
                    alt={topBidder.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Full Name:</span>
                        <span className="ml-2 font-medium">{topBidder.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2">messi10@gmail.com</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Mobile Number:</span>
                        <span className="ml-2">1234567890</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Nationality:</span>
                        <span className="ml-2">Argentina</span>
                      </div>
                      <div>
                        <span className="text-gray-600">ID Type:</span>
                        <span className="ml-2">Passport</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Bidder List */}
            <div>
              <BidderList bidders={bidders} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
