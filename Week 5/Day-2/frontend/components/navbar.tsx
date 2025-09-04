"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "./socket-provider";
import { useAuth } from "./auth-context";
import Image from "next/image";

type Tab = "feed" | "profile" | "notifications";

interface NavbarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const socket = useSocket();
  const { user, logout } = useAuth();
  const [badge, setBadge] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs: { key: Tab; label: string }[] = [
    { key: "feed", label: "Feed" },
    { key: "profile", label: "Profile" },
    { key: "notifications", label: "Notifications" },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!socket) return;

    const onCreated = () => setBadge((n) => n + 1);
    const onReadAll = () => setBadge(0);

    socket.on("notification.created", onCreated);
    socket.on("notifications.readAll", onReadAll);

    return () => {
      socket.off("notification.created", onCreated);
      socket.off("notifications.readAll", onReadAll);
    };
  }, [socket]);

  // Move underline smoothly
  useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.querySelector<HTMLButtonElement>(
      `[data-tab="${activeTab}"]`
    );
    if (activeEl) {
      const rect = activeEl.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setIndicatorStyle({
        width: rect.width,
        transform: `translateX(${rect.left - containerRect.left}px)`,
      });
    }
  }, [activeTab]);

  const navButton = (tab: Tab, label: string, mobile = false) => (
    <button
      data-tab={tab}
      onClick={() => {
        setActiveTab(tab);
        setMenuOpen(false);
      }}
      className={`relative transition-colors border-b-2 ${
        mobile ? "block w-full text-left px-3 py-2 rounded-lg" : "pb-1"
      } ${
        activeTab === tab
          ? "text-blue-600 font-semibold border-blue-600"
          : "text-gray-600 hover:text-blue-500 border-transparent"
      }`}
    >
      {label}
      {tab === "notifications" && badge > 0 && (
        <span
          className={`ml-2 text-xs px-1.5 py-0.5 rounded-full bg-red-600 text-white ${
            mobile ? "inline-block" : "relative -top-1"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-40">
      <div className="px-4 lg:px-8 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-blue-600">Comments App</h1>

        {/* Desktop Menu */}
        <div
          ref={containerRef}
          className="hidden md:flex items-center gap-6 relative"
        >
          {tabs.map((t) => navButton(t.key, t.label))}
          <span
            className="absolute bottom-0 h-[2px] bg-blue-600 transition-all duration-300 ease-in-out"
            style={indicatorStyle}
          />
        </div>

        {/* User info and logout for desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-gray-700">Welcome, {user?.username}</span>
          <button
            onClick={logout}
            className=" text-red-600 hover:text-red-500 hover:bg-red-50 rounded"
            aria-label="Logout"
          >
            <Image src="/logout.svg" alt="Logout" width={38} height={28} />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 space-y-2 bg-white border-t">
          {tabs.map((t) => navButton(t.key, t.label, true))}
          <button
            onClick={logout}
            className="block w-full text-left px-1 rounded-lg text-red-600 hover:text-red-500 hover:bg-red-50"
            aria-label="Logout"
          >
            <img src="/logout.svg" alt="Logout" className="size-14" />
          </button>
        </div>
      </div>
    </nav>
  );
}
