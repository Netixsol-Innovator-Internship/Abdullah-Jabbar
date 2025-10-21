"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useI18n } from "@/i18n/i18nContext";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceChartProps {
  tokenA: string;
  tokenB: string;
  currentPrice: number;
}

export default function PriceChart({
  tokenA,
  tokenB,
  currentPrice,
}: PriceChartProps) {
  const { t } = useI18n();

  // In a real application, you'd fetch historical price data from an API
  // or blockchain events. For this demo, we'll generate simulated data
  // based on the current price
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  useEffect(() => {
    if (!currentPrice || currentPrice <= 0) {
      setPriceHistory([]);
      return;
    }

    // Generate simulated price data around the current price
    const generateSimulatedPriceHistory = () => {
      const volatility = currentPrice * 0.15; // 15% volatility
      const dataPoints = 24; // 24 hours
      const prices = [];

      // Generate prices with some randomness around the current price
      let lastPrice = currentPrice * 0.9; // Start slightly below current price

      for (let i = 0; i < dataPoints; i++) {
        // Random price movement with trend toward current price
        const movement = (Math.random() - 0.4) * volatility;
        const trendFactor = (currentPrice - lastPrice) * 0.05;
        lastPrice = Math.max(0.001, lastPrice + movement + trendFactor);
        prices.push(lastPrice);
      }

      // Make sure the last point is the current price
      prices[dataPoints - 1] = currentPrice;

      return prices;
    };

    setPriceHistory(generateSimulatedPriceHistory());
  }, [currentPrice]);

  // Prepare chart data
  const labels =
    priceHistory.length > 0
      ? Array.from({ length: priceHistory.length }, (_, i) => `${24 - i}h`)
      : [];

  labels.reverse();

  const data = {
    labels,
    datasets: [
      {
        label: `${tokenA}/${tokenB} Price`,
        data: [...priceHistory].reverse(), // Most recent data point on the right
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: function (context: TooltipItem<"line">) {
            return `Price: ${parseFloat(context.raw as string).toFixed(6)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "rgba(148, 163, 184, 1)",
        },
        grid: {
          color: "rgba(51, 65, 85, 0.3)",
        },
      },
      y: {
        ticks: {
          color: "rgba(148, 163, 184, 1)",
          callback: function (value: number | string) {
            return parseFloat(value.toString()).toFixed(4);
          },
        },
        grid: {
          color: "rgba(51, 65, 85, 0.3)",
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  if (priceHistory.length === 0) {
    return (
      <div className="price-chart-container loading">
        <div className="loading-spinner">{t("dex.loadingPriceData")}</div>
      </div>
    );
  }

  return (
    <div className="price-chart-container">
      <div className="chart-header">
        <h3 className="chart-title">
          {tokenA}/{tokenB} {t("dex.priceChart")}
        </h3>
        <div className="chart-price">
          <span className="current-price">{currentPrice.toFixed(6)}</span>
          <span className="price-change">
            {(
              ((currentPrice - priceHistory[0]) / priceHistory[0]) *
              100
            ).toFixed(2)}
            % {t("dex.24h")}
          </span>
        </div>
      </div>
      <div className="chart-wrapper">
        <Line data={data} options={options} height={240} />
      </div>
    </div>
  );
}
