// file: src/components/CoinList.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetCoinsQuery } from "@store/apiSlice";
import { useAppSelector } from "@store/hooks";
import CoinCard from "./CoinCard";
import Spinner from "./Spinner";
import ErrorFallback from "./ErrorFallback";

export default function CoinList() {
  const params = useSearchParams();
  const search = params.get("q") || undefined;

  const { currency, per_page, polling } = useAppSelector((s) => s.settings);
  const [page, setPage] = useState(1);

  const { data, isFetching, isLoading, isError, refetch } = useGetCoinsQuery(
    { vs_currency: currency },
    { pollingInterval: polling }
  );

  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    setItems([]); // reset on query input change
    setPage(1);
  }, [currency, per_page, search]);

  useEffect(() => {
    if (data && page === 1) setItems(data);
    else if (data && page > 1) setItems((prev) => [...prev, ...data]);
  }, [data, page]);

  if (isLoading && page === 1) return <Spinner label="Loading coins..." />;
  if (isError) return <ErrorFallback onRetry={refetch} />;

  return (
    <section className="space-y-4">
      <ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        aria-live="polite"
      >
        {items.map((coin) => (
          <li key={coin.id}>
            <CoinCard coin={coin} />
          </li>
        ))}
      </ul>

      {isFetching && (
        <div className="text-xs text-gray-500" role="status">
          Refreshing…
        </div>
      )}
    </section>
  );
}
