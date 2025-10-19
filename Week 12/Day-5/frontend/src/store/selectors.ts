import type { RootState } from "./index";
import type { TokenInfo, TokenBalance, PoolReserve } from "@/types/token";
import { createPoolKey } from "@/utils/dexService";

// Token Selectors
export const selectAllTokens = (state: RootState): Record<string, TokenInfo> =>
  state.token.tokens;

export const selectTokenByAddress =
  (address: string) =>
  (state: RootState): TokenInfo | undefined =>
    state.token.tokens[address];

export const selectAllBalances = (
  state: RootState
): Record<string, TokenBalance> => state.token.balances;

export const selectBalanceByAddress =
  (address: string) =>
  (state: RootState): TokenBalance | undefined =>
    state.token.balances[address];

export const selectTokensLoading = (state: RootState): boolean =>
  state.token.loading;

export const selectTokensError = (state: RootState): string | null =>
  state.token.error;

export const selectTokensLastUpdated = (state: RootState): number | null =>
  state.token.lastUpdated;

// DEX Selectors
export const selectAllPoolReserves = (
  state: RootState
): Record<string, PoolReserve> => state.dex.reserves;

export const selectPoolReserve =
  (tokenA: string, tokenB: string) =>
  (state: RootState): PoolReserve | undefined => {
    const key = createPoolKey(tokenA, tokenB);
    return state.dex.reserves[key];
  };

export const selectDexLoading = (state: RootState): boolean =>
  state.dex.loading;

export const selectDexError = (state: RootState): string | null =>
  state.dex.error;

// Computed Selectors
export const selectTokensList = (state: RootState): TokenInfo[] =>
  Object.values(state.token.tokens);

export const selectBalancesList = (state: RootState): TokenBalance[] =>
  Object.values(state.token.balances);

export const selectTotalPortfolioValue = (state: RootState): string => {
  // This is a simple sum - in production you'd want to convert to USD or another base currency
  const balances = Object.values(state.token.balances);
  const total = balances.reduce(
    (sum, balance) => sum + parseFloat(balance.formattedBalance || "0"),
    0
  );
  return total.toFixed(4);
};

export const selectIsDataLoaded = (state: RootState): boolean => {
  return (
    Object.keys(state.token.tokens).length > 0 &&
    state.token.lastUpdated !== null
  );
};
