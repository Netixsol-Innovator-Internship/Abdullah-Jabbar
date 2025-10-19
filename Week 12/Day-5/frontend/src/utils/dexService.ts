import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, MULTI_TOKEN_DEX_ABI } from "@/config/contract";
import type { PoolReserve } from "@/types/token";

/**
 * Creates a unique pool key for two token addresses
 */
export function createPoolKey(tokenA: string, tokenB: string): string {
  // Sort addresses to ensure consistent key regardless of order
  const [token0, token1] =
    tokenA.toLowerCase() < tokenB.toLowerCase()
      ? [tokenA, tokenB]
      : [tokenB, tokenA];
  return `${token0}-${token1}`;
}

/**
 * Fetches pool reserves for a token pair
 */
export async function fetchPoolReserve(
  tokenA: string,
  tokenB: string,
  provider: ethers.Provider
): Promise<PoolReserve | null> {
  try {
    if (
      CONTRACT_ADDRESSES.MultiTokenDEX === ethers.ZeroAddress ||
      tokenA === ethers.ZeroAddress ||
      tokenB === ethers.ZeroAddress
    ) {
      return null;
    }

    const dexContract = new ethers.Contract(
      CONTRACT_ADDRESSES.MultiTokenDEX,
      MULTI_TOKEN_DEX_ABI,
      provider
    );

    const [reserveA, reserveB] = await dexContract.getReserves(tokenA, tokenB);

    const reserveAFormatted = ethers.formatEther(reserveA);
    const reserveBFormatted = ethers.formatEther(reserveB);

    // Calculate price (tokenB per tokenA)
    const price =
      Number(reserveA) > 0
        ? (Number(reserveB) / Number(reserveA)).toFixed(6)
        : "0";

    return {
      tokenA,
      tokenB,
      reserveA: reserveAFormatted,
      reserveB: reserveBFormatted,
      price,
    };
  } catch (error) {
    console.error(`Error fetching reserves for ${tokenA} - ${tokenB}:`, error);
    return null;
  }
}

/**
 * Fetches all pool reserves for common trading pairs
 */
export async function fetchAllPoolReserves(
  provider: ethers.Provider
): Promise<Record<string, PoolReserve>> {
  const tokenAddresses = [
    CONTRACT_ADDRESSES.PlatformToken,
    CONTRACT_ADDRESSES.TestUSD,
    CONTRACT_ADDRESSES.TestBTC,
  ];

  const pairs: Array<[string, string]> = [];

  // Create all possible pairs
  for (let i = 0; i < tokenAddresses.length; i++) {
    for (let j = i + 1; j < tokenAddresses.length; j++) {
      pairs.push([tokenAddresses[i], tokenAddresses[j]]);
    }
  }

  const results = await Promise.allSettled(
    pairs.map(([tokenA, tokenB]) => fetchPoolReserve(tokenA, tokenB, provider))
  );

  const reserves: Record<string, PoolReserve> = {};

  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
      const reserve = result.value;
      const key = createPoolKey(reserve.tokenA, reserve.tokenB);
      reserves[key] = reserve;
    }
  });

  return reserves;
}

/**
 * Calculates output amount for a swap based on constant product formula
 */
export function calculateSwapOutput(
  amountIn: string,
  reserveIn: string,
  reserveOut: string,
  feePercent: number = 0.3
): string {
  try {
    const amountInNum = parseFloat(amountIn);
    const reserveInNum = parseFloat(reserveIn);
    const reserveOutNum = parseFloat(reserveOut);

    if (
      amountInNum <= 0 ||
      reserveInNum <= 0 ||
      reserveOutNum <= 0 ||
      isNaN(amountInNum) ||
      isNaN(reserveInNum) ||
      isNaN(reserveOutNum)
    ) {
      return "0";
    }

    // Apply fee
    const amountInWithFee = amountInNum * (1 - feePercent / 100);

    // Constant product formula: (x + Δx) * (y - Δy) = x * y
    // Δy = (y * Δx) / (x + Δx)
    const numerator = reserveOutNum * amountInWithFee;
    const denominator = reserveInNum + amountInWithFee;
    const amountOut = numerator / denominator;

    return amountOut.toFixed(6);
  } catch (error) {
    console.error("Error calculating swap output:", error);
    return "0";
  }
}

/**
 * Calculates price impact of a swap
 */
export function calculatePriceImpact(
  amountIn: string,
  amountOut: string,
  reserveIn: string,
  reserveOut: string
): string {
  try {
    const amountInNum = parseFloat(amountIn);
    const amountOutNum = parseFloat(amountOut);
    const reserveInNum = parseFloat(reserveIn);
    const reserveOutNum = parseFloat(reserveOut);

    if (
      amountInNum <= 0 ||
      amountOutNum <= 0 ||
      reserveInNum <= 0 ||
      reserveOutNum <= 0
    ) {
      return "0";
    }

    // Current price
    const currentPrice = reserveOutNum / reserveInNum;

    // Execution price
    const executionPrice = amountOutNum / amountInNum;

    // Price impact percentage
    const priceImpact = ((executionPrice - currentPrice) / currentPrice) * 100;

    return Math.abs(priceImpact).toFixed(2);
  } catch (error) {
    console.error("Error calculating price impact:", error);
    return "0";
  }
}
