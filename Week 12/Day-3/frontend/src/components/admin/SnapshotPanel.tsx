"use client";

import { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { CLAW_TOKEN_ADDRESS, CALW_TOKEN_ABI } from "@/config/contract";
import { formatUnits } from "viem";
import { Camera, Loader2 } from "lucide-react";

export default function SnapshotPanel() {
  const [snapshotId, setSnapshotId] = useState("");
  const [queryAddress, setQueryAddress] = useState("");

  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: balanceAtSnapshot } = useReadContract({
    address: CLAW_TOKEN_ADDRESS as `0x${string}`,
    abi: CALW_TOKEN_ABI,
    functionName: "balanceOfAt",
    args:
      queryAddress && snapshotId
        ? [queryAddress as `0x${string}`, BigInt(snapshotId)]
        : undefined,
  });

  const handleSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();

    writeContract({
      address: CLAW_TOKEN_ADDRESS as `0x${string}`,
      abi: CALW_TOKEN_ABI,
      functionName: "snapshot",
    });
  };

  const formatBalance = (value: bigint | undefined) => {
    if (!value) return "0";
    return Number(formatUnits(value, 18)).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Camera className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-bold text-white">Snapshot Management</h3>
      </div>

      <form onSubmit={handleSnapshot} className="space-y-4">
        <div>
          <button
            type="submit"
            disabled={isPending || isConfirming}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Snapshot...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                Create Snapshot
              </>
            )}
          </button>
        </div>

        {isSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-green-400 text-sm">
              Snapshot created successfully!
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">
              Error: {error.message.slice(0, 100)}
            </p>
          </div>
        )}
      </form>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <h4 className="text-md font-semibold text-white mb-4">
          Query Balance at Snapshot
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Snapshot ID
            </label>
            <input
              type="number"
              value={snapshotId}
              onChange={(e) => setSnapshotId(e.target.value)}
              placeholder="Enter snapshot ID"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Address
            </label>
            <input
              type="text"
              value={queryAddress}
              onChange={(e) => setQueryAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {balanceAtSnapshot !== undefined && (
            <div className="bg-slate-700/30 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-1">Balance at Snapshot</p>
              <p className="text-2xl font-bold text-white">
                {formatBalance(balanceAtSnapshot as bigint)} CLAW
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
