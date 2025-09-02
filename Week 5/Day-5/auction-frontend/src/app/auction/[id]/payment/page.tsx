"use client";

import { HeroSection } from "@/components/hero-section";
import { ImageGallery } from "@/components/image-gallery";
import { BidderList } from "@/components/bidder-list";
import { PaymentSteps } from "@/components/payment-steps";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";

export default function PaymentPage() {
  const params = useParams();
  const id = params.id as string;

  // Mock data - in real app this would come from API
  const auctionData = {
    title: "Audi Q3",
    description:
      "Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.",
    mainImage: "/white-audi-q3-suv-luxury.png",
    thumbnails: [
      "/red-audi-q3-front-view.png",
      "/red-audi-q3-side-view.png",
      "/red-audi-q3-rear-view.png",
      "/red-audi-q3-interior-view.png",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    currentBid: "$60,000",
    timeRemaining: "06:00pm",
    totalBids: 279831,
    status: "trending",
  };

  const winner = {
    name: "Manish Sharma",
    amount: "$60,000",
  };

  const paymentSteps = [
    {
      date: "14/03/2022",
      time: "06:00pm",
      amount: "$60,000",
      id: "279831",
      status: "completed" as const,
      label: "Ready For Shipping",
    },
    {
      date: "21/04/2022",
      time: "06:00pm",
      amount: "$60,000",
      id: "279831",
      status: "current" as const,
      label: "Ready For Shipping",
    },
    {
      date: "15/03/2022",
      time: "06:00pm",
      amount: "$60,000",
      id: "279831",
      status: "pending" as const,
      label: "Delivered",
    },
  ];

  return (
    <>
      <HeroSection
        title={auctionData.title}
        description={auctionData.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Auction Detail" },
        ]}
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

              {/* Payment Notice */}
              <div className="mt-8 text-center">
                <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 mb-4">
                  <p className="text-orange-800 font-medium">
                    Note: Please make your payment in next 6 Days
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center mb-6">
                  <div>
                    <div className="text-2xl font-bold text-[#4A5FBF]">
                      $60,000
                    </div>
                    <div className="text-sm text-gray-600">Winning Bid</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">06:00pm</div>
                    <div className="text-sm text-gray-600">End Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">279831</div>
                    <div className="text-sm text-gray-600">Bid Number</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">130</div>
                    <div className="text-sm text-gray-600">Watchers</div>
                  </div>
                </div>

                <button className="bg-[#4A5FBF] hover:bg-[#3A4FAF] text-white px-8 py-3 rounded-lg font-medium">
                  Make Payment
                </button>
              </div>

              {/* Description */}
              <Card className="p-6 mt-8">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Lorem ipsum dolor sit amet consectetur. Duis ac sodales
                  vulputate dolor volutpat ac. Tempor et magna eu molestie nibh
                  lorem gravida. Ipsum et feugiat ut elit elementum vitae
                  suspendisse. Ut sapien mauris elementum eleifend.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  In est eget turpis tellus leo amet arcu. Commodo viverra arcu
                  pellentesque ut non placerat placerat amet vitae. Ultricies
                  velit consequat tempor pellentesque egestas mauris dolor arcu.
                  Odio leo ut in ut. At ut purus vitae ut consequat elit
                  elementum aliquam et fringilla egestas vitae pellentesque.
                </p>
              </Card>

              {/* Winner */}
              <Card className="p-6 mt-8">
                <h3 className="text-lg font-semibold mb-4 bg-[#4A5FBF] text-white p-3 -m-6 mb-4 rounded-t-lg">
                  Winner
                </h3>
                <div className="flex items-center gap-4">
                  <img
                    src="/professional-headshot.png"
                    alt={winner.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Full Name:</span>
                        <span className="ml-2 font-medium">{winner.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2">Manish Sharma</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Mobile Number:</span>
                        <span className="ml-2">1234567890</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Nationality:</span>
                        <span className="ml-2">India</span>
                      </div>
                      <div>
                        <span className="text-gray-600">ID Type:</span>
                        <span className="ml-2">India</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Steps */}
              <PaymentSteps steps={paymentSteps} />
            </div>

            {/* Right Column - Bidder List */}
            <div>
              <BidderList bidders={[]} winner={winner} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
