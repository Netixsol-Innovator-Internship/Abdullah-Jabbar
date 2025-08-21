// file: app/page.tsx
"use client";

import CoinList from "@components/CoinList";
import { useAppSelector } from "@store/hooks";

export default function HomePage() {
  const { currency} = useAppSelector((s) => s.settings);

  return (
    <section className="space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h1 className="text-2xl font-semibold">Top Coins</h1>
        <p className="text-sm text-gray-500">
          Currency: {currency.toUpperCase()} 
        </p>
      </header>

      <CoinList />
      <p className="text-xs text-gray-500" aria-live="polite">
        Data auto-refresh time is configurable in Settings.
      </p>
    </section>
  );
}
