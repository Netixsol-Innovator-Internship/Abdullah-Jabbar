"use client";

import { useReadContract } from "wagmi";
import { TOKEN_SWAP_ADDRESS, SIMPLE_SWAP_ABI } from "../config/contract";
import { TrendingUp, BarChart3, Droplet, Percent } from "lucide-react";

export default function PriceDisplay() {
  // Read pool info
  const { data: poolInfo, isLoading } = useReadContract({
    address: TOKEN_SWAP_ADDRESS as `0x${string}`,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getPoolInfo",
  });

  // Read current price
  const { data: currentPrice } = useReadContract({
    address: TOKEN_SWAP_ADDRESS as `0x${string}`,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getPrice",
  });

  // Helper to format raw token amounts
  const formatTokenAmount = (value: bigint | undefined) => {
    if (!value) return "0";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!poolInfo || !currentPrice) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Price Information
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Pool not initialized</p>
          <p className="text-sm text-gray-400 mt-2">
            Add liquidity to start trading
          </p>
        </div>
      </div>
    );
  }

  // Correct indices: [tokenA, tokenB, reserveA, reserveB, totalLiquidity, price, feeRate]
  const [, , reserveA, reserveB, totalLiquidity, , feeRate] = poolInfo as [
    `0x${string}`,
    `0x${string}`,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
  ];

  // Calculate exchange rates based on raw values
  const clawToTiger =
    reserveA > BigInt(0) ? Number(reserveB) / Number(reserveA) : 0;
  const tigerToClaw =
    reserveB > BigInt(0) ? Number(reserveA) / Number(reserveB) : 0;

  // Calculate pool composition percentage
  const totalValue = Number(reserveA) + Number(reserveB);
  const clawPercentage =
    totalValue > 0 ? (Number(reserveA) / totalValue) * 100 : 50;
  const tigerPercentage =
    totalValue > 0 ? (Number(reserveB) / totalValue) * 100 : 50;

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-xl shadow-lg p-5 lg:p-6 border border-blue-100">
      <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        Price Information
      </h2>

      {/* Current Prices */}
      <div className="space-y-3 mb-5">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3.5 text-white shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              CLAW → TIGER
            </span>
            <span className="text-lg font-bold">{clawToTiger.toFixed(4)}</span>
          </div>
          <p className="text-xs opacity-90">
            1 CLAW = {clawToTiger.toFixed(6)} TIGER
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3.5 text-white shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              TIGER → CLAW
            </span>
            <span className="text-lg font-bold">{tigerToClaw.toFixed(4)}</span>
          </div>
          <p className="text-xs opacity-90">
            1 TIGER = {tigerToClaw.toFixed(6)} CLAW
          </p>
        </div>
      </div>

      {/* Pool Statistics */}
      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
          <Droplet className="w-4 h-4 text-blue-600" />
          Pool Reserves
        </h3>
        <div className="space-y-3">
          <div
            key="claw-reserve-display"
            className="bg-blue-50 rounded-lg p-2.5"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600">
                CLAW Reserve
              </span>
              <span className="text-xs font-bold text-blue-700 font-mono">
                {formatTokenAmount(reserveA)}
              </span>
            </div>
            <div className="text-xs text-gray-500 text-right">
              {clawPercentage.toFixed(2)}% of pool
            </div>
          </div>

          <div
            key="tiger-reserve-display"
            className="bg-green-50 rounded-lg p-2.5"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600">
                TIGER Reserve
              </span>
              <span className="text-xs font-bold text-green-700 font-mono">
                {formatTokenAmount(reserveB)}
              </span>
            </div>
            <div className="text-xs text-gray-500 text-right">
              {tigerPercentage.toFixed(2)}% of pool
            </div>
          </div>

          <div
            key="total-liquidity-display"
            className="pt-2.5 border-t border-gray-200"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">
                Total Liquidity
              </span>
              <span className="text-xs font-bold text-indigo-700 font-mono">
                {formatTokenAmount(totalLiquidity)}
              </span>
            </div>
          </div>

          <div
            key="trading-fee-display"
            className="flex justify-between items-center bg-green-50 rounded-lg p-2"
          >
            <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <Percent className="w-3 h-3 text-green-600" />
              Trading Fee
            </span>
            <span className="text-xs font-bold text-green-700">
              {Number(feeRate) / 100}%
            </span>
          </div>
        </div>
      </div>

      {/* Pool Composition */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Pool Composition
        </h3>
        <div className="flex space-x-0.5 mb-2 h-4 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
            style={{
              width: `${clawPercentage}%`,
            }}
          ></div>
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
            style={{
              width: `${tigerPercentage}%`,
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-blue-600 font-semibold">
            CLAW {clawPercentage.toFixed(1)}%
          </span>
          <span className="text-green-600 font-semibold">
            TIGER {tigerPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live Data
        </p>
      </div>
    </div>
  );
}
