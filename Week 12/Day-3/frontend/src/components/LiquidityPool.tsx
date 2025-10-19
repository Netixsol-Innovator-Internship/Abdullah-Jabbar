"use client";

import { useReadContract, useAccount } from "wagmi";
import { TOKEN_SWAP_ADDRESS, SIMPLE_SWAP_ABI } from "../config/contract";

export default function LiquidityPool() {
  const { address } = useAccount();

  // Read pool info
  const { data: poolInfo } = useReadContract({
    address: TOKEN_SWAP_ADDRESS as `0x${string}`,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getPoolInfo",
  });

  // Read user liquidity
  const { data: userLiquidity } = useReadContract({
    address: TOKEN_SWAP_ADDRESS as `0x${string}`,
    abi: SIMPLE_SWAP_ABI,
    functionName: "liquidity",
    args: address ? [address] : undefined,
  });

  // Helper function to format token amounts (show raw values with commas)
  const formatTokenAmount = (value: bigint | undefined) => {
    if (!value) return "0";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // COMMENTED OUT: Add Liquidity Function
  // const handleAddLiquidity = async () => {
  //   if (!amountA || !amountB) return;
  //
  //   try {
  //     const amountAWei = parseEther(amountA);
  //     const amountBWei = parseEther(amountB);
  //
  //     writeContract({
  //       address: TOKEN_SWAP_ADDRESS as `0x${string}`,
  //       abi: SIMPLE_SWAP_ABI,
  //       functionName: "addLiquidity",
  //       args: [amountAWei, amountBWei],
  //     });
  //   } catch (error) {
  //     console.error("Add liquidity failed:", error);
  //   }
  // };

  // COMMENTED OUT: Remove Liquidity Function
  // const handleRemoveLiquidity = async () => {
  //   if (!liquidityToRemove) return;
  //
  //   try {
  //     const liquidityAmount = parseEther(liquidityToRemove);
  //
  //     writeContract({
  //       address: TOKEN_SWAP_ADDRESS as `0x${string}`,
  //       abi: SIMPLE_SWAP_ABI,
  //       functionName: "removeLiquidity",
  //       args: [liquidityAmount],
  //     });
  //   } catch (error) {
  //     console.error("Remove liquidity failed:", error);
  //   }
  // };

  // COMMENTED OUT: Calculate optimal amounts when adding liquidity
  // useEffect(() => {
  //   if (isAdding && amountA && poolInfo) {
  //     const [tokenA, tokenB, reserveA, reserveB] = poolInfo as [
  //       `0x${string}`,
  //       `0x${string}`,
  //       bigint,
  //       bigint,
  //       bigint,
  //       bigint,
  //       bigint,
  //     ];
  //     if (reserveA > BigInt(0) && reserveB > BigInt(0)) {
  //       const amountAWei = parseEther(amountA);
  //       const optimalAmountB = (amountAWei * reserveB) / reserveA;
  //       setAmountB(formatEther(optimalAmountB));
  //     }
  //   }
  // }, [amountA, poolInfo, isAdding]);

  // COMMENTED OUT: Auto-refresh on transaction success
  // useEffect(() => {
  //   if (isSuccess) {
  //     setAmountA("");
  //     setAmountB("");
  //     setLiquidityToRemove("");
  //     refetchPoolInfo();
  //     if (onLiquidityChange) {
  //       onLiquidityChange();
  //     }
  //   }
  // }, [isSuccess, onLiquidityChange, refetchPoolInfo]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 lg:p-6">
      <div className="flex items-center gap-2 mb-5">
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h2 className="text-xl font-bold text-gray-800">Liquidity Pool</h2>
      </div>

      {/* Pool Stats */}
      {poolInfo ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Pool Information
          </h3>
          <div className="space-y-2.5">
            <div
              key="claw-reserve"
              className="flex justify-between items-center bg-white/60 rounded-lg p-2.5"
            >
              <span className="text-xs font-medium text-gray-600">
                CLAW Reserve:
              </span>
              <span className="text-xs font-bold font-mono text-blue-700">
                {formatTokenAmount(
                  (
                    poolInfo as [
                      `0x${string}`,
                      `0x${string}`,
                      bigint,
                      bigint,
                      bigint,
                      bigint,
                      bigint,
                    ]
                  )[2]
                )}
              </span>
            </div>
            <div
              key="tiger-reserve"
              className="flex justify-between items-center bg-white/60 rounded-lg p-2.5"
            >
              <span className="text-xs font-medium text-gray-600">
                TIGER Reserve:
              </span>
              <span className="text-xs font-bold font-mono text-green-700">
                {formatTokenAmount(
                  (
                    poolInfo as [
                      `0x${string}`,
                      `0x${string}`,
                      bigint,
                      bigint,
                      bigint,
                      bigint,
                      bigint,
                    ]
                  )[3]
                )}
              </span>
            </div>
            <div
              key="total-liquidity"
              className="flex justify-between items-center bg-white/60 rounded-lg p-2.5"
            >
              <span className="text-xs font-medium text-gray-600">
                Total Liquidity:
              </span>
              <span className="text-xs font-bold font-mono text-indigo-700">
                {formatTokenAmount(
                  (
                    poolInfo as [
                      `0x${string}`,
                      `0x${string}`,
                      bigint,
                      bigint,
                      bigint,
                      bigint,
                      bigint,
                    ]
                  )[4]
                )}
              </span>
            </div>
            <div
              key="user-liquidity"
              className="flex justify-between items-center bg-white/60 rounded-lg p-2.5 border border-green-200"
            >
              <span className="text-xs font-medium text-gray-600">
                Your Liquidity:
              </span>
              <span className="text-xs font-bold font-mono text-green-700">
                {userLiquidity
                  ? formatTokenAmount(userLiquidity as bigint)
                  : "0"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-500">Loading pool information...</p>
        </div>
      )}

      {/* COMMENTED OUT: Add/Remove Liquidity Forms */}
      {/* {isAdding ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CLAW Amount
            </label>
            <input
              type="number"
              value={amountA}
              onChange={(e) => setAmountA(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TIGER Amount {poolExists && "(Auto-calculated)"}
            </label>
            <input
              type="number"
              value={amountB}
              onChange={(e) => !poolExists && setAmountB(e.target.value)}
              placeholder="0.0"
              readOnly={poolExists}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                poolExists ? "bg-gray-50" : ""
              }`}
            />
          </div>

          <button
            onClick={handleAddLiquidity}
            disabled={!amountA || !amountB || isPending || isConfirming}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {isPending || isConfirming ? "Processing..." : "Add Liquidity"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Liquidity Amount to Remove
            </label>
            <input
              type="number"
              value={liquidityToRemove}
              onChange={(e) => setLiquidityToRemove(e.target.value)}
              placeholder="0.0"
              max={userLiquidity ? formatEther(userLiquidity as bigint) : "0"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleRemoveLiquidity}
            disabled={!liquidityToRemove || isPending || isConfirming}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {isPending || isConfirming ? "Processing..." : "Remove Liquidity"}
          </button>
        </div>
      )} */}

      {/* COMMENTED OUT: Transaction Status Messages */}
      {/* {hash && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700">
            Transaction submitted:
            <a
              href={`https://etherscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 underline hover:no-underline"
            >
              View on Etherscan
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg">
          <div className="text-sm text-red-700">Error: {error.message}</div>
        </div>
      )} */}
    </div>
  );
}
