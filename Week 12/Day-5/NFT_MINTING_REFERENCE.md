# 🎨 NFT Deployment Quick Reference

## 📝 Contract 6: NFTCollection Constructor Parameters

### Use These Exact Values in Remix:

```
name: DeFi Art Collection
symbol: DFART
_baseTokenURI: 
```

**Note:** Leave `_baseTokenURI` empty (blank field) since your metadata files already have full IPFS URIs.

---

## 🖼️ Step 3.6: Minting NFTs - Copy & Paste Ready

### **Mint NFT #0** (Common - Blue Abstract)
```
to: YOUR_WALLET_ADDRESS_HERE
tokenURI: ipfs://bafybeifwxaypwdg3q7rjsw2f35vdbkzkfkwdgenrk2jgmoeqp6tzznoih4
```

### **Mint NFT #1** (Rare - Purple Geometric)
```
to: YOUR_WALLET_ADDRESS_HERE
tokenURI: ipfs://bafybeignjrzlzjfgy7dgcrozzy2ysjsuqslvqli5etybu76hn4tzhiifbq
```

### **Mint NFT #2** (Epic - Gold Futuristic)
```
to: YOUR_WALLET_ADDRESS_HERE
tokenURI: ipfs://bafybeibvx54glhcbauqt4q67l4jgpavzsifet5w5vyipktgde3ojf3gsyi
```

### **Optional: Mint NFT #3** (Use placeholder)
```
to: YOUR_WALLET_ADDRESS_HERE
tokenURI: ipfs://QmPlaceholder3
```

### **Optional: Mint NFT #4** (Use placeholder)
```
to: YOUR_WALLET_ADDRESS_HERE
tokenURI: ipfs://QmPlaceholder4
```

---

## 🔍 Explanation

### Why Leave baseTokenURI Empty?

Your NFT metadata files contain **complete IPFS image URLs**:
- NFT #0 image: `ipfs://bafybeifwxaypwdg3q7rjsw2f35vdbkzkfkwdgenrk2jgmoeqp6tzznoih4`
- NFT #1 image: `ipfs://bafybeignjrzlzjfgy7dgcrozzy2ysjsuqslvqli5etybu76hn4tzhiifbq`
- NFT #2 image: `ipfs://bafybeibvx54glhcbauqt4q67l4jgpavzsifet5w5vyipktgde3ojf3gsyi`

Since the images are already uploaded to IPFS individually, you should:
1. **Upload your metadata folder** (0.json, 1.json, 2.json) to IPFS/Pinata
2. Get the **folder CID**
3. Then you can use that as baseTokenURI

### Two Ways to Handle This:

#### **Method A: No Base URI (What You're Doing Now)** ✅
- baseTokenURI: `` (empty)
- When minting: Use full IPFS paths for the JSON metadata
- Example: `ipfs://bafybeifwxaypwdg3q7rjsw2f35vdbkzkfkwdgenrk2jgmoeqp6tzznoih4`

#### **Method B: Upload Metadata Folder First**
1. Go to https://pinata.cloud (create free account)
2. Upload `nft-metadata` folder containing all your .json files
3. Copy the folder CID (e.g., `QmYourMetadataFolderCID`)
4. Use in constructor: `ipfs://QmYourMetadataFolderCID/`
5. When minting: Just use `0.json`, `1.json`, `2.json`

---

## 🚀 Quick Steps (Continue Your Deployment)

### Step 1: Deploy NFTCollection
```
name: DeFi Art Collection
symbol: DFART
_baseTokenURI: 
```
Click **Deploy** ✅

### Step 2: Deploy NFTMarketplace
```
_nftCollection: <NFTCollection_Address_From_Step_Above>
_platformToken: <Your_PlatformToken_Address>
_dex: <Your_MultiTokenDEX_Address>
```
Click **Deploy** ✅

### Step 3: Configure Everything
Follow Section 3 of REMIX_DEPLOYMENT_GUIDE.md

### Step 4: Mint Your 3 NFTs
Use the IPFS URIs provided above ✅

---

## 📌 Important Notes

1. **Your metadata JSON files are already on IPFS** - They reference images that are uploaded
2. **The JSON files themselves** (0.json, 1.json, 2.json) need to be uploaded too
3. **For now**, you can use the full image IPFS URIs as tokenURIs when minting
4. **For production**, upload the metadata folder and use proper baseTokenURI

---

## ✅ Current Deployment Status

- [x] PlatformToken deployed
- [x] TestUSD deployed
- [x] TestBTC deployed
- [x] TokenFaucet deployed
- [x] MultiTokenDEX deployed
- [ ] **NFTCollection** ← YOU ARE HERE
- [ ] NFTMarketplace
- [ ] Configuration & setup

---

## 🎯 Next Steps After NFTCollection Deployment

1. Save NFTCollection address
2. Deploy NFTMarketplace with all 3 addresses
3. Follow configuration steps in main guide
4. Mint 3 NFTs with the URIs above
5. Test everything!

Good luck! 🚀
