# Frontend Integration Guide - Aligned Tokens

## Quick Start

Both `Claw` and `Tiger` tokens now have **identical interfaces**. This means you can create reusable components!

## Contract Addresses

After deployment, update these in `src/config/contract.ts`:

```typescript
export const contracts = {
  claw: {
    address: "0x...", // From deployment-aligned.json
    abi: ClawABI
  },
  tiger: {
    address: "0x...", // From deployment-aligned.json
    abi: TigerABI
  },
  tokenSwap: {
    address: "0x...", // From deployment-aligned.json
    abi: TokenSwapABI
  }
}
```

## Shared Token Interface

Create a reusable hook for both tokens:

```typescript
// hooks/useToken.ts
import { useReadContract, useWriteContract } from 'wagmi'

export function useToken(tokenAddress: string, tokenAbi: any) {
  // Read functions
  const { data: tokenInfo } = useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: 'getTokenInfo'
  })

  const { data: taxRate } = useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: 'taxRate'
  })

  const { data: maxTxAmount } = useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: 'maxTransactionAmount'
  })

  // Write functions
  const { writeContract: transfer } = useWriteContract()
  const { writeContract: approve } = useWriteContract()
  const { writeContract: burn } = useWriteContract()

  return {
    tokenInfo,
    taxRate,
    maxTxAmount,
    transfer: (to: string, amount: bigint) => 
      transfer({ address: tokenAddress, abi: tokenAbi, functionName: 'transfer', args: [to, amount] }),
    approve: (spender: string, amount: bigint) =>
      approve({ address: tokenAddress, abi: tokenAbi, functionName: 'approve', args: [spender, amount] }),
    burn: (amount: bigint) =>
      burn({ address: tokenAddress, abi: tokenAbi, functionName: 'burn', args: [amount] })
  }
}
```

## Usage Example

```typescript
// In your component
function TokenDisplay({ tokenType }: { tokenType: 'claw' | 'tiger' }) {
  const config = tokenType === 'claw' ? contracts.claw : contracts.tiger
  const token = useToken(config.address, config.abi)

  return (
    <div>
      <h2>{token.tokenInfo?.tokenName}</h2>
      <p>Symbol: {token.tokenInfo?.tokenSymbol}</p>
      <p>Total Supply: {formatEther(token.tokenInfo?.tokenTotalSupply || 0n)}</p>
      <p>Tax Rate: {Number(token.taxRate || 0n) / 100}%</p>
      <button onClick={() => token.burn(parseEther('100'))}>
        Burn 100 Tokens
      </button>
    </div>
  )
}
```

## Common Functions Reference

### User Functions (No owner required)

```typescript
// Transfer tokens
await token.transfer(recipientAddress, parseEther('100'))

// Approve spending
await token.approve(spenderAddress, parseEther('1000'))

// Transfer from (after approval)
await token.transferFrom(fromAddress, toAddress, parseEther('50'))

// Burn tokens
await token.burn(parseEther('10'))

// Check balance
const balance = await token.balanceOf(userAddress)

// Check if blacklisted
const isBlacklisted = await token.blacklisted(userAddress)

// Get token info
const info = await token.getTokenInfo()
```

### Owner Functions

```typescript
// Mint new tokens
await token.mint(recipientAddress, parseEther('1000'))

// Pause transfers
await token.pause()

// Unpause transfers
await token.unpause()

// Blacklist address
await token.addToBlacklist(badActorAddress)

// Remove from blacklist
await token.removeFromBlacklist(addressToUnblock)

// Set tax rate (in basis points, 100 = 1%)
await token.setTaxRate(500) // 5%

// Set tax receiver
await token.setTaxReceiver(newReceiverAddress)

// Set max transaction amount
await token.setMaxTransactionAmount(parseEther('10000'))

// Exclude from tax
await token.setExcludedFromTax(dexAddress, true)

// Exclude from max transaction
await token.setExcludedFromMaxTransaction(dexAddress, true)
```

## TokenSwap (DEX) Functions

### Add Liquidity

```typescript
const { writeContract: addLiquidity } = useWriteContract()

// 1. First approve both tokens
await clawToken.approve(tokenSwapAddress, parseEther('1000'))
await tigerToken.approve(tokenSwapAddress, parseEther('1000'))

// 2. Add liquidity
await addLiquidity({
  address: tokenSwapAddress,
  abi: TokenSwapABI,
  functionName: 'addLiquidity',
  args: [
    parseEther('1000'), // amountA
    parseEther('1000'), // amountB
    parseEther('950'),  // minAmountA (5% slippage)
    parseEther('950')   // minAmountB (5% slippage)
  ]
})
```

### Remove Liquidity

```typescript
await tokenSwap.removeLiquidity(
  liquidityAmount,
  minAmountA,
  minAmountB
)
```

### Swap Tokens

```typescript
// Swap Claw for Tiger
const amountOut = await tokenSwap.getAmountOut(
  parseEther('100'),
  reserveA,
  reserveB
)

await tokenSwap.swapAForB(
  parseEther('100'),    // amountIn
  amountOut * 95n / 100n // minAmountOut (5% slippage)
)

// Swap Tiger for Claw
await tokenSwap.swapBForA(
  parseEther('100'),
  minAmountOut
)
```

### Get Pool Info

```typescript
const poolInfo = await tokenSwap.getPoolInfo()
// Returns: tokenA, tokenB, reserveA, reserveB, totalLiquidity, price, feeRate

const userLiquidity = await tokenSwap.getUserLiquidity(userAddress)
// Returns: userLiquidity, userShareA, userShareB, sharePercentage

const priceImpact = await tokenSwap.calculatePriceImpact(
  parseEther('100'),
  true // isAForB
)
```

## Events to Listen For

### Token Events

```typescript
// Transfer
event Transfer(address indexed from, address indexed to, uint256 value)

// Approval
event Approval(address indexed owner, address indexed spender, uint256 value)

// Blacklist
event Blacklisted(address indexed account)
event UnBlacklisted(address indexed account)

// Tax Collection
event TaxCollected(address indexed from, address indexed to, uint256 amount)

// Minting
event TokensMinted(address indexed to, uint256 amount)

// Configuration
event TaxRateUpdated(uint256 oldRate, uint256 newRate)
event TaxReceiverUpdated(address indexed oldReceiver, address indexed newReceiver)
event MaxTransactionAmountUpdated(uint256 oldAmount, uint256 newAmount)

// Pause
event Paused(address account)
event Unpaused(address account)
```

### TokenSwap Events

```typescript
event LiquidityAdded(
  address indexed provider,
  uint256 amountA,
  uint256 amountB,
  uint256 liquidityMinted
)

event LiquidityRemoved(
  address indexed provider,
  uint256 amountA,
  uint256 amountB,
  uint256 liquidityBurned
)

event Swap(
  address indexed user,
  address indexed tokenIn,
  address indexed tokenOut,
  uint256 amountIn,
  uint256 amountOut
)
```

## Error Handling

Both tokens use the same custom errors:

```typescript
error AccountBlacklisted(address account)
error AccountNotBlacklisted(address account)
error CannotBlacklistOwner()
error ExceedsMaxTransactionAmount(uint256 amount, uint256 maxAmount)
error InvalidTaxRate(uint256 rate)
error InvalidAddress()
error InvalidAmount()
error MaxSupplyExceeded()
```

Handle them in your frontend:

```typescript
try {
  await token.transfer(recipient, amount)
} catch (error: any) {
  if (error.message.includes('AccountBlacklisted')) {
    toast.error('This address is blacklisted')
  } else if (error.message.includes('ExceedsMaxTransactionAmount')) {
    toast.error('Amount exceeds maximum transaction limit')
  } else if (error.message.includes('InvalidAmount')) {
    toast.error('Invalid amount')
  }
  // ... handle other errors
}
```

## Constants

```typescript
// Claw Token
MAX_SUPPLY: 1_000_000_000 * 10^18 // 1 billion tokens
MAX_TAX_RATE: 1000 // 10% in basis points

// Tiger Token
MAX_SUPPLY: 10_000_000 * 10^18 // 10 million tokens
MAX_TAX_RATE: 1000 // 10% in basis points

// TokenSwap
FEE_BASIS_POINTS: 30 // 0.3%
BASIS_POINTS: 10000
MINIMUM_LIQUIDITY: 1000
```

## Utilities

```typescript
// Convert basis points to percentage
function basisPointsToPercent(bp: bigint): number {
  return Number(bp) / 100
}

// Calculate tax amount
function calculateTax(amount: bigint, taxRate: bigint): bigint {
  return (amount * taxRate) / 10000n
}

// Calculate amount after tax
function amountAfterTax(amount: bigint, taxRate: bigint): bigint {
  const tax = calculateTax(amount, taxRate)
  return amount - tax
}

// Format token amount
function formatTokenAmount(amount: bigint, decimals = 18): string {
  return formatUnits(amount, decimals)
}

// Parse token amount
function parseTokenAmount(amount: string, decimals = 18): bigint {
  return parseUnits(amount, decimals)
}
```

## Tips

1. **Always approve before transfers**: DEX needs approval to move your tokens
2. **Check tax rates**: Both tokens have configurable taxes
3. **Monitor max transaction limits**: Large transfers might fail
4. **Use slippage protection**: Always set minAmountOut for swaps
5. **Listen to events**: Real-time updates for better UX
6. **Handle errors gracefully**: Custom errors provide clear messages
7. **Cache token info**: Avoid repeated calls to getTokenInfo()
8. **Exclude DEX from taxes**: Owner should exclude TokenSwap address

## Component Examples

See the `src/components` folder for reference implementations:
- `TokenInfo.tsx` - Display token information
- `TransferTokens.tsx` - Transfer interface
- `BurnTokens.tsx` - Burn interface
- `ApproveTokens.tsx` - Approval interface
- `SwapInterface.tsx` - Token swap UI
- `LiquidityPool.tsx` - Add/remove liquidity
- `AdminPanel.tsx` - Owner functions

All components are now reusable for both Claw and Tiger tokens!
