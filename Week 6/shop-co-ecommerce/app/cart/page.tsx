"use client"

import { useState } from "react"
import { Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Gradient Graphic T-shirt",
      image: "/placeholder.svg?height=150&width=150",
      size: "Large",
      color: "White",
      price: 145,
      quantity: 1,
    },
    {
      id: "2",
      name: "Checkered Shirt",
      image: "/placeholder.svg?height=150&width=150",
      size: "Medium",
      color: "Red",
      price: 180,
      quantity: 1,
    },
    {
      id: "3",
      name: "Skinny Fit Jeans",
      image: "/placeholder.svg?height=150&width=150",
      size: "Large",
      color: "Blue",
      price: 240,
      quantity: 1,
    },
  ])

  const [promoCode, setPromoCode] = useState("")

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter((item) => item.id !== id))
    } else {
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = Math.round(subtotal * 0.2) // 20% discount
  const deliveryFee = 15
  const total = subtotal - discount + deliveryFee

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Cart</span>
      </nav>

      <h1 className="text-3xl font-bold text-black mb-8">YOUR CART</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-6 border border-gray-200 rounded-lg">
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-black mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-1">Size: {item.size}</p>
                <p className="text-sm text-gray-600 mb-3">Color: {item.color}</p>
                <p className="text-xl font-bold text-black">${item.price}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-full">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-black">${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount (-20%)</span>
              <span className="font-medium text-red-600">-${discount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium text-black">${deliveryFee}</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-medium text-black">Total</span>
                <span className="text-xl font-bold text-black">${total}</span>
              </div>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mb-6">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                Apply
              </button>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-black text-white py-4 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            Go to Checkout →
          </Link>
        </div>
      </div>
    </div>
  )
}
