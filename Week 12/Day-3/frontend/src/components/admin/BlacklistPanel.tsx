"use client";

import { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { CLAW_TOKEN_ADDRESS, CALW_TOKEN_ABI } from "@/config/contract";
import { Ban, Loader2 } from "lucide-react";

export default function BlacklistPanel() {
  const [address, setAddress] = useState("");
  const [checkAddress, setCheckAddress] = useState("");

  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: isBlacklisted } = useReadContract({
    address: CLAW_TOKEN_ADDRESS as `0x${string}`,
    abi: CALW_TOKEN_ABI,
    functionName: "blacklisted",
    args: checkAddress ? [checkAddress as `0x${string}`] : undefined,
  });

  const handleAddToBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    writeContract({
      address: CLAW_TOKEN_ADDRESS as `0x${string}`,
      abi: CALW_TOKEN_ABI,
      functionName: "addToBlacklist",
      args: [address as `0x${string}`],
    });
  };

  const handleRemoveFromBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    writeContract({
      address: CLAW_TOKEN_ADDRESS as `0x${string}`,
      abi: CALW_TOKEN_ABI,
      functionName: "removeFromBlacklist",
      args: [address as `0x${string}`],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Ban className="w-5 h-5 text-red-400" />
        <h3 className="text-lg font-bold text-white">Blacklist Management</h3>
      </div>

      {/* Check Blacklist Status */}
      <div className="bg-slate-800/50 rounded-lg p-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Check Address Status
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={checkAddress}
            onChange={(e) => setCheckAddress(e.target.value)}
            placeholder="0x..."
            className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
          />
        </div>
        {checkAddress && (
          <p className="mt-2 text-sm">
            Status:{" "}
            {isBlacklisted ? (
              <span className="text-red-400 font-medium">🚫 Blacklisted</span>
            ) : (
              <span className="text-green-400 font-medium">
                ✓ Not Blacklisted
              </span>
            )}
          </p>
        )}
      </div>

      {/* Add to Blacklist */}
      <form onSubmit={handleAddToBlacklist} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Address to Blacklist
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            disabled={isPending || isConfirming}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="submit"
            disabled={isPending || isConfirming}
            className="bg-red-500 hover:bg-red-600 disabled:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending || isConfirming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Ban className="w-4 h-4" />
                Blacklist
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleRemoveFromBlacklist}
            disabled={isPending || isConfirming}
            className="bg-green-500 hover:bg-green-600 disabled:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer disabled:cursor-not-allowed"
          >
            Remove
          </button>
        </div>
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
