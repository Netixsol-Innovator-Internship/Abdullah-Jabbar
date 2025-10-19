# 📌 Pinata Setup & setBaseURI Guide

## 🎯 Goal
Upload your NFT metadata folder to Pinata and use `setBaseURI` so you can mint NFTs with short filenames like `0.json`, `1.json`, `2.json`.

---

## 📤 Step 1: Upload Metadata to Pinata

### 1.1 Go to Pinata
- Visit: https://pinata.cloud
- Sign in (or create free account)

### 1.2 Upload Folder
1. Click **"Upload"** → **"Folder"**
2. Select your `nft-metadata` folder containing:
   - `0.json`
   - `1.json`
   - `2.json`
3. Give it a name: `DeFi-Art-Metadata`
4. Click **Upload**

### 1.3 Get the CID
- After upload completes, you'll see your folder listed
- **Copy the CID** (looks like: `QmXxYy123...`)
- Example CID: `QmYourMetadataFolderCIDHere`

### 1.4 Test Your Upload (Optional)
Visit in browser:
```
https://gateway.pinata.cloud/ipfs/QmYourCID/0.json
```
You should see your NFT metadata!

---

## ⚙️ Step 2: Set Base URI in Remix

### 2.1 Open Your Deployed NFTCollection Contract
1. In Remix, go to **"Deploy & Run Transactions"**
2. Under **"Deployed Contracts"**, expand **NFTCollection**

### 2.2 Call `setBaseURI` Function
1. Find the `setBaseURI` function
2. Enter the parameter:
   ```
   newBaseURI: ipfs://QmYourMetadataFolderCIDHere/
   ```

   **⚠️ IMPORTANT FORMAT:**
   - Must start with: `ipfs://`
   - Must end with: `/` (forward slash)
   - Full example: `ipfs://QmXxYy123.../`

3. Click **transact**
4. Confirm transaction in MetaMask
5. Wait for confirmation ✅

### 2.3 Verify It Worked
1. Find the `baseTokenURI` function (view function, blue button)
2. Click it
3. It should return: `ipfs://QmYourCID/`

---

## 🎨 Step 3: Mint NFTs with Short Names

Now you can mint using just filenames!

### Mint NFT #0
**Function:** `mintNFT`
```
to: 0xYourWalletAddress
_tokenURI: 0.json
```
Click **transact** → Confirm

### Mint NFT #1
```
to: 0xYourWalletAddress
_tokenURI: 1.json
```
Click **transact** → Confirm

### Mint NFT #2
```
to: 0xYourWalletAddress
_tokenURI: 2.json
```
Click **transact** → Confirm

---

## 🔍 How It Works

### The Contract Logic:
```solidity
function tokenURI(uint256 tokenId) returns (string) {
    return baseTokenURI + _tokenURIs[tokenId];
}
```

### Example Combination:
- **baseTokenURI:** `ipfs://QmAbc123.../`
- **_tokenURI (for token 0):** `0.json`
- **Final Result:** `ipfs://QmAbc123.../0.json` ✅

---

## ✅ Verification Checklist

- [ ] Uploaded `nft-metadata` folder to Pinata
- [ ] Copied the folder CID
- [ ] Called `setBaseURI` with format: `ipfs://CID/`
- [ ] Verified `baseTokenURI` shows correct value
- [ ] Minted NFT #0 with `0.json`
- [ ] Minted NFT #1 with `1.json`
- [ ] Minted NFT #2 with `2.json`
- [ ] Checked NFT metadata loads in wallet/OpenSea

---

## 📋 Quick Reference

### Your Setup:
```
Contract: NFTCollection
Network: Kasplex Testnet
Folder on Pinata: nft-metadata
Files: 0.json, 1.json, 2.json
```

### Example Values to Use:
```
1. Upload folder to Pinata
   ↓
2. Get CID: QmXxYy123...
   ↓
3. setBaseURI: ipfs://QmXxYy123.../
   ↓
4. Mint with: 0.json, 1.json, 2.json
   ↓
5. Result: ipfs://QmXxYy123.../0.json ✅
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Wrong Format:
```
QmXxYy123...                    ← Missing ipfs:// and /
ipfs://QmXxYy123...             ← Missing trailing /
ipfs://QmXxYy123.../0.json      ← Don't include filename in baseURI
```

### ✅ Correct Format:
```
ipfs://QmXxYy123.../            ← Perfect! ✅
```

---

## 🎯 Alternative: If You Already Minted

If you already minted NFTs using full IPFS URIs (like `ipfs://bafybei...`):
- Those NFTs will keep their full URIs
- You can still call `setBaseURI` for future mints
- Future mints will use: `baseURI + filename`

---

## 📞 Troubleshooting

### Issue: Metadata not loading
**Solution:** Check the full URL works:
```
ipfs://YOUR_CID/0.json
```
Try in browser: `https://gateway.pinata.cloud/ipfs/YOUR_CID/0.json`

### Issue: `setBaseURI` transaction fails
**Solution:** 
- Make sure you're the contract owner
- Check you have enough KAS for gas

### Issue: NFT shows wrong metadata
**Solution:**
- Verify `baseTokenURI` is set correctly
- Check file exists on Pinata
- Clear cache and reload

---

## 🎉 Next Steps After Minting

1. **View on Explorer:**
   - Go to: https://explorer.testnet.kasplextest.xyz
   - Search for your NFTCollection address
   - Check minted tokens

2. **Test NFT Transfer:**
   - Try transferring to another wallet
   - Verify metadata still shows

3. **Configure Marketplace:**
   - Continue with marketplace setup
   - Test buying NFTs with different tokens

---

**Good luck! 🚀**
