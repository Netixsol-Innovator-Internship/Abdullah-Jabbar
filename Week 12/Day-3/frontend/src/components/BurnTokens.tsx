"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CLAW_TOKEN_ADDRESS, CALW_TOKEN_ABI } from "@/config/contract";
import { parseUnits } from "viem";
import { Flame, Loader2 } from "lucide-react";

export default function BurnTokens() {
  const [amount, setAmount] = useState("");

  const { data: hash, isPending, writeContract, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleBurn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    try {
      writeContract({
        address: CLAW_TOKEN_ADDRESS as `0x${string}`,
        abi: CALW_TOKEN_ABI,
        functionName: "burn",
        args: [parseUnits(amount, 18)],
      });
    } catch (err) {
      console.error("Burn error:", err);
    }
  };

  if (isSuccess) {
    setTimeout(() => {
      setAmount("");
    }, 2000);
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white">Burn Tokens</h3>
      </div>

      <form onSubmit={handleBurn} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Amount to Burn
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.000001"
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            disabled={isPending || isConfirming}
          />
          <p className="text-xs text-slate-400 mt-1">
            Permanently remove tokens from circulation
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming || !amount}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isPending ? "Confirming..." : "Processing..."}
            </>
          ) : (
            <>
              <Flame className="w-4 h-4" />
              Burn
            </>
          )}
        </button>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-sm text-red-400">
              {error.message?.split("\n")[0] || "Transaction failed"}
            </p>
          </div>
        )}

        {isSuccess && (
          <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
            <p className="text-sm text-green-400">
              ✓ Tokens burned successfully!
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
