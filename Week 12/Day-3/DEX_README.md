# CLAW-TIGER DEX

A decentralized exchange (DEX) built for swapping between CLAW and TIGER tokens using an automated market maker (AMM) model.

## 🌟 Features

### Smart Contracts
- **SimpleSwap**: Constant product AMM (x * y = k)
- **TigerToken**: Simple ERC-20 token for trading pair
- **ClawToken**: Advanced ERC-20 with comprehensive features

### DEX Features
- ✅ Token swapping with automatic price discovery
- ✅ Liquidity pools with LP token rewards
- ✅ Slippage protection
- ✅ Price impact calculations
- ✅ Real-time pool analytics
- ✅ 0.3% trading fee for liquidity providers

### Frontend Features
- 📱 Responsive design with modern UI
- 🔄 Real-time price updates
- 📊 Pool statistics and analytics
- 💧 Liquidity management interface
- 🎯 Advanced trading settings

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Hardhat for contract deployment
- MetaMask wallet

### 1. Deploy Contracts

```bash
cd Contract
npx hardhat run deploy-dex.js --network <your-network>
```

### 2. Update Configuration

Update `frontend/src/config/contract.ts` with deployed addresses:
```typescript
export const TIGER_TOKEN_ADDRESS = "YOUR_TIGER_TOKEN_ADDRESS";
export const TOKEN_SWAP_ADDRESS = "YOUR_TOKEN_SWAP_ADDRESS";
```

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📋 Activity Guide

### Activity 1: Deploy Your DEX

1. **Deploy contracts** using the deployment script
2. **Add initial liquidity** (e.g., 1000 CLAW + 1000 TIGER)
3. **Test both swap directions** (CLAW → TIGER and TIGER → CLAW)
4. **Check reserves** after each swap to understand pool mechanics

### Activity 2: Test Price Impact

1. **Make small swap** (10 tokens)
   - Note the exchange rate
   - Record the price before/after
2. **Make larger swap** (100 tokens)
   - Compare exchange rates
   - Calculate price impact percentage
3. **Observe** how larger trades affect the pool more significantly

### Activity 3: Build Trading Strategies

1. **Monitor pool composition** and reserves
2. **Test different slippage tolerances**
3. **Analyze trading fees** accumulation
4. **Calculate APR** for liquidity providers

## 🎯 How It Works

### Automated Market Maker (AMM)

The DEX uses the constant product formula: **x × y = k**

Where:
- `x` = CLAW token reserve
- `y` = TIGER token reserve  
- `k` = constant product

### Price Calculation

```
price = y / x
```

### Swap Formula

```
amountOut = (amountIn × reserveOut × 997) / (reserveIn × 1000 + amountIn × 997)
```
*Note: 997/1000 accounts for the 0.3% trading fee*

### Price Impact

```
priceImpact = |newPrice - oldPrice| / oldPrice × 100%
```

## 💰 Fee Structure

- **Trading Fee**: 0.3% (30 basis points)
- **Fee Distribution**: 100% to liquidity providers
- **No protocol fees**

## 🔒 Security Features

- ✅ Reentrancy protection on all functions
- ✅ Slippage protection for trades
- ✅ Minimum liquidity requirements
- ✅ Safe math operations
- ✅ Input validation and error handling

## 📊 Pool Mechanics

### Adding Liquidity
- First provider sets the initial price ratio
- Subsequent providers must add tokens in current pool ratio
- Receive LP tokens proportional to contribution
- Earn trading fees automatically

### Removing Liquidity
- Burn LP tokens to withdraw funds
- Receive proportional share of pool + accumulated fees
- Can partially or fully exit position

### Trading
- Swap tokens instantly at current market rate
- Price moves based on trade size relative to pool
- Larger trades = higher price impact
- Arbitrage opportunities help maintain fair pricing

## 🛠️ Development

### Contract Architecture

```
SimpleSwap.sol
├── Liquidity Management
│   ├── addLiquidity()
│   └── removeLiquidity()
├── Trading Functions
│   ├── swapAForB()
│   └── swapBForA()
├── View Functions
│   ├── getPrice()
│   ├── getAmountOut()
│   └── calculatePriceImpact()
└── Admin Functions
    └── emergencyWithdraw()
```

### Frontend Components

```
DEX Page
├── SwapInterface
├── LiquidityPool
├── PriceDisplay
└── Analytics
```

## 📈 Analytics

The DEX tracks:
- Real-time prices
- Trading volume
- Liquidity depth
- Price impact
- Fee generation
- Pool composition

## 🧪 Testing

### Manual Testing Steps

1. **Deploy all contracts**
2. **Mint tokens** to test accounts
3. **Approve tokens** for DEX contract
4. **Add initial liquidity**
5. **Test swaps** in both directions
6. **Verify price calculations**
7. **Test liquidity removal**
8. **Check fee accumulation**

### Price Impact Examples

| Trade Size | Price Impact | Explanation |
|------------|--------------|-------------|
| 10 tokens  | < 1%         | Small impact |
| 50 tokens  | 1-3%         | Moderate impact |
| 100+ tokens| > 3%         | High impact |

## 🚨 Important Notes

⚠️ **This is educational software**
- Use on testnets only for learning
- Not audited for production use
- Understand impermanent loss risks
- Always test thoroughly before mainnet

## 📚 Learning Resources

- [Uniswap V2 Whitepaper](https://uniswap.org/whitepaper.pdf)
- [AMM Fundamentals](https://ethereum.org/en/developers/docs/dapps/)
- [DeFi Risks](https://defipulse.com/blog/what-is-impermanent-loss/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Test thoroughly
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Happy Trading! 🚀**