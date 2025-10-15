# ClawToken Frontend Troubleshooting Guide

## Issue: Token Name and Supply Not Showing

This guide helps you diagnose why the token name and total supply aren't displaying on the frontend.

## What I've Fixed

### 1. Enhanced Error Handling in TokenInfo Component
- Added error states and loading states for all contract reads
- Added console logging for debugging
- Display user-friendly error messages when contract calls fail
- Shows "N/A" instead of blank when data is unavailable

### 2. Created Diagnostic Panel
- Shows wallet connection status
- Displays current network and chain ID
- Confirms contract address
- Provides troubleshooting steps

### 3. Added Debug Console Logging
- Open browser console (F12) to see detailed contract call information
- Check for error messages and data returned from contract

## Common Issues and Solutions

### Issue 1: Contract Not Deployed on Current Network

**Symptoms:**
- All token info shows "N/A" or "0"
- Error message about contract connection
- Console shows "contract not found" or similar

**Solution:**
Check which network your contract is deployed on:

```bash
# In the frontend directory, check the contract address
# File: src/config/contract.ts
# Line 2: export const CONTRACT_ADDRESS = "0xe389811D36f745474d00E1fF3C95E9C87283BaEe"
```

Then verify in MetaMask:
1. Open MetaMask
2. Click on the network dropdown (top center)
3. Ensure you're connected to either:
   - **Kasplex Testnet** (Chain ID: 167012)
   - **Sepolia** (Chain ID: 11155111)

### Issue 2: Wrong Contract Address

**Symptoms:**
- Contract address doesn't match your deployment
- Error in console about "execution reverted"

**Solution:**
1. Find your actual deployed contract address from your deployment transaction
2. Update `frontend/src/config/contract.ts`:
   ```typescript
   export const CONTRACT_ADDRESS = "0xYOUR_ACTUAL_CONTRACT_ADDRESS";
   ```

### Issue 3: Wallet Not Connected

**Symptoms:**
- Cannot see token info at all
- Page shows "Connect wallet" message

**Solution:**
1. Click the "Connect Wallet" button in the top right
2. Select MetaMask
3. Approve the connection

### Issue 4: Network Mismatch

**Symptoms:**
- Diagnostic panel shows wrong Chain ID
- Yellow warning about network compatibility

**Solution:**
1. In MetaMask, click the network dropdown
2. Select the correct network where your contract is deployed
3. If network doesn't appear, add it manually:

**For Kasplex Testnet:**
- Network Name: Kasplex Testnet
- RPC URL: https://rpc.kasplextest.xyz
- Chain ID: 167012
- Currency Symbol: KAS
- Block Explorer: https://explorer.testnet.kasplextest.xyz

**For Sepolia:**
- Network Name: Sepolia
- RPC URL: https://rpc.sepolia.org
- Chain ID: 11155111
- Currency Symbol: SEP
- Block Explorer: https://sepolia.etherscan.io

## How to Verify Your Setup

### Step 1: Check Browser Console
1. Open your browser's developer console (Press F12)
2. Go to the "Console" tab
3. Look for a log entry that says "TokenInfo Debug:" 
4. This will show:
   - Contract address being used
   - Chain ID you're connected to
   - Data returned (name, symbol, totalSupply)
   - Any errors

### Step 2: Check Diagnostic Panel
After connecting your wallet, you'll see a "Connection Diagnostics" panel that shows:
- ✅ Green checkmark = everything is working
- ⚠️ Yellow warning = check the details
- ❌ Red X = something needs to be fixed

### Step 3: Verify Contract Deployment
You can verify your contract is deployed correctly by:
1. Going to the block explorer for your network
2. Searching for your contract address
3. Checking if the contract exists and has code

**Kasplex Testnet Explorer:** https://explorer.testnet.kasplextest.xyz
**Sepolia Explorer:** https://sepolia.etherscan.io

## Expected Behavior

When everything is working correctly:
1. **Token Name:** Should show "Claw"
2. **Symbol:** Should show "CLAW"
3. **Total Supply:** Should show the amount you minted (formatted with 18 decimals)
   - Example: If you minted 1,000,000,000 tokens, it should show "1,000,000,000.00"

## Deployment Supply Format

When you deployed the contract, the supply should have been in Wei format:
- For 1 billion tokens: `1000000000000000000000000000` (1 billion * 10^18)
- For 1 million tokens: `1000000000000000000000000` (1 million * 10^18)

The frontend automatically converts from Wei to readable format.

## Still Having Issues?

1. **Check all console errors** - Look for red error messages in browser console
2. **Verify contract ABI matches** - Make sure the ABI in `contract.ts` matches your compiled contract
3. **Test with a different wallet address** - Sometimes cache issues occur
4. **Clear browser cache and reload**
5. **Check RPC endpoint is working** - Try visiting the block explorer

## Debug Checklist

- [ ] Wallet is connected
- [ ] On correct network (Chain ID matches)
- [ ] Contract address is correct
- [ ] Contract is deployed on the network you're connected to
- [ ] Browser console shows no errors
- [ ] Diagnostic panel shows all green checkmarks
- [ ] MetaMask has the correct network configured

## Quick Test

To quickly test if your contract is accessible, open the browser console and type:

```javascript
// This will show all the debug information
console.log(localStorage);
```

Then refresh the page and watch the "TokenInfo Debug:" log entries.

## Need More Help?

Check the following files for configuration:
- `frontend/src/config/contract.ts` - Contract address and ABI
- `frontend/src/config/wagmi.ts` - Network configuration
- `frontend/src/components/TokenInfo.tsx` - Token info display logic

The diagnostic panel and enhanced error messages should now help you identify the exact issue!
