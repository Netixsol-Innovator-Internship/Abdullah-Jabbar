# DeFi NFT Ecosystem - Next.js Frontend

This is the **Next.js 15** frontend for the Complete DeFi + NFT Ecosystem blockchain project.

## 🚀 Features

- **🔐 Wallet Connection**: MetaMask integration via ethers.js
- **💧 Token Faucet**: Claim free tokens with 24-hour cooldown
- **🔄 DEX (Decentralized Exchange)**: Swap tokens with 3 trading pairs
- **🖼️ NFT Marketplace**: Buy NFTs with multiple token payment options
- **👛 Portfolio**: View all your tokens and NFTs in one place

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Home (Faucet page)
│   │   ├── dex/page.tsx       # DEX page
│   │   ├── marketplace/page.tsx # NFT Marketplace page
│   │   ├── portfolio/page.tsx # Portfolio page
│   │   ├── layout.tsx         # Root layout with WalletProvider
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── Navbar.tsx         # Navigation bar
│   │   ├── FaucetPage.tsx     # Token faucet component
│   │   ├── DEXPage.tsx        # DEX component
│   │   ├── MarketplacePage.tsx # NFT marketplace component
│   │   └── PortfolioPage.tsx  # Portfolio component
│   ├── context/               # React Context
│   │   └── WalletContext.tsx  # Wallet state management
│   └── config/                # Configuration
│       └── contracts.ts       # Contract addresses & ABIs
├── package.json
└── tsconfig.json
```

## 🛠️ Tech Stack

- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type safety
- **ethers.js 6.9.0** - Ethereum interaction
- **Tailwind CSS** - Utility-first CSS (compatible with custom CSS)

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Contract Addresses

Update `src/config/contracts.ts` with your deployed contract addresses:

```typescript
export const CONTRACT_ADDRESSES = {
  PlatformToken: '0xYOUR_PLATFORM_TOKEN_ADDRESS',
  TestUSD: '0xYOUR_TESTUSD_ADDRESS',
  TestBTC: '0xYOUR_TESTBTC_ADDRESS',
  TokenFaucet: '0xYOUR_FAUCET_ADDRESS',
  MultiTokenDEX: '0xYOUR_DEX_ADDRESS',
  NFTCollection: '0xYOUR_NFT_ADDRESS',
  NFTMarketplace: '0xYOUR_MARKETPLACE_ADDRESS'
};
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔗 Connect MetaMask

1. Install [MetaMask](https://metamask.io/) browser extension
2. Add Sepolia testnet to MetaMask:
   - Network Name: Sepolia
   - RPC URL: `https://sepolia.infura.io/v3/YOUR_KEY`
   - Chain ID: 11155111
   - Currency: ETH
3. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
4. Click "Connect Wallet" in the app

## 📄 Pages

### 🏠 Home (Faucet) - `/`
- Claim 100 tokens every 24 hours
- View cooldown timer
- Check total claims and available balance

### 🔄 DEX - `/dex`
- Swap between SWAP, TUSD, and TBTC tokens
- View pool information and prices
- Real-time balance updates

### 🖼️ Marketplace - `/marketplace`
- Browse available NFTs
- Buy NFTs with any supported token (SWAP, TUSD, TBTC)
- Multi-token payment via automatic DEX conversion
- View NFT ownership

### 👛 Portfolio - `/portfolio`
- View all token balances
- Display owned NFTs
- Quick action buttons

## 🎨 Custom Styling

The app uses custom CSS variables for theming alongside Tailwind CSS:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #10b981;
  --background: #0f172a;
  --card-bg: #1e293b;
  --text-primary: #f1f5f9;
}
```

## 🔌 Smart Contract Integration

The app interacts with 7 smart contracts:

1. **PlatformToken** - ERC-20 native token (SWAP)
2. **TestUSD** - Test USD token (TUSD)
3. **TestBTC** - Test BTC token (TBTC)
4. **TokenFaucet** - Free token distribution
5. **MultiTokenDEX** - Automated Market Maker
6. **NFTCollection** - ERC-721 NFT collection
7. **NFTMarketplace** - Multi-token NFT sales

## 🧪 Building for Production

```bash
npm run build
npm start
```

## 🌐 Deployment

Deploy to Vercel:

```bash
vercel deploy
```

Or any other Next.js compatible platform.

## 📦 Environment Variables

Create a `.env.local` file (optional):

```env
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

## 🐛 Troubleshooting

### MetaMask Connection Issues
- Ensure MetaMask is installed and unlocked
- Check you're on the correct network (Sepolia)
- Refresh the page if connection fails

### Transaction Failures
- Ensure you have enough ETH for gas fees
- Check contract addresses are correct
- Verify you have token balances for swaps/purchases

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

## 🎉 Key Innovation

### Multi-Token NFT Marketplace
The marketplace allows users to buy NFTs with **any supported token**, not just the platform token. The marketplace contract automatically swaps via DEX if needed!

---
