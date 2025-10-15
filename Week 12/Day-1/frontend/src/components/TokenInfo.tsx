"use client";

import { useReadContract, useAccount, useChainId } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import { formatUnits } from "viem";
import { Info, TrendingUp, Users, Shield, AlertCircle } from "lucide-react";

export default function TokenInfo() {
  const { address } = useAccount();
  const chainId = useChainId();

  const {
    data: name,
    error: nameError,
    isLoading: nameLoading,
  } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "name",
  });

  const {
    data: symbol,
    error: symbolError,
    isLoading: symbolLoading,
  } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "symbol",
  });

  const {
    data: totalSupply,
    error: supplyError,
    isLoading: supplyLoading,
  } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "totalSupply",
  });

  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: taxRate } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "taxRate",
  });

  const { data: maxTxAmount } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "maxTransactionAmount",
  });

  const { data: isPaused } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "paused",
  });

  const formatBalance = (value: bigint | undefined) => {
    if (!value) return "0";
    try {
      const formattedString = formatUnits(value, 18);
      const numValue = parseFloat(formattedString);

      // Handle very large numbers
      if (numValue >= 1e15) {
        return numValue.toExponential(2);
      }

      // Format with commas for readability
      return numValue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch (error) {
      console.error("Error formatting balance:", error);
      return "0";
    }
  };

  // Debug logging
  console.log("TokenInfo Debug:", {
    contractAddress: CONTRACT_ADDRESS,
    chainId,
    nameRaw: name,
    nameType: typeof name,
    nameString: name ? String(name) : "null",
    symbolRaw: symbol,
    symbolType: typeof symbol,
    symbolString: symbol ? String(symbol) : "null",
    totalSupplyRaw: totalSupply,
    totalSupplyType: typeof totalSupply,
    totalSupply: totalSupply?.toString(),
    totalSupplyFormatted: formatBalance(totalSupply as bigint),
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

  const formatRawNumber = (value: bigint | undefined) => {
    if (!value) return "0";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Check for errors
  const hasError = nameError || symbolError || supplyError;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
          <Info className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Token Information</h2>
        {isPaused && (
          <span className="ml-auto px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 text-sm font-medium">
            ⏸ Paused
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Token Name & Symbol */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-slate-400" />
            <p className="text-sm text-slate-400">Token</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {nameLoading ? "Loading..." : name ? String(name) : "N/A"}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {symbolLoading ? "Loading..." : symbol ? String(symbol) : "N/A"}
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
                ? formatBalance(totalSupply)
                : "0"}
          </p>
        </div>

        {/* Your Balance */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <p className="text-sm text-slate-400">Your Balance</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {balance ? formatBalance(balance as bigint) : "0.00"}
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
          <p className="text-sm text-slate-400 mt-1">
            Max Tx:{" "}
            {maxTxAmount ? formatBalance(maxTxAmount as bigint) : "0.00"}
          </p>
        </div>
      </div>
    </div>
  );
}
