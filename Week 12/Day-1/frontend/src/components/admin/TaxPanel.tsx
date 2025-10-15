"use client";

import { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import { DollarSign, Loader2, Clock } from "lucide-react";

export default function TaxPanel() {
  const [newTaxRate, setNewTaxRate] = useState("");
  const [newReceiver, setNewReceiver] = useState("");

  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: currentTaxRate } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "taxRate",
  });

  const { data: taxReceiver } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "taxReceiver",
  });

  const handleProposeTaxRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaxRate) return;

    // Convert percentage to basis points (e.g., 3% = 300)
    const basisPoints = Math.floor(parseFloat(newTaxRate) * 100);

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "proposeTaxRateChange",
      args: [BigInt(basisPoints)],
    });
  };

  const handleExecuteTaxRate = () => {
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "executeTaxRateChange",
    });
  };

  const handleRevokeTaxRate = () => {
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "revokeTaxRateChange",
    });
  };

  const handleSetReceiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReceiver) return;

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "setTaxReceiver",
      args: [newReceiver as `0x${string}`],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-bold text-white">Tax Configuration</h3>
      </div>

      {/* Current Settings */}
      <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
        <p className="text-sm text-slate-400">
          Current Tax Rate:{" "}
          <span className="text-white font-medium">
            {currentTaxRate ? (Number(currentTaxRate) / 100).toFixed(2) : "0"}%
          </span>
        </p>
        <p className="text-sm text-slate-400">
          Tax Receiver:{" "}
          <span className="text-white font-mono text-xs">
            {taxReceiver?.toString() || "N/A"}
          </span>
        </p>
      </div>

      {/* Propose Tax Rate Change */}
      <form onSubmit={handleProposeTaxRate} className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <label className="block text-sm font-medium text-slate-300">
              Propose New Tax Rate (%) - 24h timelock
            </label>
          </div>
          <input
            type="number"
            value={newTaxRate}
            onChange={(e) => setNewTaxRate(e.target.value)}
            placeholder="3.0 (max 10%)"
            step="0.01"
            max="10"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            disabled={isPending || isConfirming}
          />
          <p className="text-xs text-slate-500 mt-1">
            Maximum allowed: 10%. Changes require 24-hour timelock.
          </p>
        </div>
        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending || isConfirming ? (
            <Loader2 className="w-4 h-4 animate-spin inline" />
          ) : (
            "Propose Tax Rate"
          )}
        </button>
      </form>

      {/* Execute/Revoke */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleExecuteTaxRate}
          disabled={isPending || isConfirming}
          className="bg-green-500 hover:bg-green-600 disabled:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer disabled:cursor-not-allowed"
        >
          Execute Change
        </button>
        <button
          onClick={handleRevokeTaxRate}
          disabled={isPending || isConfirming}
          className="bg-red-500 hover:bg-red-600 disabled:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer disabled:cursor-not-allowed"
        >
          Revoke Change
        </button>
      </div>

      {/* Set Tax Receiver */}
      <form onSubmit={handleSetReceiver} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Set Tax Receiver Address
          </label>
          <input
            type="text"
            value={newReceiver}
            onChange={(e) => setNewReceiver(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            disabled={isPending || isConfirming}
          />
        </div>
        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer disabled:cursor-not-allowed"
        >
          Set Receiver
        </button>
      </form>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-sm text-red-400">
            {error.message?.split("\n")[0] || "Transaction failed"}
          </p>
        </div>
      )}

      {isSuccess && (
        <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
          <p className="text-sm text-green-400">✓ Operation successful!</p>
        </div>
      )}
    </div>
  );
}
