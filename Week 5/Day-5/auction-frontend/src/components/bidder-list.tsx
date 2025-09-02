import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Bidder {
  name: string
  amount: string
  avatar?: string
}

interface BidderListProps {
  bidders: Bidder[]
  winner?: Bidder
}

export function BidderList({ bidders, winner }: BidderListProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 bg-[#4A5FBF] text-white p-3 -m-6 mb-4 rounded-t-lg">
        {winner ? "Winner" : "Bidders List"}
      </h3>

      <div className="space-y-4">
        {winner && (
          <div className="border-b pb-4 mb-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={winner.avatar || "/placeholder.svg"} />
                <AvatarFallback>{winner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold">{winner.name}</div>
                <div className="text-sm text-gray-600">Winner</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">{winner.amount}</div>
                <div className="text-sm text-gray-600">Winning Bid</div>
              </div>
            </div>
          </div>
        )}

        {bidders.map((bidder, index) => (
          <div key={index} className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={bidder.avatar || "/placeholder.svg"} />
              <AvatarFallback>{bidder.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">{bidder.name}</div>
              <div className="text-sm text-gray-600">Bidder {index + 1}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{bidder.amount}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
