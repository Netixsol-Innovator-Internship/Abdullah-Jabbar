// file: app/providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@store/store";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Apply persisted theme early in client
  useEffect(() => {
    const theme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (theme === "dark") document.documentElement.classList.add("dark");
  }, []);
  return <Provider store={store}>{children}</Provider>;
}
