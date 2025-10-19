# Quick Deployment Commands

## ⚡ One-Command Deploy (After setup)

# Deploy to Kasplex Testnet
npx hardhat run scripts/deploy.js --network kasplex

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to Local Network (for testing)
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy
npx hardhat run scripts/deploy.js --network localhost

## 🔍 View Deployment Info
cat deployment.json

## 🧪 Test Deployment
npx hardhat test --network kasplex
