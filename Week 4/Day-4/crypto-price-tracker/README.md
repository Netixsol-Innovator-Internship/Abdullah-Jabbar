// file: README.md
# Crypto Price Tracker (Next.js 13 App Router + RTK Query)

A forward-leaning, minimal, and typed full-stack crypto tracker using:
- Next.js 13+ (App Router)
- Redux Toolkit + RTK Query (all data fetching and caching)
- Tailwind CSS
- Recharts (charts)
- CoinGecko API via server proxy (no direct client calls)

## Features
- Server API proxy: `/api/coingecko` forwards to CoinGecko and supports `COINGECKO_API_BASE`.
- Pages:
  - `/` — coins list (search, pagination “Load more”)
  - `/coin/[id]` — coin detail with 7-day chart
  - `/favorites` — client favorites persisted to `localStorage`
  - `/settings` — currency, per-page, and polling interval
- RTK Query:
  - `getCoins({ page, per_page, vs_currency, search })`
  - `getCoinById(id, vs_currency)`
  - `getMarketChart(id, vs_currency, days)`
  - `refetchOnFocus`, `refetchOnReconnect`, polling
- Responsive design (mobile-first). Grid lists on `md+`, single column on mobile.
- Code splitting: dynamic chart import.
- Example unit test for `CoinCard`.

## Install & Run

```bash
# 1) Create the app directory and move into it
# (If you've already copied files, skip #1)
mkdir crypto-price-tracker && cd crypto-price-tracker

# 2) Install dependenciesnpm install @reduxjs/toolkit react-redux
npm install

# 3) Optional: set env
cp .env.local.example .env.local
# edit .env.local if you need a custom CoinGecko base

# 4) Dev
npm run dev

# 5) Build
npm run build

# 6) Start production server
npm start
