# 🚀 Redux Store Quick Reference

## Quick Start

### 1. Import What You Need
```tsx
import { useAppSelector } from "@/store/hooks";
import { selectAllBalances, selectTokensList } from "@/store/selectors";
```

### 2. Use in Component
```tsx
function MyComponent() {
  const balances = useAppSelector(selectAllBalances);
  const tokens = useAppSelector(selectTokensList);
  
  return <div>{/* Use tokens and balances */}</div>;
}
```

That's it! Data is automatically loaded and kept fresh. ✅

---

## Common Selectors

| Selector | Returns | Usage |
|----------|---------|-------|
| `selectAllTokens` | All token info | Get all tokens as object |
| `selectTokensList` | Token array | Loop through tokens |
| `selectAllBalances` | All balances | Get all balances as object |
| `selectBalancesList` | Balance array | Loop through balances |
| `selectPoolReserve(a, b)` | Pool reserve | Get reserves for token pair |
| `selectTokensLoading` | Boolean | Check if loading |
| `selectTotalPortfolioValue` | String | Get total value |

---

## Common Patterns

### Display Token Balances
```tsx
const tokens = useAppSelector(selectTokensList);
const balances = useAppSelector(selectAllBalances);

{tokens.map(token => (
  <div key={token.address}>
    {token.symbol}: {balances[token.address]?.formattedBalance || "0"}
  </div>
))}
```

### Get Specific Token
```tsx
const token = useAppSelector(selectTokenByAddress(address));
const balance = useAppSelector(selectBalanceByAddress(address));
```

### Get Pool Reserves
```tsx
const reserve = useAppSelector(selectPoolReserve(tokenA, tokenB));
// reserve.reserveA, reserve.reserveB, reserve.price
```

### Refresh After Transaction
```tsx
import { useRefreshBalances } from "@/hooks/useTokenData";

const { refreshBalances } = useRefreshBalances();

// After transaction
await refreshBalances();
```

---

## Utility Functions

### Token Service
```tsx
import { formatTokenAmount, parseTokenAmount } from "@/utils/tokenService";

const formatted = formatTokenAmount(weiAmount, 18);
const parsed = parseTokenAmount("1.5", 18);
```

### DEX Service
```tsx
import { calculateSwapOutput } from "@/utils/dexService";

const output = calculateSwapOutput(amountIn, reserveIn, reserveOut);
```

### Helpers
```tsx
import { formatLargeNumber, formatPercent } from "@/utils/helpers";

const display = formatLargeNumber(1234567); // "1.23M"
const percent = formatPercent(5.123); // "5.12%"
```

---

## File Locations

```
src/
├── store/
│   ├── hooks.ts          ← Use these hooks
│   ├── selectors.ts      ← Use these selectors
│   └── tokenSlice.ts     ← Token state
├── utils/
│   ├── tokenService.ts   ← Token utilities
│   ├── dexService.ts     ← DEX calculations
│   └── helpers.ts        ← General helpers
└── hooks/
    └── useTokenData.ts   ← Refresh hooks
```

---

## Example Components

See these files for complete examples:
- `src/components/PortfolioPageRedux.tsx` - Portfolio using Redux
- `src/components/DEXPageRedux.tsx` - DEX using Redux
- `src/examples/ReduxStoreExamples.tsx` - 10 usage examples

---

## Remember

✅ **Data loads automatically** - No need to fetch in components  
✅ **Auto-refreshes** - Pool reserves update every 30 seconds  
✅ **Type-safe** - Full TypeScript support  
✅ **Use selectors** - Always use selectors, not direct state access  
✅ **Refresh after transactions** - Call `refreshBalances()` after writes  

---

## Need Help?

📖 Read `REDUX_STORE_GUIDE.md` for detailed documentation  
📋 Check `REDUX_IMPLEMENTATION.md` for architecture overview  
💡 See `src/examples/ReduxStoreExamples.tsx` for code examples  
