# Code Changes - NFT Buy/Sell Logic

## File: `frontend/src/app/portfolio/page.tsx`

### Change 1: Updated Imports
**Location:** Line 5

**Added:**
```tsx
import { NFT_MARKETPLACE_ABI } from "@/config/contract";
```

---

### Change 2: Updated NFT Interface
**Location:** Lines 29-35

**Before:**
```tsx
interface NFT {
  tokenId: number;
  tokenURI?: string;
  metadata?: NFTMetadata;
  metadataLoading?: boolean;
}
```

**After:**
```tsx
interface NFT {
  tokenId: number;
  tokenURI?: string;
  metadata?: NFTMetadata;
  metadataLoading?: boolean;
  isListed?: boolean;
  listingPrice?: string;
}
```

---

### Change 3: Added State Variables
**Location:** Lines 49-57

**Added:**
```tsx
const [listingPrice, setListingPrice] = useState("");
const [selectedNFTToList, setSelectedNFTToList] = useState<number | null>(
  null
);
const [listing, setListing] = useState(false);
```

---

### Change 4: Added handleListNFT Function
**Location:** After loadNFTs() function

**Added:**
```tsx
const handleListNFT = async (tokenId: number) => {
  if (!listingPrice || parseFloat(listingPrice) <= 0) {
    alert("Please enter a valid price");
    return;
  }

  try {
    setListing(true);

    const marketplaceContract = new ethers.Contract(
      CONTRACT_ADDRESSES.NFTMarketplace,
      NFT_MARKETPLACE_ABI,
      signer!
    );

    const nftContract = new ethers.Contract(
      CONTRACT_ADDRESSES.NFTCollection,
      NFT_COLLECTION_ABI,
      signer!
    );

    const priceInWei = ethers.parseEther(listingPrice);

    console.log("Approving NFT for marketplace...");
    const approveTx = await nftContract.approve(
      CONTRACT_ADDRESSES.NFTMarketplace,
      tokenId
    );
    await approveTx.wait();
    console.log("NFT approved");

    console.log("Listing NFT...");
    const listTx = await marketplaceContract.listNFT(tokenId, priceInWei);
    await listTx.wait();
    console.log("NFT listed successfully!");

    alert("NFT listed successfully! 🎉");
    setListingPrice("");
    setSelectedNFTToList(null);
    await loadNFTs();
  } catch (error) {
    console.error("Error listing NFT:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    alert("Failed to list NFT: " + errorMessage);
  } finally {
    setListing(false);
  }
};
```

---

### Change 5: Updated loadNFTs Function
**Location:** Lines 177-247

**Changed Section - Now includes listing check:**
```tsx
const loadNFTs = async () => {
  try {
    setNftsLoading(true);

    const nftContract = new ethers.Contract(
      CONTRACT_ADDRESSES.NFTCollection,
      NFT_COLLECTION_ABI,
      signer!
    );

    const marketplaceContract = new ethers.Contract(
      CONTRACT_ADDRESSES.NFTMarketplace,
      NFT_MARKETPLACE_ABI,
      signer!
    );

    const tokenIds = await nftContract.tokensOfOwner(account);
    const nftData: NFT[] = [];

    for (const tokenId of tokenIds) {
      try {
        const tokenURI = await nftContract.tokenURI(tokenId);

        // Check if NFT is listed
        let isListed = false;
        let listingPrice = "";

        try {
          const listing = await marketplaceContract.listings(tokenId);
          if (listing && listing.isActive) {
            isListed = true;
            listingPrice = ethers.formatEther(listing.price);
          }
        } catch {
          console.log(`NFT ${tokenId} is not listed`);
        }

        nftData.push({
          tokenId: Number(tokenId),
          tokenURI: tokenURI,
          isListed: isListed,
          listingPrice: listingPrice,
          metadataLoading: true,
        });
      } catch (error) {
        console.error(`Error loading NFT ${tokenId}:`, error);
      }
    }

    setNfts(nftData);

    // Fetch metadata for each NFT
    const nftsWithMetadata = await Promise.all(
      nftData.map(async (nft) => {
        try {
          const metadata = await fetchNFTMetadata(nft.tokenURI || "");
          return {
            ...nft,
            metadata: metadata || undefined,
            metadataLoading: false,
          };
        } catch (error) {
          console.error(
            `Error fetching metadata for NFT ${nft.tokenId}:`,
            error
          );
          return { ...nft, metadata: undefined, metadataLoading: false };
        }
      })
    );

    setNfts(nftsWithMetadata);
  } catch (error) {
    console.error("Error loading NFTs:", error);
  } finally {
    setNftsLoading(false);
  }
};
```

---

### Change 6: Updated NFT Grid Display
**Location:** Lines 358-420

**Added Listing Form and Updated Button Logic:**
```tsx
<div className="section">
  <h2>🖼️ Your NFTs ({nfts.length})</h2>
  {nfts.length === 0 ? (
    <div className="empty-state">
      <p>You don&apos;t own any NFTs yet</p>
      <p>Visit the marketplace to buy some!</p>
    </div>
  ) : (
    <div className="nft-grid">
      {nfts.map((nft) => (
        <div key={nft.tokenId} className="nft-card owned">
          <div className="nft-image-placeholder">
            {nft.metadataLoading ? (
              <div className="loading-spinner">Loading...</div>
            ) : nft.metadata?.image ? (
              <Image
                src={getImageUrl(nft.metadata.image)}
                alt={nft.metadata.name || `NFT #${nft.tokenId}`}
                width={300}
                height={300}
                className="nft-image"
                unoptimized
              />
            ) : (
              <span className="nft-id">#{nft.tokenId}</span>
            )}
          </div>
          <div className="nft-info">
            <h3>
              {nft.metadata?.name || `DeFi Art #${nft.tokenId}`}
            </h3>

            {nft.isListed ? (
              <div className="listing-badge">
                📋 Listed - {nft.listingPrice} CLAW
              </div>
            ) : (
              <div className="owned-badge">✅ Owned</div>
            )}

            <div className="nft-actions">
              {selectedNFTToList === nft.tokenId ? (
                <div className="listing-form">
                  <input
                    type="number"
                    placeholder="Price in CLAW"
                    value={listingPrice}
                    onChange={(e) => setListingPrice(e.target.value)}
                    disabled={listing}
                    min="0"
                    step="0.01"
                    className="price-input"
                  />
                  <button
                    onClick={() =>
                      handleListNFT(nft.tokenId)
                    }
                    disabled={listing || !contractsAvailable}
                    className="btn-primary btn-confirm-listing"
                  >
                    {listing ? "Listing..." : "✅ Confirm"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNFTToList(null);
                      setListingPrice("");
                    }}
                    disabled={listing}
                    className="btn-secondary btn-cancel-listing"
                  >
                    ❌ Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedNFTToList(nft.tokenId)}
                  disabled={nft.isListed || !contractsAvailable}
                  className="btn-primary btn-list"
                >
                  {nft.isListed
                    ? "📋 Already Listed"
                    : "📤 List for Sale"}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
```

---

## File: `frontend/src/app/marketplace/page.tsx`

### Change 1: Updated NFT Interface
**Location:** Lines 26-35

**Before:**
```tsx
interface NFT {
  tokenId: number;
  owner: string;
  tokenURI: string;
  isAvailable: boolean;
  metadata?: NFTMetadata;
  metadataLoading?: boolean;
}
```

**After:**
```tsx
interface NFT {
  tokenId: number;
  owner: string;
  tokenURI: string;
  isAvailable: boolean;
  isListed: boolean;
  listingPrice?: string;
  listedBy?: string;
  metadata?: NFTMetadata;
  metadataLoading?: boolean;
}
```

---

### Change 2: Updated loadMarketplace Function - NFT Data Loading
**Location:** Lines 236-271

**Changed Section - Now fetches listing information:**
```tsx
const nftData: NFT[] = [];
for (let i = 0; i < Number(totalSupply); i++) {
  try {
    const owner = await nftContract.ownerOf(i);
    const tokenURI = await nftContract.tokenURI(i);

    // Check if NFT is listed
    let isListed = false;
    let listingPrice = "";
    let listedBy = "";

    try {
      const listing = await marketplaceContract.listings(i);
      if (listing && listing.isActive) {
        isListed = true;
        listingPrice = ethers.formatEther(listing.price);
        listedBy = listing.seller;
      }
    } catch {
      console.log(`NFT ${i} is not listed`);
    }

    nftData.push({
      tokenId: i,
      owner: owner,
      tokenURI: tokenURI,
      isAvailable:
        owner.toLowerCase() ===
        CONTRACT_ADDRESSES.NFTMarketplace.toLowerCase(),
      isListed: isListed,
      listingPrice: listingPrice,
      listedBy: listedBy,
      metadataLoading: true,
    });
  } catch (error) {
    console.error(`Error loading NFT ${i}:`, error);
  }
}
```

---

### Change 3: Updated Price Display Section
**Location:** Lines 459-487

**Before:**
```tsx
<div className="nft-metadata">
  <div className="metadata-item">
    <span className="label">Owner:</span>
    <span className="value">
      {nft.owner.substring(0, 6)}...{nft.owner.substring(38)}
    </span>
  </div>

  {nft.isAvailable && (
    <div className="metadata-item">
      <span className="label">Price:</span>
      <span className="value price">
        {formatValueOrNA(
          pricesInTokens[selectedPayment]
            ? parseFloat(
                pricesInTokens[selectedPayment]
              ).toFixed(2)
            : nftPrice,
          2,
          contractsAvailable
        )}{" "}
        {getTokenSymbol(selectedPayment)}
      </span>
    </div>
  )}
</div>
```

**After:**
```tsx
<div className="nft-metadata">
  <div className="metadata-item">
    <span className="label">Owner:</span>
    <span className="value">
      {nft.owner.substring(0, 6)}...{nft.owner.substring(38)}
    </span>
  </div>

  {nft.isListed ? (
    <div className="metadata-item">
      <span className="label">Listed Price:</span>
      <span className="value price">
        {nft.listingPrice || "0"} CLAW
      </span>
    </div>
  ) : nft.isAvailable ? (
    <div className="metadata-item">
      <span className="label">Price:</span>
      <span className="value price">
        {formatValueOrNA(
          pricesInTokens[selectedPayment]
            ? parseFloat(
                pricesInTokens[selectedPayment]
              ).toFixed(2)
            : nftPrice,
          2,
          contractsAvailable
        )}{" "}
        {getTokenSymbol(selectedPayment)}
      </span>
    </div>
  ) : null}
</div>
```

---

### Change 4: Updated Buy Button Logic
**Location:** Lines 488-508

**Before:**
```tsx
{nft.isAvailable ? (
  <button
    onClick={() => handleBuyNFT(nft.tokenId)}
    disabled={buying || !contractsAvailable}
    className="btn-primary btn-buy"
  >
    {buying ? "Buying..." : "🛒 Buy NFT"}
  </button>
) : nft.owner.toLowerCase() === account.toLowerCase() ? (
  <div className="owned-badge">✅ You own this</div>
) : (
  <div className="sold-badge">❌ Sold</div>
)}
```

**After:**
```tsx
{nft.isAvailable && nft.owner.toLowerCase() !== account.toLowerCase() ? (
  <button
    onClick={() => handleBuyNFT(nft.tokenId)}
    disabled={buying || !contractsAvailable}
    className="btn-primary btn-buy"
  >
    {buying ? "Buying..." : "🛒 Buy NFT"}
  </button>
) : nft.isListed && nft.owner.toLowerCase() !== account.toLowerCase() ? (
  <button
    onClick={() => handleBuyNFT(nft.tokenId)}
    disabled={buying || !contractsAvailable}
    className="btn-primary btn-buy"
  >
    {buying ? "Buying..." : "🛒 Buy Listed NFT"}
  </button>
) : nft.owner.toLowerCase() === account.toLowerCase() ? (
  <div className="owned-badge">✅ You own this</div>
) : (
  <div className="sold-badge">❌ Not Available</div>
)}
```

---

### Change 5: Completely Replaced handleBuyNFT Function
**Location:** Lines 302-358

**New Implementation:**
```tsx
const handleBuyNFT = async (tokenId: number) => {
  try {
    setBuying(true);

    const nft = nfts.find((n) => n.tokenId === tokenId);
    if (!nft) {
      alert("NFT not found");
      return;
    }

    // Prevent owner from buying their own NFT
    if (nft.owner.toLowerCase() === account.toLowerCase()) {
      alert("You cannot buy your own NFT!");
      setBuying(false);
      return;
    }

    const marketplaceContract = new ethers.Contract(
      CONTRACT_ADDRESSES.NFTMarketplace,
      NFT_MARKETPLACE_ABI,
      signer!
    );

    const paymentTokenContract = new ethers.Contract(
      selectedPayment,
      PLATFORM_TOKEN_ABI,
      signer!
    );

    // Determine which purchase method to use and calculate payment amount
    let paymentAmount: bigint;
    let purchaseMethod: "direct" | "listed" = "direct";

    if (nft.isListed) {
      // Buying a listed NFT
      purchaseMethod = "listed";
      paymentAmount = ethers.parseEther(nft.listingPrice || "0");
    } else {
      // Buying from marketplace (direct sale)
      paymentAmount = ethers.parseEther(
        pricesInTokens[selectedPayment] || nftPrice
      );
    }

    console.log("Approving tokens...");
    const approveTx = await paymentTokenContract.approve(
      CONTRACT_ADDRESSES.NFTMarketplace,
      paymentAmount
    );
    await approveTx.wait();
    console.log("Tokens approved");

    console.log("Buying NFT...");
    let buyTx;

    if (purchaseMethod === "listed") {
      // Buy listed NFT (always uses platform token for now, or add payment token support)
      buyTx = await marketplaceContract.buyListedNFT(
        tokenId,
        selectedPayment
      );
    } else {
      // Buy from marketplace
      if (selectedPayment === CONTRACT_ADDRESSES.PlatformToken) {
        buyTx = await marketplaceContract.buyNFTWithPlatformToken(tokenId);
      } else {
        buyTx = await marketplaceContract.buyNFTWithToken(
          tokenId,
          selectedPayment
        );
      }
    }

    await buyTx.wait();
    console.log("NFT purchased!");

    alert("NFT purchased successfully! 🎉");
    await loadMarketplace();
  } catch (error) {
    console.error("Error buying NFT:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    alert("Failed to buy NFT: " + errorMessage);
  } finally {
    setBuying(false);
  }
};
```

---

## Summary of Changes

### Portfolio Page (`portfolio/page.tsx`)
| Change | Type | Impact |
|--------|------|--------|
| Import NFT_MARKETPLACE_ABI | New Import | Enable marketplace interaction |
| isListed, listingPrice fields | Interface Update | Track listing status |
| handleListNFT() | New Function | Enable NFT listing |
| loadNFTs() | Enhanced | Fetch listing info |
| NFT Grid Display | UI Update | Show list form & status |
| State vars (listingPrice, etc) | New State | Manage listing UI |

### Marketplace Page (`marketplace/page.tsx`)
| Change | Type | Impact |
|--------|------|--------|
| isListed, listingPrice, listedBy | Interface Update | Store listing info |
| loadMarketplace() | Enhanced | Fetch listing data |
| Price Display | UI Update | Show proper prices |
| Button Logic | UI Update | Different text per type |
| handleBuyNFT() | Complete Rewrite | Handle both purchase types |

### Total Changes
- **Lines Added:** ~300
- **Functions Added:** 1 (`handleListNFT`)
- **Functions Enhanced:** 2 (`loadMarketplace`, `loadNFTs`)
- **Functions Rewritten:** 1 (`handleBuyNFT`)
- **UI Components Added:** 3 (form, badge, button)
- **Interface Fields Added:** 3 (isListed, listingPrice, listedBy)
- **State Variables Added:** 3
