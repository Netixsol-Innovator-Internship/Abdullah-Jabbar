import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import type { DexState, PoolReserve } from "@/types/token";
import {
  fetchAllPoolReserves,
  fetchPoolReserve,
  createPoolKey,
} from "@/utils/dexService";

const initialState: DexState = {
  reserves: {},
  loading: false,
  error: null,
};

/**
 * Async thunk to fetch all pool reserves
 */
export const loadAllPoolReserves = createAsyncThunk(
  "dex/loadAllPoolReserves",
  async (provider: ethers.Provider, { rejectWithValue }) => {
    try {
      const reserves = await fetchAllPoolReserves(provider);
      return reserves;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to load pool reserves"
      );
    }
  }
);

/**
 * Async thunk to fetch a specific pool reserve
 */
export const loadPoolReserve = createAsyncThunk(
  "dex/loadPoolReserve",
  async (
    {
      tokenA,
      tokenB,
      provider,
    }: {
      tokenA: string;
      tokenB: string;
      provider: ethers.Provider;
    },
    { rejectWithValue }
  ) => {
    try {
      const reserve = await fetchPoolReserve(tokenA, tokenB, provider);
      return reserve;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to load pool reserve"
      );
    }
  }
);

const dexSlice = createSlice({
  name: "dex",
  initialState,
  reducers: {
    clearReserves: (state) => {
      state.reserves = {};
      state.error = null;
    },
    setDexError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Load all pool reserves
    builder
      .addCase(loadAllPoolReserves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadAllPoolReserves.fulfilled,
        (state, action: PayloadAction<Record<string, PoolReserve>>) => {
          state.loading = false;
          state.reserves = action.payload;
        }
      )
      .addCase(loadAllPoolReserves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Load specific pool reserve
    builder
      .addCase(loadPoolReserve.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        loadPoolReserve.fulfilled,
        (state, action: PayloadAction<PoolReserve | null>) => {
          state.loading = false;
          if (action.payload) {
            const key = createPoolKey(
              action.payload.tokenA,
              action.payload.tokenB
            );
            state.reserves[key] = action.payload;
          }
        }
      )
      .addCase(loadPoolReserve.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReserves, setDexError } = dexSlice.actions;
export default dexSlice.reducer;
