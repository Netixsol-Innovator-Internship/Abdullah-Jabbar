# 🚀 Quick Start Guide

Get your DeFi + NFT Ecosystem running in 10 minutes!

## ⚡ Prerequisites Check

Before starting, make sure you have:

- [ ] Node.js v16+ installed (`node --version`)
- [ ] MetaMask extension installed in browser
- [ ] Some Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))
- [ ] Code editor (VS Code recommended)

## 📝 Step-by-Step Setup

### 1. Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd "Week 12/Day-5"

# Install dependencies
npm install
```

### 2. Configure Environment (3 minutes)

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` file with your details:
```env
PRIVATE_KEY=your_metamask_private_key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-KEY
ETHERSCAN_API_KEY=your_etherscan_key
```

**How to get these:**
- **Private Key**: MetaMask → Account Details → Export Private Key (⚠️ NEVER share!)
- **RPC URL**: Sign up at [Alchemy](https://alchemy.com) or [Infura](https://infura.io)
- **Etherscan Key**: Sign up at [Etherscan](https://etherscan.io/apis)

### 3. Upload NFT Images to IPFS (Optional, 2 minutes)

1. Go to [Pinata](https://pinata.cloud) and sign up
2. Upload your NFT images (or use placeholders)
3. Copy the IPFS CID
4. Update `scripts/deploy.js` line 115 with your CID

### 4. Deploy Contracts (2 minutes)

```bash
# Compile contracts
npx hardhat compile

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

**Expected Output:**
```
✅ Platform Token deployed to: 0x...
✅ Test USD deployed to: 0x...
✅ DEX deployed to: 0x...
✅ NFT Collection deployed to: 0x...
✅ NFT Marketplace deployed to: 0x...
```

### 5. Update Frontend Config (1 minute)

Open `src/config.js` and paste your deployed contract addresses:

```javascript
export const CONTRACT_ADDRESSES = {
  PlatformToken: '0xYOUR_ADDRESS_HERE',
  TestUSD: '0xYOUR_ADDRESS_HERE',
  TestBTC: '0xYOUR_ADDRESS_HERE',
  TokenFaucet: '0xYOUR_ADDRESS_HERE',
  MultiTokenDEX: '0xYOUR_ADDRESS_HERE',
  NFTCollection: '0xYOUR_ADDRESS_HERE',
  NFTMarketplace: '0xYOUR_ADDRESS_HERE'
};
```

### 6. Start Frontend (30 seconds)

```bash
npm run dev
```

Open browser at: **http://localhost:3000**

### 7. Test the Platform (2 minutes)

1. **Connect Wallet** → Click "Connect Wallet" button
2. **Claim Tokens** → Go to Faucet → Click "Claim Tokens"
3. **Swap Tokens** → Go to DEX → Swap SWAP for TUSD
4. **Buy NFT** → Go to Marketplace → Select token → Buy NFT
5. **View Portfolio** → Check your balances and NFTs

## ✅ Verification

If everything works:
- ✅ You should see your wallet address in navbar
- ✅ Faucet shows 100 SWAP tokens claimed
- ✅ DEX displays pool reserves
- ✅ Marketplace shows NFTs with prices
- ✅ Portfolio displays your tokens and NFTs

## 🐛 Troubleshooting

### Problem: "Cannot find module @openzeppelin/contracts"
**Solution:**
```bash
npm install @openzeppelin/contracts
```

### Problem: "Insufficient funds for gas"
**Solution:** Get more Sepolia ETH from faucet:
- https://sepoliafaucet.com/
- https://faucet.sepolia.dev/

### Problem: "Transaction Failed"
**Solution:**
1. Check MetaMask is on Sepolia network
2. Ensure you have enough ETH for gas
3. Try increasing gas limit in MetaMask

### Problem: "Contract not found"
**Solution:**
1. Verify contracts deployed successfully
2. Check `deployment.json` for addresses
3. Update `src/config.js` with correct addresses

### Problem: "IPFS metadata not loading"
**Solution:**
1. Verify IPFS CID is correct
2. Try accessing `ipfs://YOUR_CID/0.json` in IPFS gateway
3. Use Pinata gateway: `https://gateway.pinata.cloud/ipfs/YOUR_CID/0.json`

## 🎯 Quick Test Checklist

- [ ] Deploy all contracts ✓
- [ ] Frontend loads without errors ✓
- [ ] Can connect MetaMask ✓
- [ ] Can claim tokens from faucet ✓
- [ ] Can swap tokens on DEX ✓
- [ ] Can view NFTs in marketplace ✓
- [ ] Can buy NFT with SWAP token ✓
- [ ] Can buy NFT with alternative token ✓
- [ ] Portfolio shows correct balances ✓

## 📚 Next Steps

1. **Verify Contracts** on Etherscan:
   ```bash
   npx hardhat verify --network sepolia CONTRACT_ADDRESS "Constructor Args"
   ```

2. **Customize NFTs**: Update metadata in `nft-metadata/` folder

3. **Add More Features**:
   - Add more trading pairs to DEX
   - Implement staking functionality
   - Add governance features

4. **Deploy to Mainnet**: When ready, deploy to Ethereum mainnet (⚠️ costs real money!)

## 🎉 Success!

Congratulations! You now have a fully functional DeFi + NFT Ecosystem!

**Share your deployment:**
- Tweet about it with #DeFiNFT
- Add to your portfolio
- Submit to hackathon

## 💡 Pro Tips

1. **Gas Optimization**: Use Hardhat Gas Reporter to analyze gas usage
2. **Security**: Run Slither for security analysis
3. **Testing**: Write unit tests before mainnet deployment
4. **Documentation**: Keep deployment addresses in `deployment.json`

## 📞 Need Help?

- Check main [README.md](./README.md) for detailed documentation
- Review smart contracts in `contracts/` folder
- Check Hardhat console for detailed error messages
- Open an issue on GitHub

---

**Happy Building! 🚀**
