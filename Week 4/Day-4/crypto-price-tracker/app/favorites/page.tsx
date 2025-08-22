// file: app/favorites/page.tsx
"use client";

import CoinCard from "@components/CoinCard";
import Spinner from "@components/Spinner";
import ErrorFallback from "@components/ErrorFallback";
import { useAppSelector } from "@store/hooks";
import { useGetCoinsQuery } from "@store/apiSlice";
import { useMemo } from "react";

export default function FavoritesPage() {
  const { currency, per_page } = useAppSelector((s) => s.settings);
  const favIds = useAppSelector((s) => s.favorites.ids);
  const { data, isLoading, isError, refetch } = useGetCoinsQuery({
    page: 1,
    per_page: Math.max(250, per_page), // fetch a lot to filter client-side
    vs_currency: currency,
    search: undefined
  });

  const favorites = useMemo(
    () => (data ?? []).filter((c) => favIds.includes(c.id)),
    [data, favIds]
  );

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold dark:text-white">Favorites</h1>
      {isLoading && <Spinner label="Loading favorites..." />}
      {isError && <ErrorFallback onRetry={refetch} />}
      {!isLoading && !isError && favorites.length === 0 && (
        <p className="text-sm text-gray-500" role="status">No favorites yet. Add some from the home list.</p>
      )}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-live="polite">
        {favorites.map((coin) => (
          <li key={coin.id}><CoinCard coin={coin} /></li>
        ))}
      </ul>
    </section>
  );
}
