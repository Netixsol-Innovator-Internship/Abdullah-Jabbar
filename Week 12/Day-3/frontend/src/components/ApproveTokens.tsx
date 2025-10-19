"use client";

import { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { CLAW_TOKEN_ADDRESS, CALW_TOKEN_ABI } from "@/config/contract";
import { parseUnits, formatUnits } from "viem";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAccount } from "wagmi";

export default function ApproveTokens() {
  const [spender, setSpender] = useState("");
  const [amount, setAmount] = useState("");
  const { address } = useAccount();

  const { data: hash, isPending, writeContract, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: currentAllowance } = useReadContract({
    address: CLAW_TOKEN_ADDRESS as `0x${string}`,
    abi: CALW_TOKEN_ABI,
    functionName: "allowance",
    args: address && spender ? [address, spender as `0x${string}`] : undefined,
  });

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spender || !amount) return;

    try {
      // For safety, we use increaseAllowance if there's already an allowance
      const currentAmount = (currentAllowance as bigint) || BigInt(0);
      const newAmount = parseUnits(amount, 18);

      if (currentAmount > BigInt(0)) {
        // Use increaseAllowance
        writeContract({
          address: CLAW_TOKEN_ADDRESS as `0x${string}`,
          abi: CALW_TOKEN_ABI,
          functionName: "increaseAllowance",
          args: [spender as `0x${string}`, newAmount],
        });
      } else {
        // Use approve (from 0 to X)
        writeContract({
          address: CLAW_TOKEN_ADDRESS as `0x${string}`,
          abi: CALW_TOKEN_ABI,
          functionName: "approve",
          args: [spender as `0x${string}`, newAmount],
        });
      }
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  if (isSuccess) {
    setTimeout(() => {
      setSpender("");
      setAmount("");
    }, 2000);
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white">Approve Spender</h3>
      </div>

      <form onSubmit={handleApprove} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Spender Address
          </label>
          <input
            type="text"
            value={spender}
            onChange={(e) => setSpender(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            disabled={isPending || isConfirming}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.000001"
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            disabled={isPending || isConfirming}
          />
          {currentAllowance && (currentAllowance as bigint) > BigInt(0) ? (
            <p className="text-xs text-slate-400 mt-1">
              Current allowance:{" "}
              {parseFloat(formatUnits(currentAllowance as bigint, 18)).toFixed(
                4
              )}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming || !spender || !amount}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isPending ? "Confirming..." : "Processing..."}
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Approve
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
            <p className="text-sm text-green-400">✓ Approval successful!</p>
          </div>
        )}
      </form>
    </div>
  );
}
