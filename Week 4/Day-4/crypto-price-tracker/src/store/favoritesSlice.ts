// file: src/store/favoritesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FavState = { ids: string[] };

const initial: FavState = (() => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("favorites");
      if (raw) return JSON.parse(raw) as FavState;
    } catch {}
  }
  return { ids: [] };
})();

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: initial,
  reducers: {
    toggleFavorite(s, a: PayloadAction<string>) {
      const id = a.payload;
      if (s.ids.includes(id)) s.ids = s.ids.filter((x) => x !== id);
      else s.ids.push(id);
      if (typeof window !== "undefined") localStorage.setItem("favorites", JSON.stringify(s));
    },
    setFavorites(s, a: PayloadAction<string[]>) {
      s.ids = a.payload;
      if (typeof window !== "undefined") localStorage.setItem("favorites", JSON.stringify(s));
    }
  }
});

export const { toggleFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
