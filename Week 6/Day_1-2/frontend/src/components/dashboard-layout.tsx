//dashboard-layout.tsx
"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Package,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    { name: "DASHBOARD", href: "/dashboard", icon: LayoutDashboard },
    { name: "ALL PRODUCTS", href: "/dashboard/products", icon: Package },
    { name: "ORDER LIST", href: "/dashboard/orders", icon: ShoppingCart },
  ];

  const categories = [
    { name: "Lorem Ipsum", count: 21 },
    { name: "Lorem Ipsum", count: 32 },
    { name: "Lorem Ipsum", count: 13 },
    { name: "Lorem Ipsum", count: 14 },
    { name: "Lorem Ipsum", count: 6 },
    { name: "Lorem Ipsum", count: 11 },
  ];

  return (
    <div className="bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`relative bg-white border-r border-gray-200 min-h-screen transition-all duration-200 ${collapsed ? "w-16" : "w-50"}`}
        >
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-2">
              {/* show small branding when collapsed */}
              {collapsed ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/dashboard/arik-bird-logo.svg"
                    alt="Arik bird"
                    width={24}
                    height={24}
                    className="h-5 w-auto"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Image
                    src="/dashboard/arik-logo.svg"
                    alt="Arik"
                    width={120}
                    height={24}
                    className="h-6 w-auto"
                  />
                  <Image
                    src="/dashboard/arik-bird-logo.svg"
                    alt="Arik bird"
                    width={24}
                    height={24}
                    className="h-6 w-auto"
                  />
                </div>
              )}
            </div>
          </div>

          <nav className="p-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    collapsed ? "justify-center" : "space-x-3",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Categories Section */}
          <div className="px-4 mt-8 relative">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 mb-4"
            >
              {!collapsed ? (
                <span>Categories</span>
              ) : (
                <span className="sr-only">Categories</span>
              )}
              <div className="flex items-center space-x-2">
                <ChevronRight
                  className={cn(
                    "w-4 h-4 transition-transform",
                    categoriesOpen && "rotate-90"
                  )}
                />
              </div>
            </button>

            {/* Expanded (inline) */}
            {!collapsed && categoriesOpen && (
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <span>{category.name}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Collapsed: floating overlay next to collapsed sidebar */}
            {collapsed && categoriesOpen && (
              <div className="absolute left-full top-0 ml-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-64 overflow-auto p-2">
                <div className="text-sm font-medium text-gray-900 mb-2">
                  Categories
                </div>
                <div className="space-y-1">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer"
                      title={`${category.name} (${category.count})`}
                    >
                      <span className="truncate">{category.name}</span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* collapse/expand control placed under Categories */}
          <div className="mt-2 flex justify-center">
            <button
              onClick={() => setCollapsed((s) => !s)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className=" rounded-full p-2  text-gray-600 hover:bg-gray-50  "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className={
                  "w-5 h-5 transform transition-transform " +
                  (!collapsed ? "rotate-180" : "")
                }
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 1v22" />
                <path d="M5 12h11M12 5l6 7-6 7" />
              </svg>
            </button>
          </div>
        </aside>
        {/* Right Column: header, main, footer */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div />

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 w-64 bg-gray-50 border-gray-200"
                  />
                </div>
                <Button variant="ghost" size="icon">
                  <Bell className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <span>ADMIN</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">{children}</main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>© 2023 - pulstron Dashboard</div>
              <div className="flex items-center space-x-6">
                <Link href="#" className="hover:text-gray-900">
                  About
                </Link>
                <Link href="#" className="hover:text-gray-900">
                  Careers
                </Link>
                <Link href="#" className="hover:text-gray-900">
                  Policy
                </Link>
                <Link href="#" className="hover:text-gray-900">
                  Contact
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
