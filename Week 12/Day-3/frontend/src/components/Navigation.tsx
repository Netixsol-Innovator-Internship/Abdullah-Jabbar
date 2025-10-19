"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, ArrowLeftRight } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="flex items-center bg-gray-100 rounded-full p-1 shadow-inner">
      <Link
        href="/"
        className={`flex items-center space-x-2 px-5 py-2 rounded-full transition-all duration-300 ${
          pathname === "/"
            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
            : "text-gray-600 hover:text-gray-900 hover:bg-white"
        }`}
      >
        <Coins className="w-4 h-4" />
        <span className="font-semibold text-sm">Token Management</span>
      </Link>
      <Link
        href="/dex"
        className={`flex items-center space-x-2 px-5 py-2 rounded-full transition-all duration-300 ${
          pathname === "/dex"
            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
            : "text-gray-600 hover:text-gray-900 hover:bg-white"
        }`}
      >
        <ArrowLeftRight className="w-4 h-4" />
        <span className="font-semibold text-sm">DEX</span>
      </Link>
    </div>
  );
}
