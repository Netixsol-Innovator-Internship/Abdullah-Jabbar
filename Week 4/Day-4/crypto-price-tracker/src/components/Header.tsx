// file: src/components/Header.tsx
"use client";

import NavBar from "./NavBar";
import Toggle from "./Toggle";

export default function Header() {
  return (
    <header className="border-b border-gray-700 dark:border-gray-200 ">
      <div className="container container-max px-4 py-3 flex items-center justify-between gap-4">
        <a href="/" className="text-lg font-semibold hover:underline dark:text-white">Crypto Price Tracker</a>
        <div className="flex items-center gap-4">
          <NavBar />
          <Toggle ariaLabel="Toggle dark mode" />
        </div>
      </div>
    </header>
  );
}
