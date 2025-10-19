# 🚀 DeFi + NFT Ecosystem

A complete blockchain platform combining DeFi token swaps and NFT marketplace with a native platform token - Built for the Blockchain Hackathon.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Hardhat](https://img.shields.io/badge/Hardhat-2.19.4-yellow)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Smart Contracts](#smart-contracts)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Deployment](#deployment)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployed Contracts](#deployed-contracts)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

This project is a unified blockchain ecosystem that seamlessly integrates:
- **Platform Token (SWAP)**: Native ERC-20 token powering the entire platform
- **Token Faucet**: Free token distribution with 24-hour cooldown
- **Multi-Token DEX**: Decentralized exchange with multiple trading pairs
- **NFT Collection**: ERC-721 tokens with IPFS metadata
- **NFT Marketplace**: Buy NFTs with multiple token options

### Key Innovation
The marketplace allows users to purchase NFTs using **any supported token**, automatically converting through the DEX. This creates a seamless user experience and demonstrates real DeFi composability.

## ✨ Features

### ✅ Core Requirements Implemented

#### 1. Platform Token (ERC-20) ✓
- ✅ Custom token: **SwapCoin (SWAP)**
- ✅ Initial supply: 1,000,000 tokens
- ✅ Mint function for faucet
- ✅ Burn functionality
- ✅ Full ERC-20 compliance

#### 2. Token Faucet ✓
- ✅ 100 SWAP tokens per claim
- ✅ 24-hour cooldown mechanism
- ✅ Claim history tracking
- ✅ User-friendly interface
- ✅ Cooldown timer display

#### 3. Multi-Token DEX ✓
- ✅ 3+ trading pairs (SWAP/TUSD, SWAP/TBTC, TUSD/TBTC)
- ✅ Automated Market Maker (AMM) model
- ✅ Liquidity pools with reserves
- ✅ 0.3% trading fee
- ✅ Price calculation and display
- ✅ Slippage protection

#### 4. NFT Collection (ERC-721) ✓
- ✅ Collection: "DeFi Art Collection (DFART)"
- ✅ Mintable NFTs with metadata
- ✅ IPFS integration for metadata
- ✅ Token URI management
- ✅ Ownership tracking

#### 5. NFT Marketplace ✓
- ✅ Buy NFTs with Platform Token
- ✅ **Multi-token payment system** (SWAP, TUSD, TBTC)
- ✅ Automatic price conversion via DEX
- ✅ Price display in all supported tokens
- ✅ Secondary market support

### 🎁 Bonus Features

- ✅ Modern React UI with responsive design
- ✅ MetaMask integration
- ✅ Real-time balance updates
- ✅ Transaction history
- ✅ Portfolio dashboard
- ✅ Gas-optimized contracts
- ✅ Emergency pause functionality
- ✅ Comprehensive error handling
- ✅ Event emission for all major actions

## 🏗️ Architecture

### System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Connect Wallet  │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Claim SWAP      │
                    │  from Faucet     │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Swap Tokens     │
                    │  on DEX          │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Browse NFTs     │
                    │  in Marketplace  │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Select Payment  │
                    │  Token           │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Buy NFT         │
                    │  (Auto Swap)     │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  View Portfolio  │
                    └──────────────────┘
```

### Contract Interactions

```
PlatformToken ←──────────── TokenFaucet (mints to users)
      │
      ├──────────────────→ MultiTokenDEX (trading pairs)
      │                            │
      └──────────────────→ NFTMarketplace
                                   │
                                   ├──→ Queries DEX for prices
                                   ├──→ Executes swaps on DEX
                                   └──→ Transfers NFTs from NFTCollection
```

## 📜 Smart Contracts

### 1. PlatformToken.sol
**SwapCoin (SWAP)** - Native platform token

```solidity
Key Functions:
- mint(address to, uint256 amount)
- burn(uint256 amount)
- transfer, approve, transferFrom (ERC-20 standard)
```

### 2. TokenFaucet.sol
Free token distribution system

```solidity
Key Functions:
- claimTokens() - Claim 100 SWAP tokens
- canClaim(address) - Check eligibility
- getTimeUntilNextClaim(address) - Cooldown timer
- getTotalClaimed(address) - User statistics
```

### 3. MultiTokenDEX.sol
Automated Market Maker DEX

```solidity
Key Functions:
- createPool(address tokenA, address tokenB)
- addLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB)
- swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut)
- getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut)
- getReserves(address tokenA, address tokenB)
- getPrice(address tokenA, address tokenB)
```

### 4. NFTCollection.sol
ERC-721 NFT collection

```solidity
Key Functions:
- mintNFT(address to, string memory tokenURI)
- batchMint(address to, string[] memory tokenURIs)
- tokensOfOwner(address owner)
- tokenURI(uint256 tokenId)
```

### 5. NFTMarketplace.sol
Multi-token NFT marketplace

```solidity
Key Functions:
- buyNFTWithPlatformToken(uint256 tokenId)
- buyNFTWithToken(uint256 tokenId, address paymentToken)
- calculatePriceInToken(address token)
- setNFTPrice(uint256 price)
- listNFT(uint256 tokenId, uint256 price)
- buyListedNFT(uint256 tokenId, address paymentToken)
```

## 🛠️ Tech Stack

### Blockchain
- **Solidity** ^0.8.20
- **Hardhat** - Development environment
- **OpenZeppelin** - Secure smart contract library
- **Ethers.js** v6 - Ethereum interaction

### Frontend
- **React** 18.2.0 - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **CSS3** - Styling

### Storage & APIs
- **IPFS (Pinata)** - NFT metadata storage
- **MetaMask** - Wallet integration

## 📦 Installation

### Prerequisites
- Node.js v16+ and npm
- MetaMask browser extension
- Git

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/defi-nft-ecosystem.git
cd defi-nft-ecosystem
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure .env file**
```env
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=your_alchemy_or_infura_url
ETHERSCAN_API_KEY=your_etherscan_api_key
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

5. **Upload NFT metadata to IPFS**
- See `nft-metadata/README.md` for instructions
- Update metadata URIs in deployment script

## 🚀 Deployment

### Compile Contracts
```bash
npx hardhat compile
```

### Deploy to Sepolia Testnet
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Verify Contracts
```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS "Constructor Args"
```

### Example Verification
```bash
npx hardhat verify --network sepolia 0x123... "SwapCoin" "SWAP"
```

## 📱 Usage Guide

### 1. Start Frontend
```bash
npm run dev
```
Access at: http://localhost:3000

### 2. Connect Wallet
- Click "Connect Wallet" button
- Approve MetaMask connection
- Switch to Sepolia network if needed

### 3. Get Tokens from Faucet
- Navigate to "Faucet" page
- Click "Claim Tokens"
- Wait for transaction confirmation
- Receive 100 SWAP tokens

### 4. Swap Tokens on DEX
- Go to "DEX" page
- Select token pair (e.g., SWAP → TUSD)
- Enter amount to swap
- Review estimated output
- Click "Swap" and confirm transaction

### 5. Buy NFTs
- Visit "Marketplace" page
- Select payment token (SWAP, TUSD, or TBTC)
- View price in selected token
- Click "Buy NFT" on desired NFT
- Approve token spending
- Confirm purchase transaction

### 6. View Portfolio
- Navigate to "Portfolio" page
- View all token balances
- See owned NFTs
- Check total portfolio value

## 📁 Project Structure

```
defi-nft-ecosystem/
├── contracts/
│   ├── PlatformToken.sol
│   ├── TestUSD.sol
│   ├── TestBTC.sol
│   ├── TokenFaucet.sol
│   ├── MultiTokenDEX.sol
│   ├── NFTCollection.sol
│   └── NFTMarketplace.sol
├── scripts/
│   └── deploy.js
├── src/
│   ├── components/
│   │   ├── Faucet.jsx
│   │   ├── DEX.jsx
│   │   ├── Marketplace.jsx
│   │   └── Portfolio.jsx
│   ├── App.jsx
│   ├── config.js
│   ├── App.css
│   └── index.css
├── nft-metadata/
│   ├── 0.json
│   ├── 1.json
│   ├── 2.json
│   └── README.md
├── hardhat.config.js
├── package.json
├── .env.example
└── README.md
```

## 🧪 Testing

### Run Tests
```bash
npx hardhat test
```

### Test Coverage
```bash
npx hardhat coverage
```

### Manual Testing Checklist

- [ ] Deploy all contracts successfully
- [ ] Claim tokens from faucet
- [ ] Verify 24-hour cooldown works
- [ ] Add liquidity to DEX
- [ ] Perform token swaps
- [ ] Mint NFTs with metadata
- [ ] Buy NFT with platform token
- [ ] Buy NFT with alternative token
- [ ] Verify automatic token conversion
- [ ] Check portfolio displays correctly

## 📍 Deployed Contracts

### Sepolia Testnet

| Contract | Address | Explorer |
|----------|---------|----------|
| Platform Token (SWAP) | `0x000...` | [View](https://sepolia.etherscan.io) |
| Test USD (TUSD) | `0x000...` | [View](https://sepolia.etherscan.io) |
| Test BTC (TBTC) | `0x000...` | [View](https://sepolia.etherscan.io) |
| Token Faucet | `0x000...` | [View](https://sepolia.etherscan.io) |
| Multi-Token DEX | `0x000...` | [View](https://sepolia.etherscan.io) |
| NFT Collection | `0x000...` | [View](https://sepolia.etherscan.io) |
| NFT Marketplace | `0x000...` | [View](https://sepolia.etherscan.io) |

**Note**: Update these addresses after deployment by modifying `src/config.js`

## 🎯 Features Implemented

### Minimum Requirements ✅
- [x] 5 Smart Contracts deployed
- [x] Platform Token (ERC-20)
- [x] Token Faucet with cooldown
- [x] Multi-Token DEX with 3+ pools
- [x] NFT Collection (ERC-721)
- [x] NFT Marketplace with multi-token support
- [x] Frontend with 4 pages
- [x] MetaMask integration
- [x] All features working end-to-end

### Bonus Features ✅
- [x] Modern, responsive UI design
- [x] Real-time price calculations
- [x] Transaction feedback
- [x] Portfolio dashboard
- [x] Gas-optimized contracts
- [x] Comprehensive documentation
- [x] Error handling
- [x] Event logging

## 🔐 Security Considerations

- ✅ ReentrancyGuard on critical functions
- ✅ Access control with Ownable
- ✅ Input validation on all functions
- ✅ SafeMath operations (built-in Solidity 0.8+)
- ✅ Proper token approvals
- ✅ Slippage protection on swaps

## 🐛 Common Issues & Solutions

### Issue: "Transaction Failed"
**Solution**: Ensure you have enough ETH for gas fees and tokens for the transaction.

### Issue: "Pool Does Not Exist"
**Solution**: Make sure liquidity has been added to the pool after deployment.

### Issue: "Cannot Claim Tokens"
**Solution**: Check if 24 hours have passed since your last claim.

### Issue: "NFT Not Showing"
**Solution**: Verify IPFS metadata is accessible and properly formatted.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Built with ❤️ by [Your Name]

## 📞 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Hardhat team for excellent development tools
- Ethereum community for documentation and support
- Hackathon organizers for the opportunity

## 🔗 Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [React Documentation](https://react.dev/)

---

**⭐ If you found this project helpful, please give it a star!**

**🚀 Happy Hacking!**
