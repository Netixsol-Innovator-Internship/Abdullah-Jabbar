// file: app/coin/[id]/page.tsx
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetCoinByIdQuery, useGetMarketChartQuery } from "@store/apiSlice";
import Spinner from "@components/Spinner";
import ErrorFallback from "@components/ErrorFallback";

const CoinChart = dynamic(() => import("@components/CoinChart"), { ssr: false });

export default function CoinDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const vs_currency = "usd"; // detail always in USD; could use settings if preferred
  const { data, isLoading, isError, refetch } = useGetCoinByIdQuery({ id, vs_currency });
  const { data: chart } = useGetMarketChartQuery({ id, vs_currency, days: 7 });

  if (isLoading) return <Spinner label="Loading coin..." />;
  if (isError || !data) return <ErrorFallback onRetry={refetch} />;

  return (
    <section className="space-y-6">
      <header className="flex items-center gap-3">
        <Image
          src={data.image?.large || data.image?.small || "/icons/placeholder-coin.png"}
          alt={`${data.name} logo`}
          width={48}
          height={48}
          className="rounded-md"
        />
        <div>
          <h1 className="text-2xl font-semibold">{data.name} <span className="text-gray-500 text-base">({data.symbol?.toUpperCase()})</span></h1>
          <p className="text-sm text-gray-500">Rank #{data.market_cap_rank ?? "—"}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500">Price</p>
          <p className="text-2xl font-semibold">${data.market_data?.current_price?.usd?.toLocaleString() ?? "—"}</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500">24h Change</p>
          <p className={`text-2xl font-semibold ${((data.market_data?.price_change_percentage_24h ?? 0) >= 0) ? "text-green-600" : "text-red-600"}`}>
            {(data.market_data?.price_change_percentage_24h ?? 0).toFixed(2)}%
          </p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500">Market Cap</p>
          <p className="text-2xl font-semibold">${data.market_data?.market_cap?.usd?.toLocaleString() ?? "—"}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <h2 className="text-lg font-semibold mb-2">7-Day Price</h2>
        <CoinChart prices={chart?.prices ?? []} height={320} />
      </div>
    </section>
  );
}
