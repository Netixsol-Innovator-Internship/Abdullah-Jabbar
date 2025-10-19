# Claw Token Frontend - Setup Complete

## 🎉 Configuration Updated

Your Claw Token frontend has been successfully configured with **Kasplex Testnet**!

### Network Configuration

**Primary Network: Kasplex Testnet**
- Chain ID: `167012`
- Native Currency: KAS (Kasplex)
- RPC URL: `https://rpc.kasplextest.xyz`
- Block Explorer: `https://explorer.testnet.kasplextest.xyz`

**Fallback Network: Sepolia Testnet**
- Chain ID: `11155111`
- Native Currency: SEP (Sepolia Ether)
- RPC URL: `https://rpc.sepolia.org`
- Block Explorer: `https://sepolia.etherscan.io`

### Wallet Connectors
- ✅ MetaMask
- ✅ WalletConnect
- ✅ Injected Wallets

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Main layout with Web3 providers
│   │   ├── page.tsx            # Home page with all components
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── AdminPanel.tsx      # Admin control center
│   │   ├── TokenInfo.tsx       # Token information display
│   │   ├── TransferTokens.tsx  # Transfer functionality
│   │   ├── ApproveTokens.tsx   # Approval management
│   │   ├── BurnTokens.tsx      # Token burning
│   │   └── admin/
│   │       ├── MintPanel.tsx       # Minting controls
│   │       ├── TaxPanel.tsx        # Tax configuration
│   │       ├── BlacklistPanel.tsx  # Blacklist management
│   │       ├── PausePanel.tsx      # Pause/unpause controls
│   │       └── SnapshotPanel.tsx   # Snapshot management
│   └── config/
│       ├── wagmi.ts           # Wagmi + Kasplex config
│       └── contract.ts        # Contract ABI and address
└── package.json
```

## 🚀 Next Steps

### 1. Deploy Your Contract
Deploy the ClawToken contract to Kasplex Testnet:
```bash
# In your Contract directory
# Deploy using Hardhat or your preferred tool
```

### 2. Update Contract Configuration
After deployment, update `src/config/contract.ts`:
```typescript
export const CLAW_TOKEN_ADDRESS = '0xYourDeployedContractAddress';
export const CALW_TOKEN_ABI = [...]; // Add your ABI
```

### 3. Install Dependencies (In Progress)
The following command is currently running:
```bash
npm install wagmi viem@2.x @tanstack/react-query --legacy-peer-deps
```

### 4. Run the Development Server
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Connect Wallet
1. Open the app in your browser
2. Click "Connect Wallet"
3. Select MetaMask or WalletConnect
4. Make sure you're on Kasplex Testnet

### 6. Add Kasplex Testnet to MetaMask
If Kasplex Testnet isn't in your MetaMask:
1. Network Name: `Kasplex Testnet`
2. RPC URL: `https://rpc.kasplextest.xyz`
3. Chain ID: `167012`
4. Currency Symbol: `KAS`
5. Block Explorer: `https://explorer.testnet.kasplextest.xyz`

## 🎨 Features Implemented

### User Features
- ✅ **Token Information** - View balance, total supply, name, symbol
- ✅ **Transfer Tokens** - Send tokens to any address
- ✅ **Approve Tokens** - Approve spending allowances
- ✅ **Burn Tokens** - Burn your own tokens
- ✅ **Increase/Decrease Allowance** - Safely modify approvals

### Admin Features (Owner Only)
- ✅ **Mint Tokens** - Create new tokens
- ✅ **Batch Mint** - Mint to multiple addresses
- ✅ **Configure Tax** - Set transfer tax rate (0-10%)
- ✅ **Tax Receiver** - Set tax collection address
- ✅ **Blacklist Management** - Add/remove blacklisted addresses
- ✅ **Pause/Unpause** - Emergency pause functionality
- ✅ **Snapshot Management** - Create and view snapshots
- ✅ **Max Transaction Limits** - Set transaction limits
- ✅ **Fee Exclusions** - Exclude addresses from fees

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Wagmi v2** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **TanStack Query** - Async state management
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

## 🔒 Security Features

The contract includes comprehensive security:
- ✅ Reentrancy protection
- ✅ Approval race condition prevention
- ✅ 24-hour timelock for critical changes
- ✅ Permit replay attack protection
- ✅ 2-step ownership transfer
- ✅ Blacklist functionality
- ✅ Emergency pause
- ✅ Max transaction limits

## 📝 Environment Variables

Create a `.env.local` file:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get your WalletConnect Project ID from: https://cloud.walletconnect.com

## 🐛 Troubleshooting

### React Version Conflicts
If you see peer dependency warnings, it's because you're using React 19. The `--legacy-peer-deps` flag handles this.

### Contract Not Found
Make sure you've:
1. Deployed the contract
2. Updated `CLAW_TOKEN_ADDRESS` in `config/contract.ts`
3. Added the correct ABI

### Wrong Network
The app will prompt you to switch networks if you're not on Kasplex Testnet or Sepolia.

### Transaction Failures
Check that:
- You have enough KAS for gas fees
- You're not blacklisted
- The contract isn't paused
- Transaction doesn't exceed max limit

## 📚 Documentation

For more information:
- [Wagmi Docs](https://wagmi.sh)
- [Viem Docs](https://viem.sh)
- [Next.js Docs](https://nextjs.org/docs)
- [Kasplex Testnet](https://kasplextest.xyz)

## 🤝 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your wallet is connected
3. Ensure you're on the correct network
4. Check contract deployment status

Happy building! 🚀
