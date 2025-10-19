# ✅ Setup Checklist

Use this checklist to track your deployment progress.

## Pre-Deployment

### Environment Setup
- [ ] Node.js v16+ installed
- [ ] MetaMask extension installed
- [ ] VS Code or code editor ready
- [ ] Git installed

### Accounts & Services
- [ ] MetaMask wallet created
- [ ] Sepolia testnet ETH obtained (from faucet)
- [ ] Alchemy account created (for RPC URL)
- [ ] Etherscan account created (for verification)
- [ ] Pinata account created (for IPFS)

### Configuration Files
- [ ] `.env` file created from `.env.example`
- [ ] Private key added to `.env`
- [ ] RPC URL added to `.env`
- [ ] Etherscan API key added to `.env`
- [ ] Pinata credentials added to `.env`

## NFT Preparation

- [ ] NFT images created (10-20 images)
- [ ] Images uploaded to Pinata
- [ ] IPFS CID copied
- [ ] Metadata JSON files updated with IPFS CID
- [ ] Metadata folder uploaded to Pinata
- [ ] Metadata CID copied
- [ ] Deployment script updated with metadata CID

## Smart Contract Deployment

- [ ] Dependencies installed (`npm install`)
- [ ] Contracts compiled successfully (`npx hardhat compile`)
- [ ] No compilation errors
- [ ] Deployment script reviewed
- [ ] Deployment executed (`npx hardhat run scripts/deploy.js --network sepolia`)
- [ ] All 7 contracts deployed successfully
- [ ] Contract addresses saved
- [ ] `deployment.json` file created

### Deployed Contract Addresses

Record your deployed addresses here:

```
Platform Token (SWAP): 0x___________________________________
Test USD (TUSD):        0x___________________________________
Test BTC (TBTC):        0x___________________________________
Token Faucet:           0x___________________________________
Multi-Token DEX:        0x___________________________________
NFT Collection:         0x___________________________________
NFT Marketplace:        0x___________________________________
```

## Contract Verification

- [ ] Platform Token verified on Etherscan
- [ ] Test USD verified on Etherscan
- [ ] Test BTC verified on Etherscan
- [ ] Token Faucet verified on Etherscan
- [ ] Multi-Token DEX verified on Etherscan
- [ ] NFT Collection verified on Etherscan
- [ ] NFT Marketplace verified on Etherscan

## Frontend Setup

- [ ] Contract addresses added to `src/config.js`
- [ ] All 7 addresses updated correctly
- [ ] Frontend dependencies installed
- [ ] Development server starts (`npm run dev`)
- [ ] No console errors
- [ ] MetaMask connects successfully

## Testing

### Faucet Testing
- [ ] Can connect MetaMask
- [ ] Can claim tokens from faucet
- [ ] Cooldown timer displays correctly
- [ ] Balance updates after claim
- [ ] Can't claim again before cooldown ends

### DEX Testing
- [ ] Can select token pairs
- [ ] Pool reserves display correctly
- [ ] Price calculation works
- [ ] Can enter swap amount
- [ ] Output amount calculates correctly
- [ ] Can approve tokens
- [ ] Can execute swap
- [ ] Balance updates after swap

### Marketplace Testing
- [ ] NFTs display in gallery
- [ ] Can select payment token
- [ ] Price displays in all tokens
- [ ] Can buy NFT with Platform Token
- [ ] Can buy NFT with Test USD
- [ ] Can buy NFT with Test BTC
- [ ] NFT ownership transfers correctly
- [ ] Balance updates after purchase

### Portfolio Testing
- [ ] All token balances display correctly
- [ ] Owned NFTs display correctly
- [ ] Total value calculation works
- [ ] Quick action buttons work

## Documentation

- [ ] README.md reviewed
- [ ] QUICKSTART.md reviewed
- [ ] PROJECT_SUMMARY.md reviewed
- [ ] Contract addresses documented
- [ ] Deployment notes written

## Final Checks

- [ ] All features working end-to-end
- [ ] No console errors
- [ ] MetaMask transactions succeed
- [ ] UI/UX is responsive
- [ ] Error messages are user-friendly
- [ ] Loading states work correctly

## Submission Preparation

- [ ] GitHub repository created
- [ ] All code pushed to GitHub
- [ ] README updated with deployed addresses
- [ ] Screenshots/demo video created (optional)
- [ ] License file included
- [ ] .gitignore configured correctly
- [ ] Deployment info documented

## Hackathon Submission

- [ ] Project submitted to hackathon platform
- [ ] Demo link provided (if required)
- [ ] GitHub link provided
- [ ] Contract addresses provided
- [ ] Video demo uploaded (if required)
- [ ] Presentation prepared (if required)

## Post-Submission

- [ ] Test all features one final time
- [ ] Monitor contract activity on Etherscan
- [ ] Respond to questions/feedback
- [ ] Share on social media (optional)

---

## Notes & Issues

Use this space to track any issues or notes:

```
Issue 1: _______________________________________________________
Solution: _______________________________________________________

Issue 2: _______________________________________________________
Solution: _______________________________________________________

Issue 3: _______________________________________________________
Solution: _______________________________________________________
```

## Deployment Date & Time

- **Date**: _______________
- **Network**: Sepolia
- **Deployer Address**: 0x_______________________________
- **Total Gas Used**: ______________ ETH
- **Status**: ⬜ In Progress | ⬜ Complete | ⬜ Submitted

---

**Good luck with your hackathon submission! 🚀**
