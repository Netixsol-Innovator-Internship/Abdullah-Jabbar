# Side-by-Side Comparison: Old vs New Contracts

## Contract Names

| Aspect | Old Version | New Version |
|--------|-------------|-------------|
| Claw Contract | `ClawToken` | `Claw` |
| Tiger Contract | `TigerToken` | `Tiger` |
| Swap Contract | `SimpleSwap` | `TokenSwap` |
| Claw Files | 3 files (ClawToken.sol, ClawTokenLogic.sol, ClawTokenStorage.sol) | 1 file (ClawToken_v2.sol) |
| Tiger Files | 1 file | 1 file (TigerToken_v2.sol) |
| Total LOC (Claw) | ~500+ lines | ~250 lines |
| Total LOC (Tiger) | ~200 lines | ~250 lines |

## Token Names & Symbols

| Token | Old Name | New Name | Old Symbol | New Symbol |
|-------|----------|----------|------------|------------|
| Claw | "Claw" | "Claw" | "CLAW" | "CLAW" |
| Tiger | "Tiger Token" | "Tiger" | "TIGER" | "TIGER" |

## Feature Parity Matrix

| Feature | Old Claw | New Claw | Old Tiger | New Tiger | Notes |
|---------|----------|----------|-----------|-----------|-------|
| **Core ERC20** | ✅ | ✅ | ✅ | ✅ | Standard transfer, approve, etc. |
| **Burnable** | ✅ | ✅ | ✅ | ✅ | Token holders can burn |
| **Pausable** | ✅ | ✅ | ❌ | ✅ | Emergency pause functionality |
| **Minting** | ✅ | ✅ | ✅ | ✅ | Owner can mint new tokens |
| **Blacklist** | ✅ | ✅ | ❌ | ✅ | Now aligned! |
| **Transfer Tax** | ✅ | ✅ | ❌ | ✅ | Now aligned! |
| **Tax Receiver** | ✅ | ✅ | ❌ | ✅ | Now aligned! |
| **Max Transaction** | ✅ | ✅ | ❌ | ✅ | Now aligned! |
| **Tax Exclusions** | ✅ | ✅ | ❌ | ✅ | Now aligned! |
| **Max TX Exclusions** | ✅ | ✅ | ❌ | ✅ | Now aligned! |
| **Reentrancy Guard** | ✅ | ✅ | ❌ | ✅ | Now aligned! |
| **Custom Errors** | ✅ | ✅ | ✅ | ✅ | Gas efficient errors |
| **Detailed Events** | ✅ | ✅ | ✅ | ✅ | For frontend tracking |

## Removed Features (Simplified)

| Feature | Old Claw | New Claw | Reason for Removal |
|---------|----------|----------|-------------------|
| **Snapshots** | ✅ | ❌ | Too complex for basic DEX |
| **24h Timelock** | ✅ | ❌ | Over-engineered for MVP |
| **Batch Mint** | ✅ | ❌ | Single mint sufficient |
| **Batch Blacklist** | ✅ | ❌ | Single blacklist sufficient |
| **ERC20Permit** | ✅ | ❌ | Not needed for basic DEX |
| **Ownable2Step** | ✅ | ❌ | Standard Ownable is fine |
| **Permit Replay Protection** | ✅ | ❌ | No permit = no need |
| **Emergency Rescue** | ✅ | ❌ | Can be added later if needed |
| **Pending Changes** | ✅ | ❌ | Direct updates are fine |

## Function Alignment

### ✅ Identical Functions in Both New Tokens

Both `Claw` and `Tiger` now have these exact functions with identical signatures:

| Function Category | Function Name | Parameters | Access |
|------------------|---------------|------------|--------|
| **View Functions** | `name()` | - | Public |
| | `symbol()` | - | Public |
| | `decimals()` | - | Public |
| | `totalSupply()` | - | Public |
| | `balanceOf(address)` | account | Public |
| | `allowance(address, address)` | owner, spender | Public |
| | `remainingSupply()` | - | Public |
| | `hasTokens(address)` | account | Public |
| | `getTokenInfo()` | - | Public |
| **State Variables** | `MAX_SUPPLY` | - | Public Constant |
| | `MAX_TAX_RATE` | - | Public Constant |
| | `taxRate` | - | Public |
| | `taxReceiver` | - | Public |
| | `maxTransactionAmount` | - | Public |
| | `blacklisted(address)` | account | Public |
| | `excludedFromTax(address)` | account | Public |
| | `excludedFromMaxTransaction(address)` | account | Public |
| **User Functions** | `transfer(address, uint256)` | to, amount | Public |
| | `approve(address, uint256)` | spender, amount | Public |
| | `transferFrom(address, address, uint256)` | from, to, amount | Public |
| | `burn(uint256)` | amount | Public |
| | `burnFrom(address, uint256)` | account, amount | Public |
| **Owner Functions** | `mint(address, uint256)` | to, amount | Owner |
| | `pause()` | - | Owner |
| | `unpause()` | - | Owner |
| | `addToBlacklist(address)` | account | Owner |
| | `removeFromBlacklist(address)` | account | Owner |
| | `setTaxRate(uint256)` | newRate | Owner |
| | `setTaxReceiver(address)` | newReceiver | Owner |
| | `setMaxTransactionAmount(uint256)` | newAmount | Owner |
| | `setExcludedFromTax(address, bool)` | account, excluded | Owner |
| | `setExcludedFromMaxTransaction(address, bool)` | account, excluded | Owner |

## Events Comparison

### ✅ Identical Events in Both New Tokens

| Event | Parameters | Triggered By |
|-------|-----------|--------------|
| `Transfer` | from, to, value | Token transfers |
| `Approval` | owner, spender, value | Token approvals |
| `Blacklisted` | account | Adding to blacklist |
| `UnBlacklisted` | account | Removing from blacklist |
| `TaxRateUpdated` | oldRate, newRate | Tax rate change |
| `TaxReceiverUpdated` | oldReceiver, newReceiver | Tax receiver change |
| `MaxTransactionAmountUpdated` | oldAmount, newAmount | Max TX change |
| `TokensMinted` | to, amount | Minting tokens |
| `TaxCollected` | from, to, amount | Tax collection on transfer |
| `Paused` | account | Pausing contract |
| `Unpaused` | account | Unpausing contract |

## Error Comparison

### ✅ Identical Errors in Both New Tokens

| Error | Parameters | When Thrown |
|-------|-----------|-------------|
| `AccountBlacklisted` | account | Transfer to/from blacklisted address |
| `AccountNotBlacklisted` | account | Trying to remove non-blacklisted address |
| `CannotBlacklistOwner` | - | Trying to blacklist owner |
| `ExceedsMaxTransactionAmount` | amount, maxAmount | Transfer exceeds limit |
| `InvalidTaxRate` | rate | Tax rate > 10% |
| `InvalidAddress` | - | Zero address used |
| `InvalidAmount` | - | Zero amount used |
| `MaxSupplyExceeded` | - | Minting would exceed max supply |

## TokenSwap Improvements

| Feature | Old (SimpleSwap) | New (TokenSwap) | Improvement |
|---------|-----------------|-----------------|-------------|
| Contract Name | `SimpleSwap` | `TokenSwap` | Clearer naming |
| Token Storage | Mutable | Immutable | Gas savings |
| Slippage Protection | Only on swaps | On swaps + liquidity | Better protection |
| User Liquidity Info | ❌ | ✅ `getUserLiquidity()` | Better UX |
| Price Impact Calc | ✅ | ✅ Enhanced | More accurate |
| Pool Info | Basic | Comprehensive | More details |
| Error Handling | require() | Custom errors | Gas efficient |
| Documentation | Basic | Detailed | Better DX |

## Constructor Comparison

### Claw Token

```solidity
// Old
constructor(uint256 initialSupply)
  ERC20("Claw", "CLAW") 
  ERC20Permit("Claw") 
  Ownable(msg.sender)

// New  
constructor(uint256 initialSupply)
  ERC20("Claw", "CLAW")
  Ownable(msg.sender)
```

### Tiger Token

```solidity
// Old
constructor(uint256 initialSupply)
  ERC20("Tiger Token", "TIGER")
  Ownable(msg.sender)

// New
constructor(uint256 initialSupply)
  ERC20("Tiger", "TIGER")
  Ownable(msg.sender)
```

### TokenSwap

```solidity
// Old
constructor(address _tokenA, address _tokenB)
  Ownable(msg.sender)
  
// New (immutable)
constructor(address _tokenA, address _tokenB)
  Ownable(msg.sender)
  
// tokenA and tokenB are now immutable
```

## Gas Comparison Estimates

| Operation | Old Claw | New Claw | Savings |
|-----------|----------|----------|---------|
| Deployment | ~2.5M gas | ~1.8M gas | ~28% |
| Transfer (no tax) | ~65k gas | ~55k gas | ~15% |
| Transfer (with tax) | ~95k gas | ~85k gas | ~11% |
| Mint | ~70k gas | ~60k gas | ~14% |
| Pause/Unpause | ~45k gas | ~45k gas | ~0% |
| Blacklist | ~50k gas | ~50k gas | ~0% |

*Note: These are estimates. Actual gas costs vary by network and conditions.*

## Storage Slot Comparison

### Claw Token

| Variable | Old Slot | New Slot | Type |
|----------|----------|----------|------|
| taxRate | Multiple files | Direct | uint256 |
| taxReceiver | Multiple files | Direct | address |
| maxTransactionAmount | Multiple files | Direct | uint256 |
| blacklisted | Inherited | Direct | mapping |
| excludedFromTax | Inherited | Direct | mapping |
| excludedFromMaxTransaction | Inherited | Direct | mapping |

## Code Organization

### Old Claw Structure
```
ClawToken.sol
├── Imports OpenZeppelin contracts
├── Imports ClawTokenLogic
└── Implements virtual functions

ClawTokenLogic.sol
├── Imports ClawTokenStorage
├── Imports Ownable2Step
├── Implements business logic
└── Virtual function definitions

ClawTokenStorage.sol
├── Constants
├── State variables
├── Structs
├── Mappings
└── Events/Errors
```

### New Claw Structure
```
Claw.sol (ClawToken_v2.sol)
├── Imports OpenZeppelin contracts
├── All constants
├── All state variables
├── All mappings
├── All events/errors
└── All functions
   └── Organized by category
```

## Summary of Alignment

### Before Alignment
- ❌ Different contract names (`ClawToken` vs `TigerToken`)
- ❌ Different token names ("Claw" vs "Tiger Token")
- ❌ Different features (Claw had many, Tiger was basic)
- ❌ Different file structures (3 files vs 1 file)
- ❌ Different function sets
- ❌ Hard to create reusable frontend components
- ❌ Confusing for developers

### After Alignment
- ✅ Consistent contract names (`Claw` and `Tiger`)
- ✅ Consistent token names ("Claw" and "Tiger")
- ✅ **Identical feature sets**
- ✅ **Identical file structures** (both single file)
- ✅ **100% matching function signatures**
- ✅ **Reusable frontend components**
- ✅ **Easy to understand and maintain**
- ✅ **Simplified deployment**
- ✅ **Better developer experience**

## Migration Checklist

- [ ] Review old contracts and identify used features
- [ ] Test new contracts on local network
- [ ] Test new contracts on testnet
- [ ] Update deployment scripts
- [ ] Deploy new contracts
- [ ] Update frontend contract addresses
- [ ] Update frontend ABIs
- [ ] Test frontend integration
- [ ] Migrate liquidity (if upgrading existing DEX)
- [ ] Verify contracts on block explorer
- [ ] Update documentation
- [ ] Announce to users

## Recommendation

**Use the new aligned contracts** (`ClawToken_v2.sol` and `TigerToken_v2.sol`) for all new deployments. The alignment provides:

1. **50% code reduction** (Claw went from 500+ to 250 lines)
2. **100% feature parity** (Both tokens have identical capabilities)
3. **Easier maintenance** (One pattern to learn)
4. **Reusable components** (Same interface = shared code)
5. **Better UX** (Consistent behavior across both tokens)
