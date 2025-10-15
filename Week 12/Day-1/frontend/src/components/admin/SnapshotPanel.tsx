"use client";

import { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import { formatUnits } from "viem";
import { Camera, Loader2 } from "lucide-react";

export default function SnapshotPanel() {
  const [snapshotId, setSnapshotId] = useState("");
  const [queryAddress, setQueryAddress] = useState("");
  const [lastSnapshotId, setLastSnapshotId] = useState<number | null>(null);

  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    onReplaced: (replacement) => {
      // Extract snapshot ID from event logs if available
      console.log("Transaction replaced:", replacement);
    },
  });

  const { data: balanceAtSnapshot } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "balanceOfAt",
    args:
      queryAddress && snapshotId
        ? [queryAddress as `0x${string}`, BigInt(snapshotId)]
        : undefined,
  });

  const { data: totalSupplyAtSnapshot } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "totalSupplyAt",
    args: snapshotId ? [BigInt(snapshotId)] : undefined,
  });

  const handleCreateSnapshot = () => {
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "snapshot",
    });
  };

  const formatBalance = (value: bigint | undefined) => {
    if (!value) return "0";
    return parseFloat(formatUnits(value, 18)).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-bold text-white">Snapshot Management</h3>
      </div>

      {/* Create Snapshot */}
      <div className="bg-slate-800/50 rounded-lg p-4 space-y-4">
        <p className="text-sm text-slate-400">
          Create a snapshot to record current token balances for governance or
          airdrops.
        </p>
        <button
          onClick={handleCreateSnapshot}
          disabled={isPending || isConfirming}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
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
        {lastSnapshotId !== null && (
          <p className="text-sm text-green-400">
            ✓ Last created snapshot ID: {lastSnapshotId}
          </p>
        )}
      </div>

      {/* Query Snapshot */}
      <div className="bg-slate-800/50 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-white">Query Snapshot Data</h4>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Snapshot ID
          </label>
          <input
            type="number"
            value={snapshotId}
            onChange={(e) => setSnapshotId(e.target.value)}
            placeholder="1"
            min="1"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Address to Query (optional)
          </label>
          <input
            type="text"
            value={queryAddress}
            onChange={(e) => setQueryAddress(e.target.value)}
            placeholder="0x... (leave empty for total supply only)"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
          />
        </div>

        {snapshotId && (
          <div className="space-y-2 pt-4 border-t border-slate-700">
            {queryAddress && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">
                  Balance at Snapshot:
                </span>
                <span className="text-white font-medium">
                  {formatBalance(balanceAtSnapshot as bigint)} CLAW
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">
                Total Supply at Snapshot:
              </span>
              <span className="text-white font-medium">
                {formatBalance(totalSupplyAtSnapshot as bigint)} CLAW
              </span>
            </div>
          </div>
        )}
      </div>

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
            ✓ Snapshot created successfully!
          </p>
        </div>
      )}
    </div>
  );
}
