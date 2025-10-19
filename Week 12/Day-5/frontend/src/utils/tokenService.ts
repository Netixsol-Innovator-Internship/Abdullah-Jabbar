import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, PLATFORM_TOKEN_ABI } from "@/config/contract";
import type { TokenInfo, TokenBalance } from "@/types/token";

export const TOKEN_ADDRESSES = {
  PLATFORM: CONTRACT_ADDRESSES.PlatformToken,
  TEST_USD: CONTRACT_ADDRESSES.TestUSD,
  TEST_BTC: CONTRACT_ADDRESSES.TestBTC,
};

/**
 * Fetches token information from the blockchain
 */
export async function fetchTokenInfo(
  tokenAddress: string,
  provider: ethers.Provider
): Promise<TokenInfo | null> {
  try {
    if (tokenAddress === ethers.ZeroAddress) {
      return null;
    }

    const contract = new ethers.Contract(
      tokenAddress,
      PLATFORM_TOKEN_ABI,
      provider
    );

    const [symbol, name, decimals, totalSupply] = await Promise.all([
      contract.symbol(),
      contract.name(),
      contract.decimals(),
      contract.totalSupply(),
    ]);

    return {
      address: tokenAddress,
      symbol,
      name,
      decimals: Number(decimals),
      totalSupply: ethers.formatUnits(totalSupply, decimals),
    };
  } catch (error) {
    console.error(`Error fetching token info for ${tokenAddress}:`, error);
    return null;
  }
}

/**
 * Fetches all token information for the platform
 */
export async function fetchAllTokensInfo(
  provider: ethers.Provider
): Promise<Record<string, TokenInfo>> {
  const addresses = Object.values(TOKEN_ADDRESSES);
  const results = await Promise.allSettled(
    addresses.map((address) => fetchTokenInfo(address, provider))
  );

  const tokensInfo: Record<string, TokenInfo> = {};

  results.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value) {
      const tokenInfo = result.value;
      tokensInfo[tokenInfo.address] = tokenInfo;
    } else {
      // When contracts aren't deployed, use placeholder with N/A for display
      const address = addresses[index];
      tokensInfo[address] = {
        address,
        symbol: "N/A",
        name: "N/A",
        decimals: 18,
        totalSupply: "0",
      };
    }
  });

  return tokensInfo;
}

/**
 * Fetches token balance for a specific account
 */
export async function fetchTokenBalance(
  tokenAddress: string,
  accountAddress: string,
  provider: ethers.Provider | ethers.Signer
): Promise<TokenBalance | null> {
  try {
    if (tokenAddress === ethers.ZeroAddress || !accountAddress) {
      return null;
    }

    const contract = new ethers.Contract(
      tokenAddress,
      PLATFORM_TOKEN_ABI,
      provider
    );

    const [balance, symbol, name, decimals] = await Promise.all([
      contract.balanceOf(accountAddress),
      contract.symbol(),
      contract.name(),
      contract.decimals(),
    ]);

    const formattedBalance = ethers.formatUnits(balance, decimals);

    return {
      address: tokenAddress,
      symbol,
      name,
      balance: balance.toString(),
      formattedBalance,
    };
  } catch (error) {
    console.error(
      `Error fetching balance for ${tokenAddress} and account ${accountAddress}:`,
      error
    );
    return null;
  }
}

/**
 * Fetches all token balances for a specific account
 */
export async function fetchAllTokenBalances(
  accountAddress: string,
  provider: ethers.Provider | ethers.Signer
): Promise<Record<string, TokenBalance>> {
  const addresses = Object.values(TOKEN_ADDRESSES);
  const results = await Promise.allSettled(
    addresses.map((address) =>
      fetchTokenBalance(address, accountAddress, provider)
    )
  );

  const balances: Record<string, TokenBalance> = {};

  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
      const balance = result.value;
      balances[balance.address] = balance;
    }
  });

  return balances;
}

/**
 * Formats token amount with proper decimals
 */
export function formatTokenAmount(
  amount: string | bigint,
  decimals: number = 18
): string {
  try {
    return ethers.formatUnits(amount, decimals);
  } catch (error) {
    console.error("Error formatting token amount:", error);
    return "0";
  }
}

/**
 * Parses token amount to wei with proper decimals
 */
export function parseTokenAmount(
  amount: string,
  decimals: number = 18
): bigint {
  try {
    return ethers.parseUnits(amount, decimals);
  } catch (error) {
    console.error("Error parsing token amount:", error);
    return BigInt(0);
  }
}

/**
 * Checks if a token contract is deployed (not zero address)
 */
export function isTokenDeployed(tokenAddress: string): boolean {
  return tokenAddress !== ethers.ZeroAddress;
}

/**
 * Gets token symbol by address from cached data
 */
export function getTokenSymbol(
  tokenAddress: string,
  tokensInfo: Record<string, TokenInfo>
): string {
  return tokensInfo[tokenAddress]?.symbol || "UNKNOWN";
}

/**
 * Gets token name by address from cached data
 */
export function getTokenName(
  tokenAddress: string,
  tokensInfo: Record<string, TokenInfo>
): string {
  return tokensInfo[tokenAddress]?.name || "Unknown Token";
}
