"use client";

import { useState, useEffect } from "react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { ArrowUpDown, TrendingUp, TrendingDown, Info } from "lucide-react";
import {
  TOKEN_SWAP_ADDRESS,
  SIMPLE_SWAP_ABI,
  CLAW_TOKEN_ADDRESS,
  TIGER_TOKEN_ADDRESS,
  CALW_TOKEN_ABI,
  TIGER_TOKEN_ABI,
} from "../config/contract";

interface SwapInterfaceProps {
  onSwapComplete?: () => void;
}

export default function SwapInterface({ onSwapComplete }: SwapInterfaceProps) {
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");
  const [isSwapAForB, setIsSwapAForB] = useState(true);
  const [slippage, setSlippage] = useState("0.5");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceImpact, setPriceImpact] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const { address } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Fix hydration error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Read pool info
  const { data: poolInfo, refetch: refetchPoolInfo } = useReadContract({
    address: TOKEN_SWAP_ADDRESS as `0x${string}`,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getPoolInfo",
  });

  // Read token balances
  const { data: clawBalance, refetch: refetchClawBalance } = useReadContract({
    address: CLAW_TOKEN_ADDRESS as `0x${string}`,
    abi: CALW_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: tigerBalance, refetch: refetchTigerBalance } = useReadContract({
    address: TIGER_TOKEN_ADDRESS as `0x${string}`,
    abi: TIGER_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Read token allowances for the swap contract
  const { data: clawAllowance, refetch: refetchClawAllowance } =
    useReadContract({
      address: CLAW_TOKEN_ADDRESS as `0x${string}`,
      abi: CALW_TOKEN_ABI,
      functionName: "allowance",
      args: address ? [address, TOKEN_SWAP_ADDRESS] : undefined,
    });

  const { data: tigerAllowance, refetch: refetchTigerAllowance } =
    useReadContract({
      address: TIGER_TOKEN_ADDRESS as `0x${string}`,
      abi: TIGER_TOKEN_ABI,
      functionName: "allowance",
      args: address ? [address, TOKEN_SWAP_ADDRESS] : undefined,
    });

  // Calculate output amount when input changes
  useEffect(() => {
    if (amountIn && poolInfo && Number(amountIn) > 0) {
      const [, , reserveA, reserveB] = poolInfo as [
        string,
        string,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
      ];
      const reserveIn = isSwapAForB ? reserveA : reserveB;
      const reserveOut = isSwapAForB ? reserveB : reserveA;

      if (reserveIn > BigInt(0) && reserveOut > BigInt(0)) {
        try {
          // Convert input amount to BigInt (no decimal conversion needed)
          const amountInBigInt = BigInt(Math.floor(Number(amountIn)));
          const feeRate = BigInt(30); // 0.3%
          const basisPoints = BigInt(10000);

          const amountInWithFee = amountInBigInt * (basisPoints - feeRate);
          const numerator = amountInWithFee * reserveOut;
          const denominator = reserveIn * basisPoints + amountInWithFee;
          const outputAmount = numerator / denominator;

          // Convert output to string (no decimal conversion needed)
          setAmountOut(outputAmount.toString());

          // Calculate price impact using Numbers
          const reserveInNum = Number(reserveIn);
          const reserveOutNum = Number(reserveOut);
          const amountInNum = Number(amountInBigInt);
          const outputAmountNum = Number(outputAmount);

          const currentPrice = isSwapAForB
            ? reserveOutNum / reserveInNum
            : reserveInNum / reserveOutNum;

          const newReserveInNum = reserveInNum + amountInNum;
          const newReserveOutNum = reserveOutNum - outputAmountNum;
          const newPrice = isSwapAForB
            ? newReserveOutNum / newReserveInNum
            : newReserveInNum / newReserveOutNum;

          const impact = Math.abs(
            ((newPrice - currentPrice) / currentPrice) * 100
          );
          setPriceImpact(impact.toFixed(2));
        } catch (error) {
          console.error("Error calculating output:", error);
          setAmountOut("0");
          setPriceImpact("0");
        }
      }
    } else {
      setAmountOut("");
      setPriceImpact("0");
    }
  }, [amountIn, poolInfo, isSwapAForB]);

  const handleSwap = async () => {
    if (!amountIn || !amountOut || !address) return;

    setIsLoading(true);
    setErrorMessage("");
    try {
      // Convert to BigInt (no decimal conversion)
      const amountInBigInt = BigInt(Math.floor(Number(amountIn)));

      // Check if approval is needed
      const allowance = isSwapAForB ? clawAllowance : tigerAllowance;
      if (!allowance || (allowance as bigint) < amountInBigInt) {
        setErrorMessage("Insufficient allowance. Please approve tokens first.");
        setIsLoading(false);
        return;
      }

      if (isSwapAForB) {
        writeContract({
          address: TOKEN_SWAP_ADDRESS as `0x${string}`,
          abi: SIMPLE_SWAP_ABI,
          functionName: "swapAForB",
          args: [amountInBigInt],
        });
      } else {
        writeContract({
          address: TOKEN_SWAP_ADDRESS as `0x${string}`,
          abi: SIMPLE_SWAP_ABI,
          functionName: "swapBForA",
          args: [amountInBigInt],
        });
      }
    } catch (error) {
      console.error("Swap failed:", error);
      setErrorMessage("Swap failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlipTokens = () => {
    setIsSwapAForB(!isSwapAForB);
    setAmountIn(amountOut);
    setAmountOut(amountIn);
  };

  const handleApprove = async () => {
    if (!amountIn || !address) return;

    try {
      // Convert to BigInt (no decimal conversion)
      const amountInBigInt = BigInt(Math.floor(Number(amountIn)));
      const tokenAddress = isSwapAForB
        ? CLAW_TOKEN_ADDRESS
        : TIGER_TOKEN_ADDRESS;
      const tokenAbi = isSwapAForB ? CALW_TOKEN_ABI : TIGER_TOKEN_ABI;

      writeContract({
        address: tokenAddress as `0x${string}`,
        abi: tokenAbi,
        functionName: "approve",
        args: [TOKEN_SWAP_ADDRESS, amountInBigInt],
      });
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  // Check if approval is needed
  const needsApproval = () => {
    if (!amountIn || !address) return false;
    try {
      // Convert to BigInt (no decimal conversion)
      const amountInBigInt = BigInt(Math.floor(Number(amountIn)));
      const allowance = isSwapAForB ? clawAllowance : tigerAllowance;
      return !allowance || (allowance as bigint) < amountInBigInt;
    } catch {
      return false;
    }
  };

  const tokenASymbol = "CLAW";
  const tokenBSymbol = "TIGER";
  const inputToken = isSwapAForB ? tokenASymbol : tokenBSymbol;
  const outputToken = isSwapAForB ? tokenBSymbol : tokenASymbol;

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess) {
      setAmountIn("");
      setAmountOut("");
      refetchPoolInfo();
      refetchClawBalance();
      refetchTigerBalance();
      refetchClawAllowance();
      refetchTigerAllowance();
      if (onSwapComplete) {
        onSwapComplete();
      }
    }
  }, [
    isSuccess,
    onSwapComplete,
    refetchPoolInfo,
    refetchClawBalance,
    refetchTigerBalance,
    refetchClawAllowance,
    refetchTigerAllowance,
  ]);

  const getPriceImpactColor = (impact: number) => {
    if (impact < 1) return "text-green-600";
    if (impact < 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getPriceImpactIcon = (impact: number) => {
    if (impact < 1) return <TrendingUp className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-5 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Swap Tokens</h2>
        </div>
        <div className="text-center py-8 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Swap Tokens</h2>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Advanced
        </button>
      </div>

      {/* Input Token */}
      <div className="bg-gray-50 rounded-lg p-4 mb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">From</span>
          <span className="text-sm text-gray-600">
            Balance:{" "}
            {inputToken === "CLAW"
              ? clawBalance
                ? (clawBalance as bigint).toString()
                : "0"
              : tigerBalance
                ? (tigerBalance as bigint).toString()
                : "0"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="number"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            placeholder="0.0"
            className="bg-transparent text-2xl font-semibold text-gray-800 outline-none flex-1"
          />
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-800">
              {inputToken}
            </span>
          </div>
        </div>
      </div>

      {/* Flip Button */}
      <div className="flex justify-center my-4">
        <button
          onClick={handleFlipTokens}
          className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full transition-colors"
        >
          <ArrowUpDown className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {/* Output Token */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">To</span>
          <span className="text-sm text-gray-600">
            Balance:{" "}
            {outputToken === "CLAW"
              ? clawBalance
                ? (clawBalance as bigint).toString()
                : "0"
              : tigerBalance
                ? (tigerBalance as bigint).toString()
                : "0"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="number"
            value={amountOut}
            readOnly
            placeholder="0.0"
            className="bg-transparent text-2xl font-semibold text-gray-800 outline-none flex-1"
          />
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-800">
              {outputToken}
            </span>
          </div>
        </div>
      </div>

      {/* Price Impact */}
      {Number(priceImpact) > 0 && (
        <div
          className={`flex items-center justify-between p-3 rounded-lg mb-4 ${
            Number(priceImpact) < 1
              ? "bg-green-50"
              : Number(priceImpact) < 3
                ? "bg-yellow-50"
                : "bg-red-50"
          }`}
        >
          <div className="flex items-center space-x-2">
            {getPriceImpactIcon(Number(priceImpact))}
            <span className="text-sm font-medium">Price Impact</span>
          </div>
          <span
            className={`text-sm font-semibold ${getPriceImpactColor(Number(priceImpact))}`}
          >
            {priceImpact}%
          </span>
        </div>
      )}

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Slippage Tolerance</span>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex space-x-2">
            {["0.1", "0.5", "1.0"].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  slippage === value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {value}%
              </button>
            ))}
            <input
              type="number"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              className="w-16 px-2 py-1 text-sm border rounded"
              step="0.1"
              min="0.1"
              max="50"
            />
          </div>
        </div>
      )}

      {/* Swap Button */}
      {!address ? (
        <div className="w-full bg-gray-100 text-gray-600 font-semibold py-3 px-4 rounded-lg text-center">
          Please connect your wallet
        </div>
      ) : needsApproval() ? (
        <button
          onClick={handleApprove}
          disabled={!amountIn || isPending || isConfirming || isLoading}
          className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          {isPending || isConfirming ? "Approving..." : `Approve ${inputToken}`}
        </button>
      ) : (
        <button
          onClick={handleSwap}
          disabled={
            !amountIn || !amountOut || isPending || isConfirming || isLoading
          }
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          {isPending || isConfirming
            ? "Processing..."
            : isLoading
              ? "Preparing..."
              : `Swap ${inputToken} for ${outputToken}`}
        </button>
      )}

      {/* Transaction Status */}
      {hash && (
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
      )}

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg">
          <div className="text-sm text-red-700">{errorMessage}</div>
        </div>
      )}

      {isSuccess && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-green-700">
            Transaction successful!{" "}
            {needsApproval() ? "You can now swap tokens." : ""}
          </div>
        </div>
      )}
    </div>
  );
}
