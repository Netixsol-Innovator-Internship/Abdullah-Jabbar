// file: src/store/settingsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SettingsState = {
  currency: "usd" | "eur" | "gbp" | "pkr";
  per_page: number;
  polling: number; // ms
};

const initial: SettingsState = (() => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("settings");
      if (raw) return JSON.parse(raw) as SettingsState;
    } catch {}
  }
  return { currency: "usd", per_page: 51, polling: 600000 };
})();

const settingsSlice = createSlice({
  name: "settings",
  initialState: initial,
  reducers: {
    setCurrency(s, a: PayloadAction<SettingsState["currency"]>) {
      s.currency = a.payload;
      if (typeof window !== "undefined") localStorage.setItem("settings", JSON.stringify(s));
    },
    setPolling(s, a: PayloadAction<number>) {
      s.polling = Math.max(600000, a.payload);
      if (typeof window !== "undefined") localStorage.setItem("settings", JSON.stringify(s));
    },
  },
});

export const { setCurrency, setPolling } = settingsSlice.actions;
export default settingsSlice.reducer;
