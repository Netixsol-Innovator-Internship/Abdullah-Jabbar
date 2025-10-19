# Redux Token Store Architecture

## Overview

This project uses **Redux Toolkit (RTK)** for centralized state management of token data, balances, and DEX pool information. The store automatically fetches and syncs data from the blockchain, making it available to all components throughout the application.

## Architecture

### Store Structure

```
src/
├── store/
│   ├── index.ts              # Main store configuration
│   ├── hooks.ts              # Typed Redux hooks
│   ├── selectors.ts          # Reusable selectors
│   ├── tokenSlice.ts         # Token & balance state management
│   ├── dexSlice.ts           # DEX pool reserves state management
│   └── ReduxProvider.tsx     # Redux Provider wrapper
├── utils/
│   ├── tokenService.ts       # Token data fetching utilities
│   └── dexService.ts         # DEX pool data utilities
├── hooks/
│   └── useTokenData.ts       # Custom hooks for data loading
└── types/
    └── token.ts              # TypeScript interfaces
```

## State Management

### Token Slice

**State:**
- `tokens`: Record of all token information (address, symbol, name, decimals, totalSupply)
- `balances`: Record of user's token balances
- `loading`: Loading state
- `error`: Error messages
- `lastUpdated`: Timestamp of last data fetch

**Actions:**
- `loadTokensInfo`: Fetch token metadata from contracts
- `loadTokenBalances`: Fetch user's token balances
- `refreshTokenBalance`: Refresh a single token balance
- `clearTokens`: Clear all token data
- `clearBalances`: Clear balance data

### DEX Slice

**State:**
- `reserves`: Record of pool reserves for token pairs
- `loading`: Loading state
- `error`: Error messages

**Actions:**
- `loadAllPoolReserves`: Fetch all pool reserves
- `loadPoolReserve`: Fetch specific pool reserve
- `clearReserves`: Clear pool data

## Usage

### 1. Accessing Store Data in Components

```tsx
import { useAppSelector } from "@/store/hooks";
import {
  selectAllBalances,
  selectTokensList,
  selectPoolReserve,
} from "@/store/selectors";

function MyComponent() {
  // Get all token balances
  const balances = useAppSelector(selectAllBalances);
  
  // Get list of all tokens
  const tokens = useAppSelector(selectTokensList);
  
  // Get specific pool reserve
  const poolReserve = useAppSelector(selectPoolReserve(tokenA, tokenB));
  
  return (
    <div>
      {tokens.map(token => (
        <div key={token.address}>
          {token.name}: {balances[token.address]?.formattedBalance || "0"}
        </div>
      ))}
    </div>
  );
}
```

### 2. Dispatching Actions

```tsx
import { useAppDispatch } from "@/store/hooks";
import { loadTokenBalances } from "@/store/tokenSlice";
import { useWallet } from "@/context/WalletContext";

function MyComponent() {
  const dispatch = useAppDispatch();
  const { account, signer } = useWallet();
  
  const refreshBalances = async () => {
    if (account && signer) {
      await dispatch(loadTokenBalances({ 
        accountAddress: account, 
        provider: signer 
      }));
    }
  };
  
  return <button onClick={refreshBalances}>Refresh</button>;
}
```

### 3. Using Custom Hooks

The easiest way to work with token data is through the provided custom hooks:

```tsx
import { useRefreshBalances, useRefreshPools } from "@/hooks/useTokenData";

function MyComponent() {
  const { refreshBalances } = useRefreshBalances();
  const { refreshPools } = useRefreshPools();
  
  const handleRefresh = async () => {
    await refreshBalances();  // Refresh user balances
    await refreshPools();     // Refresh pool reserves
  };
  
  return <button onClick={handleRefresh}>Refresh All</button>;
}
```

## Available Selectors

### Token Selectors

- `selectAllTokens`: Get all token information as a record
- `selectTokenByAddress(address)`: Get specific token info
- `selectAllBalances`: Get all token balances
- `selectBalanceByAddress(address)`: Get specific token balance
- `selectTokensLoading`: Get loading state
- `selectTokensError`: Get error message
- `selectTokensList`: Get tokens as an array
- `selectBalancesList`: Get balances as an array
- `selectTotalPortfolioValue`: Calculate total portfolio value

### DEX Selectors

- `selectAllPoolReserves`: Get all pool reserves
- `selectPoolReserve(tokenA, tokenB)`: Get specific pool reserve
- `selectDexLoading`: Get loading state
- `selectDexError`: Get error message

## Utility Functions

### Token Service (`utils/tokenService.ts`)

- `fetchTokenInfo(address, provider)`: Fetch token metadata
- `fetchAllTokensInfo(provider)`: Fetch all tokens metadata
- `fetchTokenBalance(token, account, provider)`: Fetch single balance
- `fetchAllTokenBalances(account, provider)`: Fetch all balances
- `formatTokenAmount(amount, decimals)`: Format token amount
- `parseTokenAmount(amount, decimals)`: Parse token amount to wei
- `getTokenSymbol(address, tokensInfo)`: Get symbol from cached data
- `getTokenName(address, tokensInfo)`: Get name from cached data

### DEX Service (`utils/dexService.ts`)

- `fetchPoolReserve(tokenA, tokenB, provider)`: Fetch pool reserves
- `fetchAllPoolReserves(provider)`: Fetch all pool reserves
- `calculateSwapOutput(amountIn, reserveIn, reserveOut, feePercent)`: Calculate swap output
- `calculatePriceImpact(...)`: Calculate price impact
- `createPoolKey(tokenA, tokenB)`: Create consistent pool key

## Automatic Data Loading

The `TokenDataLoader` component automatically:
1. Loads token information when the app starts
2. Loads user balances when wallet connects
3. Clears balances when wallet disconnects
4. Refreshes pool reserves every 30 seconds

This happens automatically - you don't need to manually trigger these loads in your components!

## Example: Migrating Existing Components

### Before (without Redux):

```tsx
const [balances, setBalances] = useState({});
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadBalances = async () => {
    setLoading(true);
    // Fetch balances from contracts
    const balances = await fetchBalances();
    setBalances(balances);
    setLoading(false);
  };
  loadBalances();
}, [account]);
```

### After (with Redux):

```tsx
const balances = useAppSelector(selectAllBalances);
const loading = useAppSelector(selectTokensLoading);

// That's it! Data is automatically loaded and kept in sync
```

## Benefits

1. **Single Source of Truth**: All components access the same data
2. **Automatic Syncing**: Data refreshes automatically
3. **No Prop Drilling**: Access data anywhere without passing props
4. **Performance**: Components only re-render when their data changes
5. **Type Safety**: Full TypeScript support with typed hooks
6. **DevTools**: Redux DevTools for debugging state changes
7. **Optimistic Updates**: Easy to implement optimistic UI updates

## Best Practices

1. **Use Selectors**: Always use selectors instead of accessing state directly
2. **Use Typed Hooks**: Use `useAppSelector` and `useAppDispatch` instead of raw Redux hooks
3. **Avoid Redundant Fetches**: Let the automatic loader handle data fetching
4. **Handle Loading States**: Check loading states before rendering data
5. **Handle Errors**: Display error messages from the store
6. **Refresh After Transactions**: Call `refreshBalances()` and `refreshPools()` after transactions

## Testing

The store is configured to work with Redux DevTools. Install the browser extension to:
- Inspect state in real-time
- Time-travel through state changes
- Debug action dispatches

## Performance Optimization

The store is configured with:
- Serializable check middleware for development
- Optimized re-renders through memoized selectors
- Efficient data structure (Records/Maps for O(1) lookups)
- Automatic cleanup of stale data

## Migration Guide

See the example components:
- `PortfolioPageRedux.tsx`: Portfolio with Redux
- `DEXPageRedux.tsx`: DEX with Redux

These show how to migrate from local state to Redux store.
