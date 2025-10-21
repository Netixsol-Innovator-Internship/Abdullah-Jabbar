import { createSelector } from "@reduxjs/toolkit";
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

// Computed Selectors (Memoized)
export const selectTokensList = createSelector(
  [selectAllTokens],
  (tokens): TokenInfo[] => Object.values(tokens)
);

export const selectBalancesList = createSelector(
  [selectAllBalances],
  (balances): TokenBalance[] => Object.values(balances)
);

export const selectTotalPortfolioValue = createSelector(
  [selectAllBalances],
  (balances): string => {
    // This is a simple sum - in production you'd want to convert to USD or another base currency
    const balanceValues = Object.values(balances);
    const total = balanceValues.reduce(
      (sum, balance) => sum + parseFloat(balance.formattedBalance || "0"),
      0
    );
    return total.toFixed(4);
  }
);

export const selectIsDataLoaded = createSelector(
  [selectAllTokens, selectTokensLastUpdated],
  (tokens, lastUpdated): boolean => {
    return Object.keys(tokens).length > 0 && lastUpdated !== null;
  }
);
