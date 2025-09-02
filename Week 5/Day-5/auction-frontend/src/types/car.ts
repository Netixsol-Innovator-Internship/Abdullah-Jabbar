export type Car = {
  id: number
  title: string
  image: string
  winningBid?: string
  currentBid?: string
  badge?: string
  status?: "active" | "sold" | "ended"
  totalBids?: number
  timeLeft?: { days: number; hours: number; mins?: number; secs?: number }
  endTime?: string
  description?: string
}