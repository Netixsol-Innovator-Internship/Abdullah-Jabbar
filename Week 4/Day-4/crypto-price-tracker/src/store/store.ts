// file: src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { api } from "./apiSlice";
import settings from "./settingsSlice";
import favorites from "./favoritesSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    settings,
    favorites,
  },
  middleware: (gDM) => gDM().concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
