import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./tokenSlice";
import dexReducer from "./dexSlice";

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    dex: dexReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "token/loadTokensInfo/pending",
          "token/loadTokensInfo/fulfilled",
          "token/loadTokenBalances/pending",
          "token/loadTokenBalances/fulfilled",
          "token/refreshTokenBalance/pending",
          "token/refreshTokenBalance/fulfilled",
          "dex/loadAllPoolReserves/pending",
          "dex/loadAllPoolReserves/fulfilled",
          "dex/loadPoolReserve/pending",
          "dex/loadPoolReserve/fulfilled",
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.provider", "meta.arg"],
        // Ignore these paths in the state
        ignoredPaths: ["token.provider", "dex.provider"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
