# Redux Selector Performance Fix

## Problem
Redux selectors that return new object/array references (like `Object.values()`) cause unnecessary re-renders because React compares references, not values.

## Error Message
```
Selector selectTokensList returned a different result when called with the same parameters. 
This can lead to unnecessary rerenders.
Selectors that return a new reference (such as an object or an array) should be memoized
```

## Solution Applied
Used `createSelector` from Redux Toolkit to memoize selectors that return computed values:

### Before (Problematic)
```typescript
export const selectTokensList = (state: RootState): TokenInfo[] =>
  Object.values(state.token.tokens);
```

### After (Fixed)
```typescript
export const selectTokensList = createSelector(
  [selectAllTokens],
  (tokens): TokenInfo[] => Object.values(tokens)
);
```

## Fixed Selectors
- `selectTokensList` - Memoized array of tokens
- `selectBalancesList` - Memoized array of balances
- `selectTotalPortfolioValue` - Memoized computed portfolio value
- `selectIsDataLoaded` - Memoized data loading status

## Benefits
1. **Performance**: Prevents unnecessary component re-renders
2. **Memory**: Reuses references when data hasn't changed
3. **Debugging**: Cleaner console without selector warnings

## Next.js Config Fix
Also added `outputFileTracingRoot: __dirname` to `next.config.ts` to silence workspace root detection warnings.

## Result
✅ No more Redux selector warnings
✅ Better performance with fewer re-renders
✅ Cleaner development console