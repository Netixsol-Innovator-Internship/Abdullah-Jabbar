# Understanding addLiquidity Parameters

## Function Signature

```solidity
function addLiquidity(
    uint256 amountA,        // Desired amount of Token A (Claw)
    uint256 amountB,        // Desired amount of Token B (Tiger)
    uint256 minAmountA,     // Minimum acceptable Token A (slippage protection)
    uint256 minAmountB      // Minimum acceptable Token B (slippage protection)
) external returns (uint256 liquidityMinted)
```

## What Are These Parameters?

### 1. `amountA` - Desired Amount of Token A
**What it is:** The maximum amount of Token A (Claw) you want to add to the pool.

**Example:** If you want to add 1000 CLAW tokens:
```javascript
amountA = parseEther('1000') // 1000 * 10^18
```

### 2. `amountB` - Desired Amount of Token B
**What it is:** The maximum amount of Token B (Tiger) you want to add to the pool.

**Example:** If you want to add 500 TIGER tokens:
```javascript
amountB = parseEther('500') // 500 * 10^18
```

### 3. `minAmountA` - Minimum Token A (Slippage Protection)
**What it is:** The minimum amount of Token A you're willing to add. If the actual amount needed is less than this, the transaction reverts.

**Why needed:** Protects you from price changes between submitting and executing the transaction.

**Calculation:** Usually 95-99% of your desired amount (1-5% slippage tolerance)
```javascript
minAmountA = amountA * 95n / 100n  // 5% slippage tolerance
// or
minAmountA = amountA * 99n / 100n  // 1% slippage tolerance
```

### 4. `minAmountB` - Minimum Token B (Slippage Protection)
**What it is:** The minimum amount of Token B you're willing to add.

**Calculation:** Usually 95-99% of your desired amount
```javascript
minAmountB = amountB * 95n / 100n  // 5% slippage tolerance
```

## How It Works

### Scenario 1: First Liquidity Addition (Empty Pool)

When the pool is empty (`totalLiquidity == 0`):

```javascript
// You decide the initial ratio!
amountA = parseEther('1000')  // 1000 CLAW
amountB = parseEther('500')   // 500 TIGER
minAmountA = parseEther('1000') // Use exact amounts for first add
minAmountB = parseEther('500')  // No slippage in empty pool

// This sets initial price: 1 CLAW = 0.5 TIGER
```

**Example:**
```javascript
await tokenSwap.addLiquidity(
    parseEther('1000'),  // amountA: 1000 CLAW
    parseEther('500'),   // amountB: 500 TIGER
    parseEther('1000'),  // minAmountA: 1000 CLAW (exact)
    parseEther('500')    // minAmountB: 500 TIGER (exact)
)
```

### Scenario 2: Adding to Existing Pool

When the pool has liquidity, the contract **automatically adjusts** amounts to maintain the current price ratio.

**Current pool state:**
- Reserve A: 1000 CLAW
- Reserve B: 500 TIGER
- Ratio: 1 CLAW = 0.5 TIGER (or 2:1)

**Your input:**
```javascript
amountA = parseEther('200')  // Want to add 200 CLAW
amountB = parseEther('100')  // Want to add 100 TIGER
```

**What happens:**
The contract calculates the optimal amounts to maintain the 2:1 ratio:
- It will use: 200 CLAW and 100 TIGER (perfect ratio!)
- OR adjust to closest valid amounts

**With slippage protection:**
```javascript
minAmountA = parseEther('190')  // Accept down to 190 CLAW (5% slippage)
minAmountB = parseEther('95')   // Accept down to 95 TIGER (5% slippage)
```

## Real-World Examples

### Example 1: First Liquidity Provider

```javascript
// Step 1: Approve tokens
await clawToken.approve(tokenSwapAddress, parseEther('10000'))
await tigerToken.approve(tokenSwapAddress, parseEther('5000'))

// Step 2: Add initial liquidity
await tokenSwap.addLiquidity(
    parseEther('10000'),  // amountA: 10,000 CLAW
    parseEther('5000'),   // amountB: 5,000 TIGER
    parseEther('10000'),  // minAmountA: 10,000 CLAW (exact for first time)
    parseEther('5000')    // minAmountB: 5,000 TIGER (exact for first time)
)

// Sets initial price: 1 CLAW = 0.5 TIGER
// You get liquidity tokens representing your share
```

### Example 2: Adding to Existing Pool (Conservative - 1% Slippage)

**Current pool:** 10,000 CLAW : 5,000 TIGER (2:1 ratio)

```javascript
// Step 1: Decide how much to add
const desiredClawAmount = parseEther('1000')  // 1,000 CLAW
const desiredTigerAmount = parseEther('500')  // 500 TIGER

// Step 2: Calculate minimums (1% slippage tolerance)
const minClaw = desiredClawAmount * 99n / 100n   // 990 CLAW
const minTiger = desiredTigerAmount * 99n / 100n // 495 TIGER

// Step 3: Approve
await clawToken.approve(tokenSwapAddress, desiredClawAmount)
await tigerToken.approve(tokenSwapAddress, desiredTigerAmount)

// Step 4: Add liquidity
await tokenSwap.addLiquidity(
    desiredClawAmount,  // amountA: 1,000 CLAW
    desiredTigerAmount, // amountB: 500 TIGER
    minClaw,            // minAmountA: 990 CLAW
    minTiger            // minAmountB: 495 TIGER
)
```

### Example 3: Adding to Existing Pool (Flexible - 5% Slippage)

```javascript
const desiredClaw = parseEther('2000')   // 2,000 CLAW
const desiredTiger = parseEther('1000')  // 1,000 TIGER

// 5% slippage tolerance
const minClaw = desiredClaw * 95n / 100n    // 1,900 CLAW
const minTiger = desiredTiger * 95n / 100n  // 950 TIGER

await clawToken.approve(tokenSwapAddress, desiredClaw)
await tigerToken.approve(tokenSwapAddress, desiredTiger)

await tokenSwap.addLiquidity(
    desiredClaw,   // amountA: 2,000 CLAW
    desiredTiger,  // amountB: 1,000 TIGER
    minClaw,       // minAmountA: 1,900 CLAW (5% slippage OK)
    minTiger       // minAmountB: 950 TIGER (5% slippage OK)
)
```

### Example 4: Wrong Ratio - Let Contract Adjust

**Current pool:** 10,000 CLAW : 5,000 TIGER (2:1 ratio)

```javascript
// You provide wrong ratio (3:1 instead of 2:1)
const desiredClaw = parseEther('3000')   // 3,000 CLAW
const desiredTiger = parseEther('1000')  // 1,000 TIGER (wrong ratio!)

// Contract will adjust to use:
// - Either: 2,000 CLAW and 1,000 TIGER (adjusts A down)
// - Or: 3,000 CLAW and 1,500 TIGER (adjusts B up)

// Set minimums to allow adjustment
const minClaw = parseEther('2850')   // Accept down to 2,850 CLAW
const minTiger = parseEther('950')   // Accept down to 950 TIGER

await tokenSwap.addLiquidity(
    desiredClaw,   // amountA: 3,000 CLAW (max you provide)
    desiredTiger,  // amountB: 1,000 TIGER (max you provide)
    minClaw,       // minAmountA: 2,850 CLAW (5% slippage)
    minTiger       // minAmountB: 950 TIGER (5% slippage)
)

// Contract uses optimal amounts within your limits
```

## Quick Reference Table

| Scenario | amountA | amountB | minAmountA | minAmountB | Notes |
|----------|---------|---------|------------|------------|-------|
| **First Liquidity** | Your choice | Your choice | Same as amountA | Same as amountB | Sets initial price |
| **Conservative (1%)** | Desired amount | Desired amount | 99% of amountA | 99% of amountB | Low slippage tolerance |
| **Normal (2-3%)** | Desired amount | Desired amount | 97-98% of amountA | 97-98% of amountB | Balanced |
| **Flexible (5%)** | Desired amount | Desired amount | 95% of amountA | 95% of amountB | High slippage tolerance |
| **Very Flexible (10%)** | Desired amount | Desired amount | 90% of amountA | 90% of amountB | Very high tolerance |

## Common Mistakes to Avoid

### ❌ Mistake 1: Setting minimums higher than desired amounts
```javascript
// WRONG!
await tokenSwap.addLiquidity(
    parseEther('1000'),  // amountA
    parseEther('500'),   // amountB
    parseEther('1100'),  // minAmountA (higher than amountA!) ❌
    parseEther('550')    // minAmountB (higher than amountB!) ❌
)
```

### ❌ Mistake 2: Setting minimums to 0
```javascript
// RISKY!
await tokenSwap.addLiquidity(
    parseEther('1000'),  // amountA
    parseEther('500'),   // amountB
    0,                   // minAmountA (no protection!) ⚠️
    0                    // minAmountB (no protection!) ⚠️
)
// You might get very different amounts than expected!
```

### ❌ Mistake 3: Not approving enough tokens
```javascript
// WRONG!
await clawToken.approve(tokenSwapAddress, parseEther('900')) // Only 900
await tokenSwap.addLiquidity(
    parseEther('1000'),  // Needs 1000 CLAW but only 900 approved! ❌
    parseEther('500'),
    parseEther('950'),
    parseEther('475')
)
```

### ✅ Correct Way
```javascript
// Approve enough or use exact amounts
await clawToken.approve(tokenSwapAddress, parseEther('1000'))
await tigerToken.approve(tokenSwapAddress, parseEther('500'))

// Add with reasonable slippage
await tokenSwap.addLiquidity(
    parseEther('1000'),   // amountA
    parseEther('500'),    // amountB
    parseEther('950'),    // minAmountA (5% slippage)
    parseEther('475')     // minAmountB (5% slippage)
)
```

## TypeScript Helper Functions

```typescript
import { parseEther } from 'viem'

// Calculate minimum with slippage
function calculateMinimumAmount(
  amount: bigint,
  slippagePercent: number = 5 // Default 5%
): bigint {
  const slippageBps = BigInt(10000 - slippagePercent * 100)
  return (amount * slippageBps) / 10000n
}

// Example usage
const desiredClaw = parseEther('1000')
const desiredTiger = parseEther('500')

const minClaw = calculateMinimumAmount(desiredClaw, 5)    // 5% slippage
const minTiger = calculateMinimumAmount(desiredTiger, 5)  // 5% slippage

await tokenSwap.addLiquidity(
  desiredClaw,
  desiredTiger,
  minClaw,
  minTiger
)
```

## Frontend Integration Example

```typescript
// React component example
function AddLiquidityForm() {
  const [clawAmount, setClawAmount] = useState('')
  const [tigerAmount, setTigerAmount] = useState('')
  const [slippage, setSlippage] = useState(5) // 5% default

  const handleAddLiquidity = async () => {
    const amountA = parseEther(clawAmount)
    const amountB = parseEther(tigerAmount)
    
    // Calculate minimums with slippage
    const minA = (amountA * BigInt(10000 - slippage * 100)) / 10000n
    const minB = (amountB * BigInt(10000 - slippage * 100)) / 10000n

    // Approve tokens first
    await clawToken.approve(tokenSwapAddress, amountA)
    await tigerToken.approve(tokenSwapAddress, amountB)

    // Add liquidity
    await tokenSwap.addLiquidity(amountA, amountB, minA, minB)
  }

  return (
    <div>
      <input 
        value={clawAmount} 
        onChange={e => setClawAmount(e.target.value)}
        placeholder="CLAW amount"
      />
      <input 
        value={tigerAmount} 
        onChange={e => setTigerAmount(e.target.value)}
        placeholder="TIGER amount"
      />
      <select value={slippage} onChange={e => setSlippage(Number(e.target.value))}>
        <option value={1}>1% Slippage</option>
        <option value={3}>3% Slippage</option>
        <option value={5}>5% Slippage</option>
        <option value={10}>10% Slippage</option>
      </select>
      <button onClick={handleAddLiquidity}>Add Liquidity</button>
    </div>
  )
}
```

## Summary

**Quick Answer:**
- **amountA / amountB**: The max amounts you want to add
- **minAmountA / minAmountB**: The minimum you'll accept (usually 95-99% of max)

**Recommended Values:**
- First time adding: Use exact amounts for both (no slippage needed)
- Adding to existing pool: Use 3-5% slippage (95-97% of desired amounts)
- High volatility: Use 5-10% slippage

**Formula:**
```
minAmount = desiredAmount × (100 - slippagePercent) / 100
```

Example with 5% slippage:
```javascript
minAmountA = amountA * 95n / 100n
minAmountB = amountB * 95n / 100n
```
