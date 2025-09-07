"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { useGetCartQuery } from "@/lib/api/cartApiSlice";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  // Global auth context
  const { isAuthenticated, logout, isAdmin, user } = useAuth();
  const isLoggedIn = isAuthenticated; // maintain previous variable name for minimal changes

  // track previous login state to detect fresh login
  const prevLoggedRef = useRef(false);

  // Generate or get session ID for cart
  useEffect(() => {
    let storedSessionId = localStorage.getItem("cart-session-id");
    if (!storedSessionId) {
      storedSessionId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart-session-id", storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  // Fetch cart data to get item count
  const { data: cartData } = useGetCartQuery(
    { sessionId },
    { skip: !sessionId }
  );

  // Calculate total items in cart
  const cartItemCount =
    cartData?.items?.reduce((total, item: unknown) => {
      const cartItem = item as { qty?: number; quantity?: number };
      return total + (cartItem.qty || cartItem.quantity || 0);
    }, 0) || 0;

  useEffect(() => {
    if (isLoggedIn) {
      setShowBanner(false);
    }
    prevLoggedRef.current = isLoggedIn;
  }, [isLoggedIn]);

  // Close account dropdown on outside click or when focus leaves
  const accountRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!accountRef.current) return;
      if (!accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsAccountOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsAccountOpen(false);
    router.push("/");
  };

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/sale", label: "On Sale" },
    { href: "/new-arrivals", label: "New Arrivals" },
    { href: "/brands", label: "Brands" },
  ];

  return (
    <>
      {/* Promo Banner */}
      {showBanner && !isLoggedIn && (
        <div className="relative max-w-360 mx-auto bg-black text-white text-center py-2 px-4 text-sm">
          <span>Sign up and get 20% off to your first order. </span>
          <Link href="/authForm" className="underline font-medium">
            Sign Up Now
          </Link>
          <button
            className="absolute right-4 top-2"
            onClick={() => setShowBanner(false)}
          >
            <X className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="bg-white border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side (Mobile Menu + Logo) */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* Logo */}
              <Link href="/" className="text-2xl font-bold text-black">
                SHOP.CO
              </Link>
            </div>

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
              <Link
                href="/cart"
                className="relative text-gray-700 hover:text-black"
              >
                <ShoppingCart className="w-6 h-6" />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                    >
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Account dropdown */}
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      // Always toggle the dropdown for logged in users
                      setIsAccountOpen((v) => !v);
                    } else {
                      // Not logged in, redirect to auth form
                      router.push("/authForm");
                    }
                  }}
                  className="flex items-center text-gray-700 hover:text-black focus:outline-none"
                  aria-expanded={isAccountOpen}
                  aria-controls="account-menu"
                  aria-label="Open account menu"
                >
                  <User className="w-6 h-6 cursor-pointer" />
                  <ChevronDown
                    className={`w-4 h-4 ml-1 transform transition-transform duration-150 ${
                      isAccountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isAccountOpen && isLoggedIn && user && (
                    <motion.div
                      id="account-menu"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50"
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm font-medium text-gray-900">
                          Account
                        </div>
                        {/* Dashboard only for admin or super-admin */}
                        {isAdmin && (
                          <Link
                            href="/dashboard"
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => setIsAccountOpen(false)}
                          >
                            <svg
                              className="w-4 h-4 mr-2 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 7h18M3 12h18M3 17h18"
                              ></path>
                            </svg>
                            Dashboard
                          </Link>
                        )}

                        <Link
                          href="/profile"
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          <svg
                            className="w-4 h-4 mr-2 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.61 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                          </svg>
                          Profile
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer flex items-center focus:outline-none"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu with Animation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
