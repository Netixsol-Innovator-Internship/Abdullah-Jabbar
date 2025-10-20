# NFT Buy/Sell Logic Implementation

## Overview
This document describes the complete buy/sell logic implementation for NFTs in the marketplace, including listing functionality, validation, and proper UI updates.

## Features Implemented

### 1. **Portfolio Page - NFT Listing (Sell)**

#### Functionality:
- Users can list their owned NFTs for sale on the marketplace
- Users can set a custom price in CLAW tokens
- Proper validation to prevent invalid prices
- Real-time listing status display

#### Components Added:
- **Listing Form**: Interactive form appears when user clicks "List for Sale"
  - Price input field (number input with min/step validation)
  - Confirm button to execute listing
  - Cancel button to dismiss the form
- **Listing Badge**: Shows when an NFT is already listed with its price
- **List Button**: Allows users to list unlisted NFTs

#### Key Functions:
```tsx
handleListNFT(tokenId: number)
```
- Takes NFT token ID and the price from input
- Approves the NFT for marketplace contract
- Calls `marketplaceContract.listNFT(tokenId, priceInWei)`
- Refreshes NFT list after successful listing
- Shows success/error alerts

#### User Flow:
1. User navigates to Portfolio
2. Clicks "📤 List for Sale" button on owned NFT
3. Listing form appears with price input
4. User enters price and clicks "✅ Confirm"
5. MetaMask prompts for two transactions:
   - Approval transaction (once)
   - Listing transaction
6. Upon success, listing is displayed and button is disabled

---

### 2. **Marketplace Page - Validations & Display**

#### Validations Added:

1. **Owner Validation**
   - Prevents NFT owner from buying their own NFT
   - Button text changes based on NFT status
   - Visual feedback through badge system

2. **Listed NFT Detection**
   - System detects if NFT is listed by owner
   - Tracks listing price separately from marketplace default price
   - Shows proper "Listed by" information

#### Button States & Text:

| Status | Button Text | Action | Disabled |
|--------|------------|--------|----------|
| Own NFT | "✅ You own this" (badge) | None | - |
| Available (Direct Sale) | "🛒 Buy NFT" | Buy from marketplace | If buying or contracts unavailable |
| Listed NFT (Other) | "🛒 Buy Listed NFT" | Buy from secondary market | If buying or contracts unavailable |
| Not Available | "❌ Not Available" (badge) | None | - |

#### Price Display:
- **Direct Sale (Marketplace)**: Shows price based on selected payment token
  - Recalculates when payment token changes
  - Format: `Amount CLAW/TUSD/TBTC`

- **Listed NFT**: Shows owner's listing price in CLAW
  - Format: `Listed Price: X.XX CLAW`
  - Always displayed in platform token (CLAW)

#### NFT Data Structure Updated:
```tsx
interface NFT {
  tokenId: number;
  owner: string;
  tokenURI: string;
  isAvailable: boolean;
  isListed: boolean;           // NEW
  listingPrice?: string;       // NEW (in CLAW)
  listedBy?: string;           // NEW (seller address)
  metadata?: NFTMetadata;
  metadataLoading?: boolean;
}
```

---

### 3. **Buy Logic Enhancement**

#### Updated `handleBuyNFT` Function:

```tsx
handleBuyNFT(tokenId: number)
```

**Features:**
- Validates that buyer is not the owner
- Detects if NFT is listed or direct marketplace sale
- Uses appropriate purchase method:
  - Listed NFT: `buyListedNFT(tokenId, paymentToken)`
  - Direct Sale: `buyNFTWithPlatformToken()` or `buyNFTWithToken()`
- Handles payment token approval
- Shows appropriate success/error messages

**Payment Flow:**
1. User selects payment token from dropdown
2. Clicks buy button (appropriate based on NFT type)
3. System calculates required payment amount
4. Approves tokens with marketplace contract
5. Executes purchase transaction
6. Updates marketplace data
7. Shows success alert

---

## Smart Contract Integration

### Required Contract Methods:

#### NFTMarketplace Contract:
```solidity
// View existing listing
listings(uint256 tokenId) -> (tokenId, seller, price, isActive)

// List NFT (owner function)
listNFT(uint256 tokenId, uint256 price)

// Buy listed NFT (secondary market)
buyListedNFT(uint256 tokenId, address paymentToken)

// Direct marketplace purchases
buyNFTWithPlatformToken(uint256 tokenId)
buyNFTWithToken(uint256 tokenId, address paymentToken)
```

#### NFTCollection Contract:
```solidity
// Get user's NFTs
tokensOfOwner(address owner) -> uint256[]

// Approve for listing
approve(address to, uint256 tokenId)

// Get metadata URI
tokenURI(uint256 tokenId) -> string
```

---

## File Changes Summary

### `/frontend/src/app/portfolio/page.tsx`
- Added listing state management (listingPrice, selectedNFTToList, listing)
- Added `handleListNFT()` function for listing logic
- Updated `loadNFTs()` to fetch listing status from marketplace
- Enhanced NFT display with listing form and status badges
- Added list button and list action UI

### `/frontend/src/app/marketplace/page.tsx`
- Updated NFT interface with listing properties
- Enhanced `loadMarketplace()` to detect listed NFTs
- Updated price display logic to show proper prices
- Enhanced `handleBuyNFT()` with owner validation and listing support
- Improved button text and status indicators
- Added metadata display for listing seller

---

## User Experience Improvements

### Portfolio Page:
✅ Clear call-to-action: "📤 List for Sale" button  
✅ Inline price input for ease of use  
✅ Confirmation workflow with cancel option  
✅ Real-time status badges showing "📋 Listed - Price"  
✅ Prevent listing of already-listed NFTs  

### Marketplace Page:
✅ Owner cannot buy own NFT (prevented + badge)  
✅ Clear button text indicating action type  
✅ Price display matches NFT type (direct vs listed)  
✅ Proper validation with user-friendly error messages  
✅ Distinction between listed and direct-sale NFTs  

---

## Error Handling

All functions include comprehensive error handling:
- Contract call failures
- Validation errors (invalid price, owner check)
- Transaction failures with user-friendly messages
- Metadata loading failures
- Network/connection issues

Error alerts display:
- The specific error message
- User guidance on next steps
- Clear problem identification

---

## Transaction Flow Diagrams

### Listing an NFT:
```
User → Click "List for Sale" 
   → Enter Price 
   → Confirm 
   → Approve NFT 
   → List on Marketplace 
   → Refresh Display
```

### Buying a Listed NFT:
```
User → Select Payment Token 
   → Click "Buy Listed NFT" 
   → Approve Tokens 
   → Execute buyListedNFT() 
   → Receive NFT 
   → Seller Receives Payment 
   → Refresh Display
```

### Buying Direct (Marketplace):
```
User → Select Payment Token 
   → Click "Buy NFT" 
   → Approve Tokens 
   → Execute buyNFTWithToken() 
   → Receive NFT 
   → Refresh Display
```

---

## Testing Checklist

- [ ] User can list NFT with valid price
- [ ] User cannot list NFT with invalid price (0 or negative)
- [ ] Listed NFT shows correct price on portfolio page
- [ ] Listed NFT appears on marketplace with owner's price
- [ ] Owner cannot buy their own NFT
- [ ] Other users can buy listed NFT
- [ ] Price display updates when payment token changes
- [ ] Both direct and listed NFT purchases work
- [ ] Metadata loads correctly for all NFTs
- [ ] Error messages appear for failed transactions
- [ ] Already-listed NFTs cannot be listed again
- [ ] List button is disabled when appropriate

---

## Future Enhancements

1. **Unlist Functionality**: Allow owners to remove listings
2. **Price History**: Track price changes over time
3. **Offer System**: Allow other users to make offers on NFTs
4. **Bulk Listing**: List multiple NFTs at once
5. **Search & Filter**: Filter by price, rarity, owner
6. **Auction Mechanism**: Timed auctions with bidding
7. **Royalties**: Implement creator royalties on sales
