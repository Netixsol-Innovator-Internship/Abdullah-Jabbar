"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useLogoutMutation } from "../store/api/authApi";
import { logout as logoutAction } from "../store/slices/authSlice";

export default function Navigation() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutAction());
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/30 animate-slide-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and title */}
          <div className="flex items-center animate-slide-in-left">
            <span
              className="text-2xl mr-2 transition-transform duration-200 hover:scale-110"
              role="img"
              aria-label="cricket icon"
            >
              🏏
            </span>
            <h1 className="text-xl font-semibold text-gray-900 animate-fade-in-scale">
              Cricket Analytics
            </h1>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4 animate-slide-in-right">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50/70 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-transparent hover:border-blue-200/40 hover:scale-105 hover-lift btn-press animate-fade-in-scale"
                style={{ animationDelay: "100ms" }}
              >
                Simple Ask
              </Link>
              <Link
                href="/chat"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50/70 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-transparent hover:border-blue-200/40 hover:scale-105 hover-lift btn-press animate-fade-in-scale"
                style={{ animationDelay: "200ms" }}
              >
                Chat
              </Link>
              {isAdmin && (
                <Link
                  href="/upload"
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50/70 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-transparent hover:border-blue-200/40 hover:scale-105 hover-lift btn-press animate-fade-in-scale"
                  style={{ animationDelay: "300ms" }}
                >
                  Upload
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <span
                className="text-sm text-gray-600 hidden lg:inline animate-fade-in-scale"
                style={{ animationDelay: "400ms" }}
              >
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 btn-press animate-fade-in-scale"
                style={{ animationDelay: "500ms" }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center animate-slide-in-right">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2 transition-all duration-300 hover:scale-110 btn-press"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm animate-slide-in-up">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200/20">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 border border-transparent hover:border-blue-200/50 hover:scale-105 hover-lift btn-press animate-slide-in-left"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ animationDelay: "50ms" }}
              >
                Simple Ask
              </Link>
              <Link
                href="/chat"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 border border-transparent hover:border-blue-200/50 hover:scale-105 hover-lift btn-press animate-slide-in-left"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ animationDelay: "100ms" }}
              >
                Chat
              </Link>
              {isAdmin && (
                <Link
                  href="/upload"
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 border border-transparent hover:border-blue-200/50 hover:scale-105 hover-lift btn-press animate-slide-in-left"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ animationDelay: "150ms" }}
                >
                  Upload
                </Link>
              )}
              <div
                className="border-t border-gray-200/20 pt-4 pb-3 animate-slide-in-up"
                style={{ animationDelay: "200ms" }}
              >
                <div className="px-3 mb-3">
                  <span
                    className="text-sm text-gray-600 animate-fade-in-scale"
                    style={{ animationDelay: "250ms" }}
                  >
                    Welcome, {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 btn-press animate-slide-in-left"
                  style={{ animationDelay: "300ms" }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
