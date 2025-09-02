"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface BiddingInterfaceProps {
  currentBid: string;
  timeRemaining: string;
  totalBids: number;
  isLive?: boolean;
  isEnded?: boolean;
}

export function BiddingInterface({
  currentBid,
  timeRemaining,
  totalBids,
  isLive,
  isEnded,
}: BiddingInterfaceProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const auctionId = params?.id;

  // Parse currentBid to number (remove non-numeric chars)
  const getCurrentBidValue = () => {
    const num = Number(String(currentBid).replace(/[^\d.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers (and optional decimal)
    if (!/^\d*\.?\d*$/.test(value)) return;
    setBidAmount(value);
    setError("");
  };

  const handleSubmit = () => {
    if (!bidAmount || !auctionId) return;
    const bidNum = Number(bidAmount);
    const minBid = getCurrentBidValue();
    if (isNaN(bidNum) || bidNum <= 0) {
      setError("Please enter a valid bid amount.");
      return;
    }
    if (bidNum < minBid) {
      setError(`Bid must be at least ${currentBid}`);
      return;
    }
    setError("");
    router.push(
      `/auction/${auctionId}/payment?bid=${encodeURIComponent(bidAmount)}`
    );
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#4A5FBF]">{currentBid}</div>
          <div className="text-sm text-gray-600">Current Bid</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{timeRemaining}</div>
          <div className="text-sm text-gray-600">Time Left</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{totalBids}</div>
          <div className="text-sm text-gray-600">Total Bids</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">130</div>
          <div className="text-sm text-gray-600">Watchers</div>
        </div>
      </div>

      {isEnded ? (
        <div className="text-center">
          <Badge className="bg-red-500 text-lg px-4 py-2">
            Bidding has ended
          </Badge>
        </div>
      ) : (
        <div className="space-y-4">
          {isLive && (
            <div className="text-center mb-4">
              <Badge className="bg-red-500 animate-pulse">
                Note: Please make your payment in next 6 Days
              </Badge>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Enter bid amount"
              value={bidAmount}
              onChange={handleInputChange}
              className="flex-1"
              inputMode="decimal"
            />
            <Button
              className="bg-[#4A5FBF] hover:bg-[#3A4FAF] px-8"
              onClick={handleSubmit}
              disabled={!bidAmount}
            >
              {isLive ? "Make Payment" : "Submit Bid"}
            </Button>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
      )}
    </Card>
  );
}
