"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, User, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Shop" },
    { href: "/sale", label: "On Sale" },
    { href: "/new-arrivals", label: "New Arrivals" },
    { href: "/brands", label: "Brands" },
  ]

  return (
    <>
      {/* Promo Banner */}
      <div className="bg-black text-white text-center py-2 px-4 text-sm">
        <span>Sign up and get 20% off to your first order. </span>
        <Link href="/signup" className="underline font-medium">
          Sign Up Now
        </Link>
        <button className="absolute right-4 top-2">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-black">
              SHOP.CO
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-gray-700 hover:text-black transition-colors ${
                    pathname === link.href ? "text-black font-medium" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="text-gray-700 hover:text-black">
                <ShoppingCart className="w-6 h-6" />
              </Link>
              <Link href="/account" className="text-gray-700 hover:text-black">
                <User className="w-6 h-6" />
              </Link>

              {/* Mobile Menu Button */}
              <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-gray-700 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
