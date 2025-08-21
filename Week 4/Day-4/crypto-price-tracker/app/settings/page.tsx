// file: app/settings/page.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setCurrency, setPolling } from "@store/settingsSlice";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { currency, per_page, polling } = useAppSelector((s) => s.settings);

  return (
    <section className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Currency</label>
        <select
          aria-label="Currency"
          value={currency}
          onChange={(e) => dispatch(setCurrency(e.target.value as any))}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2"
        >
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="gbp">GBP</option>
          <option value="pkr">PKR</option>
        </select>
        <p className="text-xs text-gray-500">
          Applies across lists and charts where supported.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Coins per page</label>
        <input
          type="number"
          min={10}
          max={250}
          step={10}
          value={per_page}
          aria-label="Coins per page"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2"
        />
        <p className="text-xs text-gray-500">Affects Home list pagination.</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Polling interval (ms)
        </label>
        <input
          type="number"
          min={5000}
          step={1000}
          value={polling}
          aria-label="Polling interval"
          onChange={(e) =>
            dispatch(setPolling(Math.max(5000, Number(e.target.value))))
          }
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2"
        />
        <p className="text-xs text-gray-500">
          RTK Query refetch interval for market data.
        </p>
      </div>
    </section>
  );
}
