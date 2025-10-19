"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CLAW_TOKEN_ADDRESS, CALW_TOKEN_ABI } from "@/config/contract";
import { parseUnits } from "viem";
import { Plus, Loader2 } from "lucide-react";

export default function MintPanel() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isBatch, setIsBatch] = useState(false);
  const [batchRecipients, setBatchRecipients] = useState("");
  const [batchAmounts, setBatchAmounts] = useState("");

  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBatch) {
      const recipients = batchRecipients.split(",").map((r) => r.trim());
      const amounts = batchAmounts
        .split(",")
        .map((a) => parseUnits(a.trim(), 18));

      if (recipients.length !== amounts.length) {
        alert("Recipients and amounts count must match!");
        return;
      }

      writeContract({
        address: CLAW_TOKEN_ADDRESS as `0x${string}`,
        abi: CALW_TOKEN_ABI,
        functionName: "batchMint",
        args: [recipients as `0x${string}`[], amounts],
      });
    } else {
      if (!recipient || !amount) return;

      writeContract({
        address: CLAW_TOKEN_ADDRESS as `0x${string}`,
        abi: CALW_TOKEN_ABI,
        functionName: "mint",
        args: [recipient as `0x${string}`, parseUnits(amount, 18)],
      });
    }
  };

  if (isSuccess) {
    setTimeout(() => {
      setRecipient("");
      setAmount("");
      setBatchRecipients("");
      setBatchAmounts("");
    }, 2000);
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Plus className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-bold text-white">Mint Tokens</h3>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={isBatch}
            onChange={(e) => setIsBatch(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span>Batch Mint</span>
        </label>
      </div>

      <form onSubmit={handleMint} className="space-y-4">
        {!isBatch ? (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
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
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                disabled={isPending || isConfirming}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Recipients (comma-separated addresses)
              </label>
              <textarea
                value={batchRecipients}
                onChange={(e) => setBatchRecipients(e.target.value)}
                placeholder="0x..., 0x..., 0x..."
                rows={3}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                disabled={isPending || isConfirming}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Amounts (comma-separated values)
              </label>
              <textarea
                value={batchAmounts}
                onChange={(e) => setBatchAmounts(e.target.value)}
                placeholder="100, 200, 300"
                rows={3}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                disabled={isPending || isConfirming}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isPending ? "Confirming..." : "Processing..."}
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Mint
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
              ✓ Tokens minted successfully!
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
