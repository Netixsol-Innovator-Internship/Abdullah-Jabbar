# Contract Deployment Guide

## Issue: No Information Displayed

The frontend is currently showing no information because the contract addresses are set to placeholder values.

## Current Contract Addresses (in `src/config/contract.ts`)

```typescript
export const CLAW_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";
export const TIGER_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";
export const TOKEN_SWAP_ADDRESS = "0x0000000000000000000000000000000000000000";
```

## Steps to Fix

### Option 1: Deploy Contracts (Recommended)

1. **Navigate to the Contract directory**
   ```bash
   cd Contract
   ```

2. **Deploy the contracts using Remix IDE or Hardhat**
   - Go to [Remix IDE](https://remix.ethereum.org/)
   - Upload `ClawToken_v2.sol`, `TigerToken_v2.sol`, and `TokenSwap_v2.sol`
   - Compile and deploy to your network (Sepolia, Kasplex Testnet, etc.)
   - Save the deployed contract addresses

3. **Update the contract addresses in `frontend/src/config/contract.ts`**
   ```typescript
   export const CLAW_TOKEN_ADDRESS = "0xYourClawTokenAddress";
   export const TIGER_TOKEN_ADDRESS = "0xYourTigerTokenAddress";
   export const TOKEN_SWAP_ADDRESS = "0xYourTokenSwapAddress";
   ```

### Option 2: Use Existing Deployed Contracts

If you already have deployed contracts:

1. Locate your deployment addresses
2. Update `frontend/src/config/contract.ts` with the actual addresses
3. Restart the development server

## Verification

After updating the addresses, you can verify the contracts are working:

```bash
cd frontend
node verify-contract.js
```

## Expected Behavior After Fix

Once the correct contract addresses are set:
- ✅ Token name and symbol will display
- ✅ Total supply will show
- ✅ Your wallet balance will appear
- ✅ Swap functionality will work
- ✅ Pool information will be visible

## Need Help?

Make sure your wallet is:
1. Connected to the same network where contracts are deployed
2. Has some test ETH/tokens for gas fees
