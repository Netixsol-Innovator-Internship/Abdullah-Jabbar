# Claw Token Frontend

A comprehensive Next.js frontend for interacting with the Claw Token smart contract - an advanced ERC-20 token with race condition protection.

## Features

### User Features
- **View Token Info**: Check total supply, your balance, tax rate, and transaction limits
- **Transfer Tokens**: Send tokens to other addresses with built-in tax calculation
- **Burn Tokens**: Permanently remove tokens from circulation
- **Approve Spenders**: Safely approve addresses to spend your tokens (with race condition protection)

### Admin Features (Owner Only)
- **Mint Tokens**: Create new tokens (single or batch minting)
- **Tax Configuration**: Propose, execute, or revoke tax rate changes (24-hour timelock)
- **Blacklist Management**: Add or remove addresses from the blacklist
- **Emergency Pause**: Pause/unpause all token transfers
- **Snapshots**: Create and query token balance snapshots for governance

## Tech Stack

- **Next.js 15** - React framework
- **RainbowKit** - Beautiful wallet connection UI
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add:

```env
# Get your project ID from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here

# Your deployed ClawToken contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### 3. Update Contract Configuration

Edit `src/config/contract.ts` and update the `CONTRACT_ADDRESS` if needed.

If you're using a different network, update `src/config/wagmi.ts`:

```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Claw Token DApp',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [mainnet, sepolia, hardhat], // Add your chains here
  ssr: true,
});
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### 5. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── page.tsx          # Main page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── TokenInfo.tsx     # Display token information
│   │   ├── TransferTokens.tsx # Transfer functionality
│   │   ├── BurnTokens.tsx    # Burn functionality
│   │   ├── ApproveTokens.tsx # Approve functionality
│   │   ├── AdminPanel.tsx    # Admin panel wrapper
│   │   └── admin/
│   │       ├── MintPanel.tsx       # Minting interface
│   │       ├── TaxPanel.tsx        # Tax configuration
│   │       ├── BlacklistPanel.tsx  # Blacklist management
│   │       ├── PausePanel.tsx      # Pause/unpause controls
│   │       └── SnapshotPanel.tsx   # Snapshot management
│   └── config/
│       ├── wagmi.ts          # Wagmi configuration
│       └── contract.ts       # Contract ABI and address
├── package.json
└── README.md
```

## Smart Contract Features Supported

### ERC-20 Standard
- ✅ Transfer
- ✅ Approve (with race condition protection)
- ✅ TransferFrom
- ✅ IncreaseAllowance
- ✅ DecreaseAllowance
- ✅ Burn
- ✅ BurnFrom

### Advanced Features
- ✅ Pausable transfers
- ✅ Transfer tax (configurable)
- ✅ Blacklist system
- ✅ Max transaction limits
- ✅ Balance snapshots
- ✅ 24-hour timelock for critical changes
- ✅ Batch operations (mint, blacklist)
- ✅ EIP-2612 Permit (gasless approvals)
- ✅ 2-Step ownership transfer

## Race Condition Protections

This frontend implements all the race condition protections from the smart contract:

1. **Approval Race Condition**: Uses `increaseAllowance` when current allowance > 0
2. **Timelock System**: 24-hour delay for critical parameter changes
3. **Reentrancy Protection**: All state-changing functions use reentrancy guards
4. **Atomic Operations**: Batch operations execute atomically

## Usage Guide

### For Token Holders

1. **Connect Wallet**: Click "Connect Wallet" in the top right
2. **View Balance**: Your balance and token info are displayed automatically
3. **Transfer**: Enter recipient address and amount, click "Transfer"
4. **Burn**: Enter amount to burn, confirm transaction
5. **Approve**: Approve a spender address to use your tokens

### For Contract Owner

The admin panel appears automatically if you're the contract owner:

1. **Mint**: Create new tokens (single or batch)
2. **Configure Tax**: 
   - Propose a new tax rate (requires 24-hour wait)
   - Execute after timelock expires
   - Or revoke the pending change
3. **Blacklist**: Add/remove addresses from blacklist
4. **Pause**: Emergency pause all transfers
5. **Snapshot**: Create snapshots for governance or airdrops

## Security Considerations

- Always verify transaction details before signing
- The 24-hour timelock on tax rate changes protects against sudden changes
- Blacklisted addresses cannot transfer tokens
- Max transaction amount prevents whale dumps
- Pausable feature allows emergency stops

## Troubleshooting

### "Wrong Network"
Make sure your wallet is connected to the correct network (e.g., Sepolia testnet).

### "Insufficient Allowance"
You need to approve the spender first before they can transfer your tokens.

### "Transaction Failed"
Common reasons:
- Insufficient balance
- Exceeds max transaction amount
- Address is blacklisted
- Contract is paused
- Timelock not expired

### TypeScript Errors
Install dependencies to resolve TypeScript errors:
```bash
npm install
```

## License

MIT

## Author

Built for the Claw Token project

## Support

For issues or questions, please open an issue on the GitHub repository.
