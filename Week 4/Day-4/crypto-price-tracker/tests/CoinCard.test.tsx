// file: tests/CoinCard.test.tsx
// Basic unit test example for CoinCard
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CoinCard from "../src/components/CoinCard";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import favorites from "../src/store/favoritesSlice";
import settings from "../src/store/settingsSlice";
import { api } from "../src/store/apiSlice";

// Simple store for testing
function makeStore() {
  return configureStore({
    reducer: {
      favorites,
      settings,
      [api.reducerPath]: api.reducer
    },
    middleware: (gDM) => gDM().concat(api.middleware)
  });
}

const coin = {
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image: "/icons/placeholder-coin.png",
  current_price: 50000,
  price_change_percentage_24h: 2.5,
  market_cap_rank: 1
};

describe("CoinCard", () => {
  it("renders coin name and toggles favorite", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <CoinCard coin={coin as any} />
      </Provider>
    );

    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    const favBtn = screen.getByRole("button", { name: /add to favorites/i });
    fireEvent.click(favBtn);
    // After click, aria-pressed should be true
    expect(favBtn).toHaveAttribute("aria-pressed", "true");
  });
});
