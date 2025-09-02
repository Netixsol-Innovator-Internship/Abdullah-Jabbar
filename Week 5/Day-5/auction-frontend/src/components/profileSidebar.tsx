import React from "react"

type Props = {
  active: "personal" | "cars" | "bids" | "wishlist"
  setActive: (v: "personal" | "cars" | "bids" | "wishlist") => void
}

export function ProfileSidebar({ active, setActive }: Props) {
  const buttonClass = (isActive: boolean) =>
    `w-full text-left py-3 px-4 rounded font-medium border ${
      isActive
        ? "bg-[#4A5FBF] text-white"
        : "text-gray-600 hover:bg-gray-50 bg-white"
    }`

  const thinActiveClass = (isActive: boolean) =>
    `w-full text-left py-3 px-4 rounded font-medium border ${
      isActive
        ? "bg-white text-[#4A5FBF] shadow-inner border-l-4 border-[#F4C038]"
        : "text-gray-600 hover:bg-gray-50 bg-white"
    }`

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 space-y-4">
        <button onClick={() => setActive("personal")} className={buttonClass(active === "personal")}>
          Personal Information
        </button>
        <button onClick={() => setActive("cars")} className={thinActiveClass(active === "cars")}>
          My Cars
        </button>
        <button onClick={() => setActive("bids")} className={thinActiveClass(active === "bids")}>
          My Bids
        </button>
        <button onClick={() => setActive("wishlist")} className={thinActiveClass(active === "wishlist")}>
          Wishlist
        </button>
      </div>
    </div>
  )
}