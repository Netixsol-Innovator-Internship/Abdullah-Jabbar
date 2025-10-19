"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CLAW_TOKEN_ADDRESS, CALW_TOKEN_ABI } from "@/config/contract";
import { parseUnits } from "viem";
import { Send, Loader2 } from "lucide-react";

export default function TransferTokens() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const { data: hash, isPending, writeContract, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;

    try {
      writeContract({
        address: CLAW_TOKEN_ADDRESS as `0x${string}`,
        abi: CALW_TOKEN_ABI,
        functionName: "transfer",
        args: [recipient as `0x${string}`, parseUnits(amount, 18)],
      });
    } catch (err) {
      console.error("Transfer error:", err);
    }
  };

  if (isSuccess) {
    setTimeout(() => {
      setRecipient("");
      setAmount("");
    }, 2000);
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
          <Send className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white">Transfer Tokens</h3>
      </div>

      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
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
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            disabled={isPending || isConfirming}
          />
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming || !recipient || !amount}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isPending ? "Confirming..." : "Processing..."}
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Transfer
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
            <p className="text-sm text-green-400">✓ Transfer successful!</p>
          </div>
        )}
      </form>
    </div>
  );
}
