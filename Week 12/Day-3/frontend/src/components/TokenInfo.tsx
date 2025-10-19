"use client";

import { useReadContract, useAccount, useChainId } from "wagmi";
import { CLAW_TOKEN_ADDRESS, CALW_TOKEN_ABI } from "@/config/contract";
import { formatUnits } from "viem";
import { Info, TrendingUp, Users, Shield } from "lucide-react";

export default function TokenInfo() {
  const { address } = useAccount();
  const chainId = useChainId();

  const {
    data: name,
    error: nameError,
    isLoading: nameLoading,
  } = useReadContract({
    address: CLAW_TOKEN_ADDRESS as `0x${string}`,
    abi: CALW_TOKEN_ABI,
    functionName: "name",
  });

  const {
    data: symbol,
    error: symbolError,
    isLoading: symbolLoading,
  } = useReadContract({
    address: CLAW_TOKEN_ADDRESS as `0x${string}`,
    abi: CALW_TOKEN_ABI,
    functionName: "symbol",
  });

  const {
    data: totalSupply,
    error: supplyError,
    isLoading: supplyLoading,
  } = useReadContract({
    address: CLAW_TOKEN_ADDRESS as `0x${string}`,
    abi: CALW_TOKEN_ABI,
    functionName: "totalSupply",
  });

  const { data: balance } = useReadContract({
    address: CLAW_TOKEN_ADDRESS as `0x${string}`,
    abi: CALW_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: taxRate } = useReadContract({
    address: CLAW_TOKEN_ADDRESS as `0x${string}`,
    abi: CALW_TOKEN_ABI,
    functionName: "taxRate",
  });

  const { data: isPaused } = useReadContract({
    address: CLAW_TOKEN_ADDRESS as `0x${string}`,
    abi: CALW_TOKEN_ABI,
    functionName: "paused",
  });

  const { data: decimals } = useReadContract({
    address: CLAW_TOKEN_ADDRESS as `0x${string}`,
    abi: CALW_TOKEN_ABI,
    functionName: "decimals",
  });

  const formatBalance = (value: bigint | undefined, useDecimals?: number) => {
    if (!value) return "0";
    try {
      // Use fetched decimals or fallback to 18
      const tokenDecimals = useDecimals ?? (decimals ? Number(decimals) : 18);
      const formattedString = formatUnits(value, tokenDecimals);
      const numValue = parseFloat(formattedString);

      // Handle very large numbers
      if (numValue >= 1e15) {
        return numValue.toExponential(2);
      }

      // Format with commas for readability
      return numValue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6, // Show more decimals for precision
      });
    } catch (error) {
      console.error("Error formatting balance:", error);
      return "0";
    }
  };

  // Debug logging
  console.log("TokenInfo Debug:", {
    contractAddress: CLAW_TOKEN_ADDRESS,
    chainId,
    decimals: decimals?.toString(),
    nameRaw: name,
    nameType: typeof name,
    nameString: name ? String(name) : "null",
    symbolRaw: symbol,
    symbolType: typeof symbol,
    symbolString: symbol ? String(symbol) : "null",
    totalSupplyRaw: totalSupply,
    totalSupplyType: typeof totalSupply,
    totalSupply: totalSupply?.toString(),
    totalSupplyFormatted: formatBalance(
      totalSupply as bigint,
      decimals ? Number(decimals) : undefined
    ),
    nameError: nameError?.message,
    symbolError: symbolError?.message,
    supplyError: supplyError?.message,
    nameLoading,
    symbolLoading,
    supplyLoading,
  });

  const formatTaxRate = (rate: bigint | undefined) => {
    if (!rate) return "0";
    return (Number(rate) / 100).toFixed(2);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
          <Info className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Token Information</h2>
        {isPaused ? (
          <span className="ml-auto px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 text-sm font-medium">
            ⏸ Paused
          </span>
        ) : null}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Token Name & Symbol */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-slate-400" />
            <p className="text-sm text-slate-400">Token</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {nameLoading || symbolLoading ? (
              "Loading..."
            ) : (
              <>
                {name ? String(name) : "N/A"}
                {symbol && (
                  <span className="text-lg text-slate-400 ml-2">
                    ({String(symbol)})
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Total Supply */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <p className="text-sm text-slate-400">Total Supply</p>
          </div>
          <p className="text-2xl font-bold text-white font-mono">
            {supplyLoading
              ? "Loading..."
              : totalSupply
                ? totalSupply.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : "0"}
          </p>
        </div>

        {/* Your Balance */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <p className="text-sm text-slate-400">Your Balance</p>
          </div>
          <p className="text-2xl font-bold text-white font-mono">
            {balance
              ? balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "0"}
          </p>
        </div>

        {/* Tax Rate */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-slate-400" />
            <p className="text-sm text-slate-400">Transfer Tax</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {taxRate ? formatTaxRate(taxRate as bigint) : "0.00"}%
          </p>
        </div>
      </div>
    </div>
  );
}
