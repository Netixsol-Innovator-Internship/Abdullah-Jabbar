// file: src/components/CoinChart.tsx
"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";

type Props = {
  prices: [number, number][];
  height?: number;
  compact?: boolean; // small sparkline variant
};

export default function CoinChart({ prices, height = 240, compact = false }: Props) {
  const data = useMemo(
    () =>
      prices.map(([ts, price]) => ({
        t: new Date(ts),
        p: price
      })),
    [prices]
  );

  return (
    <div className={`w-full ${compact ? "max-h-20" : ""}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          {!compact && <XAxis dataKey="t" tickFormatter={(v) => new Date(v).toLocaleDateString()} hide={compact} />}
          {!compact && <YAxis domain={["auto", "auto"]} hide={compact} />}
          <Tooltip
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Price"]}
            labelFormatter={(v) => new Date(v as string).toLocaleString()}
          />
          <Area type="monotone" dataKey="p" fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
