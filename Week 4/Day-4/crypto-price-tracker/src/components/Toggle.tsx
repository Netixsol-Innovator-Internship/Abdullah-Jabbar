// file: src/components/Toggle.tsx
"use client";

import { useEffect, useState } from "react";

export default function Toggle({ ariaLabel = "Toggle theme" }: { ariaLabel?: string }) {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  if (!mounted) return null;

  return (
    <button
      aria-label={ariaLabel}
      className="px-3 py-1.5 rounded-lg border border-gray-700 dark:border-gray-200 dark:text-white text-sm "
      onClick={() => {
        const now = !dark;
        setDark(now);
        document.documentElement.classList.toggle("dark", now);
        localStorage.setItem("theme", now ? "dark" : "light");
      }}
    >
      {dark ? "Dark" : "Light"}
    </button>
  );
}
