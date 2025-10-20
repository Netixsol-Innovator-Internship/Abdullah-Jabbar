# NFT Buy/Sell Implementation - Quick Reference

## What Was Implemented

### Portfolio Page Updates
✅ **Listing Feature**: Users can list their owned NFTs for sale
- Click "📤 List for Sale" button
- Enter price in CLAW tokens
- Confirm with "✅ Confirm" button
- Cancel anytime with "❌ Cancel"

✅ **Listing Status Display**:
- Shows "📋 Listed - X.XX CLAW" for listed NFTs
- Shows "✅ Owned" for unlisted NFTs
- Button disabled for already-listed NFTs

### Marketplace Page Updates
✅ **Owner Validation**:
- Owners cannot buy their own NFTs
- Shows "✅ You own this" badge instead of buy button

✅ **Dual Purchase Methods**:
- Direct Purchase: "🛒 Buy NFT" for marketplace listings
- Listed Purchase: "🛒 Buy Listed NFT" for secondary market

✅ **Proper Price Display**:
- Direct sales: Show token-adjusted price
- Listed NFTs: Show owner's asking price in CLAW
- Updates when payment token changes

## Code Changes Made

### 1. Portfolio Page (`/frontend/src/app/portfolio/page.tsx`)

**New Imports:**
```tsx
import { NFT_MARKETPLACE_ABI } from "@/config/contract";
```

**New State Variables:**
```tsx
const [listingPrice, setListingPrice] = useState("");
const [selectedNFTToList, setSelectedNFTToList] = useState<number | null>(null);
const [listing, setListing] = useState(false);
```

**Updated NFT Interface:**
```tsx
interface NFT {
  tokenId: number;
  tokenURI?: string;
  metadata?: NFTMetadata;
  metadataLoading?: boolean;
  isListed?: boolean;        // NEW
  listingPrice?: string;     // NEW
}
```

**New Function:**
```tsx
handleListNFT(tokenId: number)
```
- Validates price input
- Approves NFT for marketplace
- Lists NFT with specified price
- Handles errors and shows alerts

**Updated Function:**
```tsx
loadNFTs()
```
- Now checks listing status from marketplace contract
- Fetches listing price and seller info
- Stores in NFT object

**New UI Elements:**
```tsx
// Listing form (appears when clicking list button)
<div className="listing-form">
  <input type="number" placeholder="Price in CLAW" />
  <button>✅ Confirm</button>
  <button>❌ Cancel</button>
</div>

// Listing badge
<div className="listing-badge">
  📋 Listed - {listingPrice} CLAW
</div>

// List button
<button className="btn-list">
  📤 List for Sale
</button>
```

### 2. Marketplace Page (`/frontend/src/app/marketplace/page.tsx`)

**Updated NFT Interface:**
```tsx
interface NFT {
  tokenId: number;
  owner: string;
  tokenURI: string;
  isAvailable: boolean;
  isListed: boolean;         // NEW
  listingPrice?: string;     // NEW
  listedBy?: string;         // NEW
  metadata?: NFTMetadata;
  metadataLoading?: boolean;
}
```

**Updated Function:**
```tsx
loadMarketplace()
```
- Checks if each NFT is listed in marketplace
- Fetches listing price and seller
- Stores listing info in NFT object

**Enhanced Function:**
```tsx
handleBuyNFT(tokenId: number)
```
- Added owner validation (prevents self-purchase)
- Detects if NFT is listed or direct sale
- Calls appropriate purchase method:
  - `buyListedNFT()` for secondary market
  - `buyNFTWithPlatformToken()` for direct token purchases
  - `buyNFTWithToken()` for multi-token purchases

**Updated Price Display:**
```tsx
// For listed NFTs
{nft.isListed ? (
  <div className="metadata-item">
    <span className="label">Listed Price:</span>
    <span className="value price">{nft.listingPrice} CLAW</span>
  </div>
) : nft.isAvailable ? (
  // Show marketplace price with selected token
)}
```

**Updated Button Logic:**
```tsx
{nft.isAvailable && nft.owner !== account ? (
  <button>🛒 Buy NFT</button>
) : nft.isListed && nft.owner !== account ? (
  <button>🛒 Buy Listed NFT</button>
) : nft.owner === account ? (
  <div>✅ You own this</div>
) : (
  <div>❌ Not Available</div>
)}
```

## How It Works

### Listing an NFT
1. User goes to Portfolio
2. Clicks "📤 List for Sale" on owned NFT
3. Enters price and clicks "✅ Confirm"
4. Contract calls:
   - `approve(marketplace, tokenId)` - Authorize marketplace
   - `listNFT(tokenId, price)` - Create listing
5. NFT transferred to marketplace custody
6. Display updates to show listing status

### Buying a Listed NFT
1. User sees NFT on Marketplace with "📋 Listed - Price" indicator
2. Selects payment token (if desired)
3. Clicks "🛒 Buy Listed NFT"
4. Contract calls:
   - `approve(marketplace, amount)` - Authorize payment
   - `buyListedNFT(tokenId, paymentToken)` - Purchase
5. NFT transferred to buyer
6. Payment transferred to seller
7. Listing marked as inactive

### Buying Direct (Marketplace)
1. User sees NFT with dynamic price based on payment token
2. Selects payment token
3. Clicks "🛒 Buy NFT"
4. Contract calls:
   - `approve(marketplace, amount)` - Authorize payment
   - `buyNFTWithToken(tokenId, token)` or `buyNFTWithPlatformToken(tokenId)`
5. NFT transferred to buyer
6. Marketplace keeps profits

## Key Features

✅ **Dual Market**: Both direct sales and secondary market listings  
✅ **Owner Protection**: Can't buy your own NFT  
✅ **Clear Pricing**: Different display for direct vs listed  
✅ **User-Friendly**: Intuitive buttons and status badges  
✅ **Error Handling**: Clear alerts for failed operations  
✅ **Real-time Updates**: Data refreshes after transactions  

## Testing Scenarios

1. **List NFT**
   - Navigate to Portfolio
   - Click "📤 List for Sale"
   - Enter valid price
   - Confirm transaction
   - Verify listing appears with price

2. **Buy Listed NFT**
   - Navigate to Marketplace
   - Find NFT with "📋 Listed - Price" badge
   - Click "🛒 Buy Listed NFT"
   - Select payment token
   - Confirm purchase
   - Verify NFT transferred

3. **Prevent Self-Purchase**
   - List your own NFT
   - Try to buy it
   - Should show "✅ You own this" instead of buy button
   - Should fail if somehow called

4. **Price Updates**
   - View marketplace with payment token A
   - Change to payment token B
   - Verify prices recalculate
   - Verify listed prices stay same (CLAW)

## Smart Contract Assumptions

The implementation assumes these methods exist on the marketplace contract:

```solidity
// Read listing info
function listings(uint256 tokenId) returns (
  uint256 tokenId,
  address seller,
  uint256 price,
  bool isActive
)

// List NFT (must own it)
function listNFT(uint256 tokenId, uint256 price)

// Buy listed NFT
function buyListedNFT(uint256 tokenId, address paymentToken)

// Direct marketplace purchases (existing)
function buyNFTWithPlatformToken(uint256 tokenId)
function buyNFTWithToken(uint256 tokenId, address paymentToken)
```

## Deployment Notes

1. **Deploy Order**:
   - Deploy NFTCollection contract first
   - Deploy NFTMarketplace with NFTCollection address
   - Deploy TestToken contracts
   - Deploy DEX contract (if needed)

2. **Approvals Needed**:
   - Users must approve tokens before buying
   - Users must approve NFTs before listing
   - Marketplace must be approved spender

3. **Gas Considerations**:
   - Listing = ~100k gas (approve) + ~80k gas (list)
   - Buying = ~100k gas (approve) + ~150k gas (transfer)
   - Listed purchase = ~200k gas (swap + transfer if needed)

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "You cannot buy your own NFT!" | Check that buyer !== owner check is in contract |
| Listed NFT not showing price | Verify listing status fetch is working |
| Wrong price displayed | Check selectedPayment token is correct |
| Approve fails | Ensure contract is approved spender |
| "Not NFT owner" error | Verify wallet owns the NFT |

