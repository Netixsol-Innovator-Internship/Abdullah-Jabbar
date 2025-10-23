"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // To avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      className="mr-2 bg-transparent border border-[var(--card-border)] text-[var(--text-secondary)] rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-[var(--primary-color)] hover:bg-[rgba(99,102,241,0.1)] hover:text-[var(--primary-color)] hover:rotate-[15deg]"
      onClick={toggleTheme}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {theme === "dark" ? (
        <FiSun className="text-xl" />
      ) : (
        <FiMoon className="text-xl" />
      )}
    </button>
  );
}
