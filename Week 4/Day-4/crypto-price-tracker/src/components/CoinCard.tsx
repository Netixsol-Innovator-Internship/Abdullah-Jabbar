// file: src/components/CoinCard.tsx
"use client";

import Image from "next/image";
import { memo, useState } from "react";
import { Coin } from "@store/apiSlice";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { toggleFavorite } from "@store/favoritesSlice";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { useGetMarketChartQuery } from "@store/apiSlice";

const CoinChart = dynamic(() => import("./CoinChart"), { ssr: false });

// map of supported currency symbols
const currencySymbols: Record<string, string> = {
  usd: "$",
  eur: "€",
  gbp: "£",
  pkr: "₨",
};

function CoinCardBase({ coin }: { coin: Coin }) {
  const dispatch = useAppDispatch();
  const favIds = useAppSelector((s) => s.favorites.ids);
  const vs_currency = useAppSelector((s) => s.settings.currency);
  const [toast, setToast] = useState<string | null>(null);
  const { ref, inView } = useInView({ threshold: 0, triggerOnce: true });

  const isFav = favIds.includes(coin.id);
  const { data: chart } = useGetMarketChartQuery(
    { id: coin.id, vs_currency, days: 7 },
    { skip: !inView } // small perf win for list
  );

  const pc = coin.price_change_percentage_24h ?? 0;
  const up = pc >= 0;

  // get symbol for active currency
  const symbol = currencySymbols[vs_currency] || "";

  return (
    <div
      ref={ref}
      className=" p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col gap-3 bg-white dark:bg-gray-900 hover:scale-105"
    >
      <a href={`/coin/${coin.id}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image
              src={coin.image || "/icons/placeholder-coin.png"}
              alt={`${coin.name} logo`}
              width={32}
              height={32}
              className="rounded"
            />
            <div>
              <a
                href={`/coin/${coin.id}`}
                className="font-medium hover:underline"
              >
                {coin.name}
              </a>
              <p className="text-xs text-gray-500">
                {coin.symbol?.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            aria-pressed={isFav}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            className={`px-2 py-1 rounded-lg border text-xs ${
              isFav
                ? "border-yellow-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
            onClick={() => {
              dispatch(toggleFavorite(coin.id));
              setToast(isFav ? "Removed from favorites" : "Added to favorites");
              setTimeout(() => setToast(null), 1600);
            }}
          >
            {isFav ? "★" : "☆"}
          </button>
        </div>

        <div className="flex items-baseline justify-between">
          <p className="text-xl font-semibold">
            {coin.current_price != null
              ? `${symbol}${coin.current_price.toLocaleString()}`
              : "—"}
          </p>
          <p className={`text-sm ${up ? "text-green-600" : "text-red-600"}`}>
            {up ? "+" : ""}
            {pc.toFixed(2)}%
          </p>
        </div>

        <div className="h-20">
          {chart?.prices && chart.prices.length > 0 ? (
            <CoinChart prices={chart.prices} height={80} compact />
          ) : (
            <div
              className="h-full w-full rounded-md bg-gray-50 dark:bg-gray-800"
              aria-hidden="true"
            />
          )}
        </div>

        {toast && (
          <div
            className="text-xs text-gray-600 dark:text-gray-300"
            role="status"
          >
            {toast}
          </div>
        )}
      </a>
    </div>
  );
}

export default memo(CoinCardBase);
