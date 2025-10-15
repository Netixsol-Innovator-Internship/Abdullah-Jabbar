# 🚀 Quick Start Guide - Claw Token DApp

## ✅ What's Been Done

Your Claw Token frontend is now configured with **Kasplex Testnet**! Here's what's ready:

### 1. Network Configuration ✅
- **Primary**: Kasplex Testnet (Chain ID: 167012)
- **Fallback**: Sepolia Testnet
- **Wallets**: MetaMask, WalletConnect, Injected

### 2. Components Created ✅
- Token information display
- Transfer functionality
- Approval management
- Burn functionality
- Complete admin panel with all controls

### 3. Dependencies Installing ⏳
Currently installing: `wagmi`, `viem`, `@tanstack/react-query`

## 📋 What You Need to Do

### Step 1: Wait for Dependencies
The npm install command is running. Once complete, you'll see "added X packages" message.

### Step 2: Deploy Your Contract to Kasplex Testnet

First, make sure you have KAS tokens for gas on Kasplex Testnet.

### Step 3: Get Contract ABI

After deploying, you'll need the contract ABI. Get it from your deployment artifacts:

```bash
# If using Hardhat
# Find it in: artifacts/contracts/ClawToken.sol/ClawToken.json
```

### Step 4: Update Contract Configuration

Edit `frontend/src/config/contract.ts`:

```typescript
export const CONTRACT_ADDRESS = '0xYourActualContractAddress';

export const CONTRACT_ABI = [
  // Paste your full ABI here
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  // ... rest of ABI
] as const;
```

### Step 5: Run the Development Server

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 6: Connect Your Wallet

1. Click "Connect Wallet" button
2. Select MetaMask or WalletConnect
3. Switch to Kasplex Testnet if prompted

### Step 7: Add Kasplex Testnet to MetaMask (if needed)

Manual Network Addition:
- **Network Name**: Kasplex Testnet
- **RPC URL**: https://rpc.kasplextest.xyz
- **Chain ID**: 167012
- **Currency Symbol**: KAS
- **Block Explorer**: https://explorer.testnet.kasplextest.xyz

## 🎨 App Features

### For All Users:
- View token balance and info
- Transfer tokens
- Approve spending allowances
- Burn tokens
- Safe allowance increases/decreases

### For Contract Owner:
- Mint new tokens (single or batch)
- Configure transfer tax (0-10%)
- Set tax receiver address
- Blacklist/unblacklist addresses
- Pause/unpause transfers
- Create snapshots
- Set max transaction limits
- Configure fee exclusions

## 🔍 Testing Checklist

Once your app is running:

1. ✅ Connect wallet successfully
2. ✅ See your token balance
3. ✅ Transfer tokens to another address
4. ✅ Approve spending allowance
5. ✅ Burn some tokens
6. ✅ (If owner) Mint new tokens
7. ✅ (If owner) Create a snapshot
8. ✅ (If owner) Configure tax rate

## 🐛 Common Issues & Solutions

### "Cannot find contract"
**Solution**: Make sure you've updated `CONTRACT_ADDRESS` and `CONTRACT_ABI` in `config/contract.ts`

### "Wrong network"
**Solution**: Switch to Kasplex Testnet in MetaMask. The app will show a notification.

### "Transaction failed"
**Check**:
- Do you have enough KAS for gas?
- Is the contract paused?
- Are you blacklisted?
- Does transaction exceed max limit?

### Build errors
**Solution**: Make sure all dependencies installed successfully. Try:
```bash
npm install --legacy-peer-deps
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/config/wagmi.ts` | Network & wallet configuration |
| `src/config/contract.ts` | Contract address & ABI |
| `src/app/page.tsx` | Main app page |
| `src/app/layout.tsx` | Web3 provider setup |
| `src/components/TokenInfo.tsx` | Token display |
| `src/components/AdminPanel.tsx` | Admin controls |

## 🌐 Useful Links

- **Kasplex Testnet Faucet**: Get test KAS tokens
- **Kasplex Explorer**: https://explorer.testnet.kasplextest.xyz
- **WalletConnect Project ID**: https://cloud.walletconnect.com

## 🆘 Need Help?

1. Check browser console for errors (F12)
2. Verify wallet is connected
3. Confirm correct network
4. Check contract is deployed
5. Verify ABI matches contract

## 🎉 You're Almost There!

Just waiting for dependencies to install, then you're ready to deploy and run!

---

**Pro Tip**: Test with a small amount of tokens first before doing bulk operations!
