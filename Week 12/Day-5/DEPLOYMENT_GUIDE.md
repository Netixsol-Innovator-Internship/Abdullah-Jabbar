# 🚀 Deployment Guide for Kasplex Testnet

## Prerequisites

1. **MetaMask or Web3 Wallet** with Kasplex testnet configured
2. **KAS tokens** on Kasplex testnet for gas fees
   - Get from: https://faucet.kasplextest.xyz (if available)
3. **Private Key** exported from your wallet
4. **Node.js & npm** installed

## Step-by-Step Deployment

### 1. Install Dependencies
```powershell
npm install
```

### 2. Setup Environment Variables
Create a `.env` file in the project root:

```env
KASPLEX_RPC_URL=https://rpc.kasplextest.xyz
PRIVATE_KEY=your_wallet_private_key_here
```

⚠️ **NEVER commit your real `.env` file with private keys!**

### 3. Get Testnet Tokens
- Visit Kasplex faucet (check their Discord/docs)
- Ensure you have enough KAS for gas fees (~0.1 KAS should be sufficient)

### 4. Compile Contracts
```powershell
npx hardhat compile
```

### 5. Deploy to Kasplex Testnet
```powershell
npx hardhat run scripts/deploy.js --network kasplex
```

### 6. Save Deployment Addresses
The script automatically creates `deployment.json` with all contract addresses.

### 7. Update Frontend Configuration
Copy addresses from `deployment.json` to `frontend/src/config/addresses.ts`

### 8. Verify Contracts (Optional)
Check your deployed contracts on:
https://explorer.testnet.kasplextest.xyz

---

## 🔧 Troubleshooting

### Issue: "insufficient funds for intrinsic transaction cost"
**Solution:** Get more KAS tokens from the faucet

### Issue: "nonce too low"
**Solution:** Reset MetaMask account or wait a few seconds and retry

### Issue: "network timeout"
**Solution:** Check RPC URL and internet connection

### Issue: Deployment fails mid-way
**Solution:** Comment out completed steps in deploy.js and re-run

---

## 📝 Post-Deployment Checklist

- [ ] All 7 contracts deployed successfully
- [ ] Deployment addresses saved to `deployment.json`
- [ ] Faucet funded with platform tokens
- [ ] DEX pools created and liquidity added
- [ ] NFTs minted to deployer
- [ ] Marketplace configured with supported tokens
- [ ] Frontend updated with contract addresses
- [ ] Test basic functionality (claim faucet, swap, buy NFT)

---

## 🎯 Quick Deploy Commands

**Deploy to Kasplex:**
```powershell
npx hardhat run scripts/deploy.js --network kasplex
```

**Deploy to Sepolia:**
```powershell
npx hardhat run scripts/deploy.js --network sepolia
```

**Deploy to Local Hardhat:**
```powershell
npx hardhat node
# In another terminal:
npx hardhat run scripts/deploy.js --network localhost
```

---

## 🔒 Security Notes

1. **Never share your private key**
2. **Use .gitignore** to exclude `.env` file
3. **Use a testnet wallet** separate from your mainnet funds
4. **Double-check network** before deploying
5. **Verify contract source code** on explorer

---

## 📞 Support

- Kasplex Discord: [Link if available]
- Kasplex Docs: [Link if available]
- Explorer: https://explorer.testnet.kasplextest.xyz
- RPC: https://rpc.kasplextest.xyz
