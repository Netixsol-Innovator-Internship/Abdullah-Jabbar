# 🎨 Manual Deployment Guide Using Remix IDE

## 📋 Overview
This guide walks you through deploying all 7 contracts manually on Remix IDE to Kasplex Testnet.

---

## 🔧 Prerequisites

1. **Browser Wallet (MetaMask)** configured with Kasplex Testnet
   - Network Name: `Kasplex Testnet`
   - RPC URL: `https://rpc.kasplextest.xyz`
   - Chain ID: `167012`
   - Currency Symbol: `KAS`
   - Explorer: `https://explorer.testnet.kasplextest.xyz`

2. **KAS Testnet Tokens** for gas fees (get from faucet)

3. **Remix IDE** - Open at https://remix.ethereum.org

---

## 📁 Step 1: Prepare Contracts in Remix

### 1.1 Create Workspace
1. Open Remix IDE
2. Create new workspace: `DeFi-Platform`
3. Create folder structure:
   ```
   contracts/
   ```

### 1.2 Upload All Contract Files
Upload these 7 contracts to `contracts/` folder:
- `PlatformToken.sol`
- `TestUSD.sol`
- `TestBTC.sol`
- `TokenFaucet.sol`
- `MultiTokenDEX.sol`
- `NFTCollection.sol`
- `NFTMarketplace.sol`

---

## 🚀 Step 2: Deploy Contracts (IN THIS ORDER!)

### ⚙️ Remix Compiler Settings
1. Click **Solidity Compiler** tab (left sidebar)
2. Set compiler version: `0.8.20`
3. Enable **Optimization**: `200 runs`
4. Click **Compile** for each contract before deploying

### 🔌 Connect to Kasplex Testnet
1. Click **Deploy & Run Transactions** tab
2. Set Environment: **Injected Provider - MetaMask**
3. Confirm MetaMask is connected to **Kasplex Testnet**
4. Verify your account has KAS tokens

---

## 📝 Deployment Steps

### **Contract 1: PlatformToken (CLAW)**

**File:** `PlatformToken.sol`

**Steps:**
1. Compile `PlatformToken.sol`
2. Select contract: `PlatformToken`
3. **Constructor Parameters:** *(None - hardcoded as "Claw", "CLAW")*
4. Click **Deploy**
5. Confirm transaction in MetaMask
6. **📋 SAVE ADDRESS:** Copy deployed contract address

**Example Address Format:** `0x1234...5678`

---

### **Contract 2: TestUSD (TUSD)**

**File:** `TestUSD.sol`

**Steps:**
1. Compile `TestUSD.sol`
2. Select contract: `TestUSD`
3. **Constructor Parameters:** *(None)*
4. Click **Deploy**
5. Confirm transaction
6. **📋 SAVE ADDRESS**

---

### **Contract 3: TestBTC (TBTC)**

**File:** `TestBTC.sol`

**Steps:**
1. Compile `TestBTC.sol`
2. Select contract: `TestBTC`
3. **Constructor Parameters:** *(None)*
4. Click **Deploy**
5. Confirm transaction
6. **📋 SAVE ADDRESS**

---

### **Contract 4: TokenFaucet**

**File:** `TokenFaucet.sol`

**Steps:**
1. Compile `TokenFaucet.sol`
2. Select contract: `TokenFaucet`
3. **Constructor Parameters:**
   ```
   _platformToken: <PlatformToken_Address_From_Step_1>
   ```
4. Click **Deploy**
5. Confirm transaction
6. **📋 SAVE ADDRESS**

**Example:**
```
_platformToken: 0x1234567890123456789012345678901234567890
```

---

### **Contract 5: MultiTokenDEX**

**File:** `MultiTokenDEX.sol`

**Steps:**
1. Compile `MultiTokenDEX.sol`
2. Select contract: `MultiTokenDEX`
3. **Constructor Parameters:** *(None)*
4. Click **Deploy**
5. Confirm transaction
6. **📋 SAVE ADDRESS**

---

### **Contract 6: NFTCollection**

**File:** `NFTCollection.sol`

**Steps:**
1. Compile `NFTCollection.sol`
2. Select contract: `NFTCollection`
3. **Constructor Parameters:**
   ```
   name: "DeFi Art Collection"
   symbol: "DFART"
   _baseTokenURI: "ipfs://QmYourBaseURI/"
   ```
4. Click **Deploy**
5. Confirm transaction
6. **📋 SAVE ADDRESS**

**Example:**
```
name: DeFi Art Collection
symbol: DFART
_baseTokenURI: ipfs://QmYourIPFSHash/
```

---

### **Contract 7: NFTMarketplace**

**File:** `NFTMarketplace.sol`

**Steps:**
1. Compile `NFTMarketplace.sol`
2. Select contract: `NFTMarketplace`
3. **Constructor Parameters:**
   ```
   _nftCollection: <NFTCollection_Address_From_Step_6>
   _platformToken: <PlatformToken_Address_From_Step_1>
   _dex: <MultiTokenDEX_Address_From_Step_5>
   ```
4. Click **Deploy**
5. Confirm transaction
6. **📋 SAVE ADDRESS**

**Example:**
```
_nftCollection: 0xNFTAddress...
_platformToken: 0xPlatformTokenAddress...
_dex: 0xDEXAddress...
```

---

## ⚙️ Step 3: Configure Deployed Contracts

### **3.1 Fund the Faucet**

**On PlatformToken Contract:**
1. Expand deployed `PlatformToken` contract
2. Find `transfer` function
3. Enter parameters:
   ```
   to: <TokenFaucet_Address>
   amount: 100000000000000000000000
   ```
   *(This is 100,000 tokens with 18 decimals)*
4. Click **transact**
5. Confirm in MetaMask

---

### **3.2 Create DEX Pools**

**On MultiTokenDEX Contract:**
1. Expand deployed `MultiTokenDEX` contract
2. Find `createPool` function

**Pool 1: CLAW/TUSD**
```
tokenA: <PlatformToken_Address>
tokenB: <TestUSD_Address>
```
Click **transact** → Confirm

**Pool 2: CLAW/TBTC**
```
tokenA: <PlatformToken_Address>
tokenB: <TestBTC_Address>
```
Click **transact** → Confirm

**Pool 3: TUSD/TBTC**
```
tokenA: <TestUSD_Address>
tokenB: <TestBTC_Address>
```
Click **transact** → Confirm

---

### **3.3 Approve Tokens for Liquidity**

**Approve PlatformToken:**
1. On `PlatformToken` contract
2. Find `approve` function
3. Enter:
   ```
   spender: <MultiTokenDEX_Address>
   amount: 50000000000000000000000
   ```
   *(50,000 tokens)*
4. Click **transact** → Confirm

**Approve TestUSD:**
1. On `TestUSD` contract
2. Find `approve` function
3. Enter:
   ```
   spender: <MultiTokenDEX_Address>
   amount: 50000000000000000000000
   ```
4. Click **transact** → Confirm

**Approve TestBTC:**
1. On `TestBTC` contract
2. Find `approve` function
3. Enter:
   ```
   spender: <MultiTokenDEX_Address>
   amount: 50000000000000000000000
   ```
4. Click **transact** → Confirm

---

### **3.4 Add Liquidity to Pools**

**On MultiTokenDEX Contract:**

**Add Liquidity: CLAW/TUSD (1:1 ratio)**
1. Find `addLiquidity` function
2. Enter:
   ```
   tokenA: <PlatformToken_Address>
   tokenB: <TestUSD_Address>
   amountA: 10000000000000000000000
   amountB: 10000000000000000000000
   ```
   *(10,000 CLAW : 10,000 TUSD)*
3. Click **transact** → Confirm

**Add Liquidity: CLAW/TBTC (2:1 ratio - CLAW cheaper)**
1. Enter:
   ```
   tokenA: <PlatformToken_Address>
   tokenB: <TestBTC_Address>
   amountA: 10000000000000000000000
   amountB: 5000000000000000000000
   ```
   *(10,000 CLAW : 5,000 TBTC)*
2. Click **transact** → Confirm

**Add Liquidity: TUSD/TBTC (2:1 ratio)**
1. Enter:
   ```
   tokenA: <TestUSD_Address>
   tokenB: <TestBTC_Address>
   amountA: 10000000000000000000000
   amountB: 5000000000000000000000
   ```
   *(10,000 TUSD : 5,000 TBTC)*
2. Click **transact** → Confirm

---

### **3.5 Configure Marketplace**

**Add Supported Tokens:**

**On NFTMarketplace Contract:**

**Add TestUSD:**
1. Find `addSupportedToken` function
2. Enter:
   ```
   token: <TestUSD_Address>
   ```
3. Click **transact** → Confirm

**Add TestBTC:**
1. Enter:
   ```
   token: <TestBTC_Address>
   ```
2. Click **transact** → Confirm

---

### **3.6 Mint NFTs**

**On NFTCollection Contract:**

**Mint NFT #0:**
1. Find `mintNFT` function
2. Enter:
   ```
   to: <Your_Wallet_Address>
   tokenURI: "0.json"
   ```
3. Click **transact** → Confirm

**Mint NFT #1:**
```
to: <Your_Wallet_Address>
tokenURI: "1.json"
```
Click **transact** → Confirm

**Mint NFT #2:**
```
to: <Your_Wallet_Address>
tokenURI: "2.json"
```
Click **transact** → Confirm

**Mint NFT #3:**
```
to: <Your_Wallet_Address>
tokenURI: "3.json"
```
Click **transact** → Confirm

**Mint NFT #4:**
```
to: <Your_Wallet_Address>
tokenURI: "4.json"
```
Click **transact** → Confirm

---

### **3.7 Approve Marketplace for NFT Transfers**

**On NFTCollection Contract:**
1. Find `setApprovalForAll` function
2. Enter:
   ```
   operator: <NFTMarketplace_Address>
   approved: true
   ```
3. Click **transact** → Confirm

---

## 📊 Step 4: Record All Addresses

Create a `deployment-addresses.txt` file with:

```
==============================================
DEPLOYMENT ADDRESSES - Kasplex Testnet
==============================================
Deployed on: [Date]
Deployer: [Your Wallet Address]

CONTRACT ADDRESSES:
----------------------------------------------
PlatformToken (CLAW): 0x...
TestUSD (TUSD):       0x...
TestBTC (TBTC):       0x...
TokenFaucet:          0x...
MultiTokenDEX:        0x...
NFTCollection:        0x...
NFTMarketplace:       0x...

POOL IDs (for reference):
----------------------------------------------
CLAW/TUSD Pool: [poolId from event]
CLAW/TBTC Pool: [poolId from event]
TUSD/TBTC Pool: [poolId from event]

CONFIGURATION:
----------------------------------------------
✅ Faucet funded with 100,000 CLAW
✅ 3 DEX pools created
✅ Liquidity added to all pools
✅ 5 NFTs minted
✅ Marketplace configured
✅ NFT approvals set

==============================================
```

---

## 🧪 Step 5: Test Deployment

### **Test 1: Claim from Faucet**
1. On `TokenFaucet` contract
2. Find `claimTokens` function
3. Click **transact**
4. Check your wallet - should receive 100 CLAW

### **Test 2: Swap Tokens**
1. On `PlatformToken`, approve DEX: `approve(dexAddress, 1000...)`
2. On `MultiTokenDEX`, find `swap`:
   ```
   tokenIn: <PlatformToken_Address>
   tokenOut: <TestUSD_Address>
   amountIn: 100000000000000000000
   minAmountOut: 90000000000000000000
   ```
3. Check TestUSD balance increased

### **Test 3: Buy NFT**
1. On `PlatformToken`, approve marketplace: `approve(marketplaceAddress, 100...)`
2. On `NFTMarketplace`, find `buyNFTWithPlatformToken`:
   ```
   tokenId: 0
   ```
3. Check NFT ownership changed to your address

---

## ⚠️ Common Issues & Solutions

### Issue: Transaction Fails - "Insufficient Funds"
**Solution:** Get more KAS tokens from faucet for gas fees

### Issue: "Execution Reverted"
**Solution:** Check you're using correct addresses and have approved tokens

### Issue: Cannot Find Deployed Contract
**Solution:** Check "Deployed Contracts" section in Remix (bottom left)

### Issue: Wrong Network
**Solution:** Switch MetaMask to Kasplex Testnet (Chain ID: 167012)

### Issue: Approval Not Working
**Solution:** Make sure amount has 18 zeros (for 18 decimals)
Example: 100 tokens = `100000000000000000000`

### Issue: Pool Creation Fails
**Solution:** Ensure you're the owner (deployed from same address)

---

## 📝 Amount Conversion Reference

**Token Amounts (18 decimals):**
```
1 token     = 1000000000000000000
10 tokens   = 10000000000000000000
100 tokens  = 100000000000000000000
1,000       = 1000000000000000000000
10,000      = 10000000000000000000000
100,000     = 100000000000000000000000
```

**Quick Tip:** Use this tool: `amount * (10^18)`
- JavaScript: `amount * 10**18`
- Or use: https://eth-converter.com/

---

## 🎯 Deployment Checklist

- [ ] All 7 contracts compiled successfully
- [ ] All 7 contracts deployed in correct order
- [ ] All deployment addresses recorded
- [ ] Faucet funded with 100k CLAW tokens
- [ ] 3 DEX pools created (CLAW/TUSD, CLAW/TBTC, TUSD/TBTC)
- [ ] Tokens approved for DEX
- [ ] Liquidity added to all 3 pools
- [ ] TestUSD added to marketplace
- [ ] TestBTC added to marketplace
- [ ] 5 NFTs minted successfully
- [ ] Marketplace approved for NFT transfers
- [ ] Tested faucet claim
- [ ] Tested token swap
- [ ] Tested NFT purchase
- [ ] Addresses copied to frontend config

---

## 🔍 Verify on Block Explorer

Visit: https://explorer.testnet.kasplextest.xyz

1. Search for each contract address
2. Verify contract code (optional)
3. Check transaction history
4. Confirm all setup transactions succeeded

---

## 📞 Next Steps

After deployment:
1. Copy all addresses to `frontend/src/config/addresses.ts`
2. Update frontend to use Kasplex testnet
3. Test full user flow on frontend
4. Share contract addresses with team
5. Document any issues encountered

---

## 💡 Pro Tips

1. **Keep Remix Tab Open:** Don't close until all setup is complete
2. **Use Notepad:** Track addresses as you deploy each contract
3. **Double-Check Addresses:** One wrong address breaks everything
4. **Test After Each Step:** Don't wait until the end
5. **Save Transaction Hashes:** For debugging and verification
6. **Screenshot Important Steps:** For documentation
7. **Use Same Wallet:** Deploy all contracts from same address (easier management)

---

**Good luck with your deployment! 🚀**
