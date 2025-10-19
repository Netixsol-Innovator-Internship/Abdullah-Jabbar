import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import type { TokenState, TokenInfo, TokenBalance } from "@/types/token";
import {
  fetchAllTokensInfo,
  fetchAllTokenBalances,
  fetchTokenBalance,
} from "@/utils/tokenService";

const initialState: TokenState = {
  tokens: {},
  balances: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

/**
 * Async thunk to fetch all token information
 */
export const loadTokensInfo = createAsyncThunk(
  "token/loadTokensInfo",
  async (provider: ethers.Provider, { rejectWithValue }) => {
    try {
      const tokensInfo = await fetchAllTokensInfo(provider);
      return tokensInfo;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to load tokens info"
      );
    }
  }
);

/**
 * Async thunk to fetch all token balances for an account
 */
export const loadTokenBalances = createAsyncThunk(
  "token/loadTokenBalances",
  async (
    {
      accountAddress,
      provider,
    }: {
      accountAddress: string;
      provider: ethers.Provider | ethers.Signer;
    },
    { rejectWithValue }
  ) => {
    try {
      const balances = await fetchAllTokenBalances(accountAddress, provider);
      return balances;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to load balances"
      );
    }
  }
);

/**
 * Async thunk to refresh a single token balance
 */
export const refreshTokenBalance = createAsyncThunk(
  "token/refreshTokenBalance",
  async (
    {
      tokenAddress,
      accountAddress,
      provider,
    }: {
      tokenAddress: string;
      accountAddress: string;
      provider: ethers.Provider | ethers.Signer;
    },
    { rejectWithValue }
  ) => {
    try {
      const balance = await fetchTokenBalance(
        tokenAddress,
        accountAddress,
        provider
      );
      return balance;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to refresh token balance"
      );
    }
  }
);

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    clearTokens: (state) => {
      state.tokens = {};
      state.balances = {};
      state.error = null;
      state.lastUpdated = null;
    },
    clearBalances: (state) => {
      state.balances = {};
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Load tokens info
    builder
      .addCase(loadTokensInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadTokensInfo.fulfilled,
        (state, action: PayloadAction<Record<string, TokenInfo>>) => {
          state.loading = false;
          state.tokens = action.payload;
          state.lastUpdated = Date.now();
        }
      )
      .addCase(loadTokensInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Load token balances
    builder
      .addCase(loadTokenBalances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadTokenBalances.fulfilled,
        (state, action: PayloadAction<Record<string, TokenBalance>>) => {
          state.loading = false;
          state.balances = action.payload;
          state.lastUpdated = Date.now();
        }
      )
      .addCase(loadTokenBalances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Refresh single token balance
    builder
      .addCase(refreshTokenBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        refreshTokenBalance.fulfilled,
        (state, action: PayloadAction<TokenBalance | null>) => {
          state.loading = false;
          if (action.payload) {
            state.balances[action.payload.address] = action.payload;
          }
          state.lastUpdated = Date.now();
        }
      )
      .addCase(refreshTokenBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTokens, clearBalances, setError } = tokenSlice.actions;
export default tokenSlice.reducer;
