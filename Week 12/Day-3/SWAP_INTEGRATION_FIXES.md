# Swap Contract Integration Fixes

## Overview
This document outlines the fixes applied to properly integrate the swap functionality with the TokenSwap smart contract.

## Issues Fixed

### 1. **Incorrect Function Signatures**
**Problem:** The swap functions were being called with two parameters (`amountIn` and `minAmountOut`), but the contract only accepts one parameter (`amountIn`).

**Solution:** Updated `swapAForB` and `swapBForA` calls to only pass `amountIn`:
```typescript
// Before
writeContract({
  functionName: "swapAForB",
  args: [amountInWei, minAmountOut],
});

// After
writeContract({
  functionName: "swapAForB",
  args: [amountInWei],
});
```

### 2. **Missing User Address**
**Problem:** Token balances were being queried using a zero address instead of the connected wallet address.

**Solution:** 
- Imported `useAccount` hook from wagmi
- Used the actual connected wallet address for balance queries
```typescript
const { address } = useAccount();

const { data: clawBalance } = useReadContract({
  args: address ? [address] : undefined,
});
```

### 3. **Incorrect Pool Info Destructuring**
**Problem:** `getPoolInfo()` returns 7 values, but the code was only destructuring 5.

**Solution:** Updated the destructuring to match the actual return values:
```typescript
const [, , reserveA, reserveB] = poolInfo as [
  string,    // _tokenA
  string,    // _tokenB
  bigint,    // _reserveA
  bigint,    // _reserveB
  bigint,    // _totalLiquidity
  bigint,    // _price
  bigint     // _feeRate
];
```

### 4. **Missing Token Approval Check**
**Problem:** No validation of token approvals before attempting swaps.

**Solution:** 
- Added allowance checks for both CLAW and TIGER tokens
- Implemented approval flow directly in the swap interface
- Added conditional rendering to show "Approve" button when needed

```typescript
const { data: clawAllowance } = useReadContract({
  functionName: "allowance",
  args: address ? [address, TOKEN_SWAP_ADDRESS] : undefined,
});

const needsApproval = () => {
  const amountInWei = parseEther(amountIn);
  const allowance = isSwapAForB ? clawAllowance : tigerAllowance;
  return !allowance || (allowance as bigint) < amountInWei;
};
```

### 5. **BigInt Literal Syntax Error**
**Problem:** Using BigInt literals (`0n`, `30n`) which aren't supported in ES2019.

**Solution:** Replaced BigInt literals with `BigInt()` constructor:
```typescript
// Before
if (reserveIn > 0n && reserveOut > 0n)

// After
if (reserveIn > BigInt(0) && reserveOut > BigInt(0))
```

## New Features Added

### 1. **Automatic Approval Detection**
The interface now automatically detects when token approval is needed and shows an "Approve" button instead of the "Swap" button.

### 2. **Enhanced Error Handling**
- Added custom error messages for approval issues
- Better feedback when transactions fail
- Success messages that guide users on next steps

### 3. **Wallet Connection Check**
The interface now shows a clear message when the wallet is not connected.

### 4. **Balance Refetching**
After successful transactions, all relevant data is refetched:
- Pool info
- Token balances
- Token allowances

## How to Use

### Step 1: Connect Wallet
Ensure your MetaMask or other Web3 wallet is connected.

### Step 2: Approve Tokens (First Time)
1. Enter the amount you want to swap
2. Click "Approve CLAW" or "Approve TIGER" button
3. Confirm the approval transaction in your wallet
4. Wait for confirmation

### Step 3: Swap Tokens
1. After approval is confirmed, the button changes to "Swap"
2. Click the swap button
3. Confirm the transaction in your wallet
4. Wait for the swap to complete

## Technical Details

### Contract Functions Used

From `TokenSwap.sol`:
- `swapAForB(uint256 amountIn)` - Swap CLAW for TIGER
- `swapBForA(uint256 amountIn)` - Swap TIGER for CLAW
- `getPoolInfo()` - Get pool reserves and pricing info
- `getAmountOut()` - Calculate expected output amount

From Token Contracts:
- `approve(address spender, uint256 amount)` - Approve swap contract
- `allowance(address owner, address spender)` - Check approval amount
- `balanceOf(address account)` - Check token balance

### State Management
The component manages:
- Input/output amounts
- Swap direction (A→B or B→A)
- Price impact calculation
- Loading states
- Error messages
- Transaction hash tracking

### Price Calculation
The interface calculates output amounts using the constant product formula with fees:
```
amountOut = (amountIn * (10000 - 30) * reserveOut) / (reserveIn * 10000 + amountIn * (10000 - 30))
```
Where:
- Fee = 0.3% (30 basis points)
- Basis points = 10000

## Testing Checklist

- [ ] Connect wallet successfully
- [ ] View correct token balances
- [ ] Approve CLAW tokens
- [ ] Approve TIGER tokens
- [ ] Swap CLAW for TIGER
- [ ] Swap TIGER for CLAW
- [ ] View price impact
- [ ] Flip swap direction
- [ ] Handle insufficient balance
- [ ] Handle insufficient allowance
- [ ] View transaction on block explorer
- [ ] Balances update after swap

## Next Steps

1. Test the swap functionality on testnet
2. Verify price calculations match contract output
3. Test edge cases (very small/large amounts)
4. Add slippage protection if needed (currently UI only)
5. Consider adding transaction deadline feature
