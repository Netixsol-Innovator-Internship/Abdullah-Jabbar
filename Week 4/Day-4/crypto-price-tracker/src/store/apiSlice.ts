// file: src/store/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap_rank?: number;
  price_change_percentage_24h?: number;
  market_cap?: number;
};

export type CoinDetail = {
  id: string;
  symbol: string;
  name: string;
  image?: { small?: string; large?: string };
  market_cap_rank?: number;
  market_data?: {
    current_price?: Record<string, number>;
    market_cap?: Record<string, number>;
    price_change_percentage_24h?: number;
  };
};

export type MarketChart = {
  prices: [number, number][];
};

const baseQuery = fetchBaseQuery({
  baseUrl: "/api/coingecko",
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Coins", "Coin", "Chart"],
  refetchOnReconnect: true,
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getCoins: builder.query<
      Coin[],
      {
        page?: number;
        per_page?: number;
        vs_currency: string;
        search?: string;
        change?: "1h" | "24h" | "7d" | "30d" | "200d" | "1y";
      }
    >({
      query: ({
        page = 1,
        per_page = 51,
        vs_currency,
        search,
        change = "7d",
      }) => {
        const params = new URLSearchParams({
          endpoint: "/coins/markets",
          vs_currency,
          page: String(page),
          per_page: String(per_page),
          order: "market_cap_desc",
          sparkline: "false",
          price_change_percentage: change,
        });

        if (search) {
          params.set("ids", search.toLowerCase().trim());
        }

        return `?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Coin" as const, id })),
              { type: "Coins" as const, id: "LIST" },
            ]
          : [{ type: "Coins" as const, id: "LIST" }],
    }),

    getCoinById: builder.query<
      CoinDetail,
      { id: string; vs_currency: string }
    >({
      query: ({ id }) => {
        const params = new URLSearchParams({ endpoint: `/coins/${id}` });
        return `?${params.toString()}`;
      },
      providesTags: (res, err, arg) => [{ type: "Coin", id: arg.id }],
    }),

    getMarketChart: builder.query<
      MarketChart,
      { id: string; vs_currency: string; days: number }
    >({
      query: ({ id, vs_currency, days }) => {
        const params = new URLSearchParams({
          endpoint: `/coins/${id}/market_chart`,
          vs_currency,
          days: String(days),
          interval: "daily",
        });
        return `?${params.toString()}`;
      },
      providesTags: (res, err, arg) => [
        { type: "Chart", id: `${arg.id}-${arg.days}-${arg.vs_currency}` },
      ],
    }),
  }),
});

export const {
  useGetCoinsQuery,
  useGetCoinByIdQuery,
  useGetMarketChartQuery,
} = api;
