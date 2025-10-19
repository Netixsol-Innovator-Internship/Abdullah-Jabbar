"use client";

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { CLAW_TOKEN_ADDRESS, CALW_TOKEN_ABI } from "@/config/contract";
import { Pause, Play, Loader2 } from "lucide-react";

export default function PausePanel() {
  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: isPaused } = useReadContract({
    address: CLAW_TOKEN_ADDRESS as `0x${string}`,
    abi: CALW_TOKEN_ABI,
    functionName: "paused",
  });

  const handlePause = () => {
    writeContract({
      address: CLAW_TOKEN_ADDRESS as `0x${string}`,
      abi: CALW_TOKEN_ABI,
      functionName: "pause",
    });
  };

  const handleUnpause = () => {
    writeContract({
      address: CLAW_TOKEN_ADDRESS as `0x${string}`,
      abi: CALW_TOKEN_ABI,
      functionName: "unpause",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Pause className="w-5 h-5 text-orange-400" />
        <h3 className="text-lg font-bold text-white">Emergency Pause</h3>
      </div>

      {/* Current Status */}
      <div className="bg-slate-800/50 rounded-lg p-4">
        <p className="text-sm text-slate-400">
          Current Status:{" "}
          {isPaused ? (
            <span className="text-red-400 font-medium text-lg">⏸ PAUSED</span>
          ) : (
            <span className="text-green-400 font-medium text-lg">
              ▶ ACTIVE
            </span>
          )}
        </p>
        <p className="text-xs text-slate-500 mt-2">
          {isPaused
            ? "All token transfers are currently paused."
            : "Token transfers are operating normally."}
        </p>
      </div>

      {/* Pause/Unpause Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handlePause}
          disabled={isPending || isConfirming || isPaused === true}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending || isConfirming ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          )}
        </button>
        <button
          onClick={handleUnpause}
          disabled={isPending || isConfirming || isPaused === false}
          className="bg-green-500 hover:bg-green-600 disabled:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending || isConfirming ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Play className="w-4 h-4" />
              Unpause
            </>
          )}
        </button>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
        <p className="text-sm text-yellow-300">
          ⚠️ Warning: Pausing will stop all token transfers. Use only in
          emergencies.
        </p>
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
          <p className="text-sm text-green-400">✓ Operation successful!</p>
        </div>
      )}
    </div>
  );
}
