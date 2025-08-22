// file: app/page.tsx
"use client";

import { Suspense } from "react";
import CoinList from "@components/CoinList";
import { useAppSelector } from "@store/hooks";
import Spinner from "@components/Spinner";

export default function HomePage() {
  const { currency } = useAppSelector((s) => s.settings);

  return (
    <section className="space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h1 className="text-2xl font-semibold dark:text-white">Top Coins</h1>
        <p className="text-sm text-gray-400 dark:text-gray-300">
          Currency: {currency.toUpperCase()}
        </p>
      </header>

      <Suspense fallback={<Spinner label="Loading coins..." />}>
        <CoinList />
      </Suspense>

      {/* <p className="text-xs text-gray-500" aria-live="polite">
        Data auto-refresh time is configurable in Settings.
      </p> */}
    </section>
  );
}
