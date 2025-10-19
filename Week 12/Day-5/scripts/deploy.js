const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Starting deployment...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log(
    "Account balance:",
    (await hre.ethers.provider.getBalance(deployer.address)).toString(),
    "\n"
  );

  // ============================================
  // 1. Deploy Platform Token
  // ============================================
  console.log("📝 Deploying Platform Token...");
  const PlatformToken = await hre.ethers.getContractFactory("PlatformToken");
  const platformToken = await PlatformToken.deploy("SwapCoin", "SWAP");
  await platformToken.waitForDeployment();
  const platformTokenAddress = await platformToken.getAddress();
  console.log("✅ Platform Token deployed to:", platformTokenAddress, "\n");

  // ============================================
  // 2. Deploy Test Tokens (for DEX)
  // ============================================
  console.log("📝 Deploying Test USD Token...");
  const TestUSD = await hre.ethers.getContractFactory("TestUSD");
  const testUSD = await TestUSD.deploy();
  await testUSD.waitForDeployment();
  const testUSDAddress = await testUSD.getAddress();
  console.log("✅ Test USD deployed to:", testUSDAddress, "\n");

  console.log("📝 Deploying Test BTC Token...");
  const TestBTC = await hre.ethers.getContractFactory("TestBTC");
  const testBTC = await TestBTC.deploy();
  await testBTC.waitForDeployment();
  const testBTCAddress = await testBTC.getAddress();
  console.log("✅ Test BTC deployed to:", testBTCAddress, "\n");

  // ============================================
  // 3. Deploy Token Faucet
  // ============================================
  console.log("📝 Deploying Token Faucet...");
  const TokenFaucet = await hre.ethers.getContractFactory("TokenFaucet");
  const faucet = await TokenFaucet.deploy(platformTokenAddress);
  await faucet.waitForDeployment();
  const faucetAddress = await faucet.getAddress();
  console.log("✅ Token Faucet deployed to:", faucetAddress, "\n");

  // Send tokens to faucet
  console.log("💰 Funding faucet with tokens...");
  const faucetAmount = hre.ethers.parseEther("100000"); // 100k tokens
  await platformToken.transfer(faucetAddress, faucetAmount);
  console.log("✅ Faucet funded with 100,000 tokens\n");

  // ============================================
  // 4. Deploy Multi-Token DEX
  // ============================================
  console.log("📝 Deploying Multi-Token DEX...");
  const MultiTokenDEX = await hre.ethers.getContractFactory("MultiTokenDEX");
  const dex = await MultiTokenDEX.deploy();
  await dex.waitForDeployment();
  const dexAddress = await dex.getAddress();
  console.log("✅ DEX deployed to:", dexAddress, "\n");

  // Create pools
  console.log("🏊 Creating liquidity pools...");
  await dex.createPool(platformTokenAddress, testUSDAddress);
  console.log("✅ Pool created: SWAP/TUSD");

  await dex.createPool(platformTokenAddress, testBTCAddress);
  console.log("✅ Pool created: SWAP/TBTC");

  await dex.createPool(testUSDAddress, testBTCAddress);
  console.log("✅ Pool created: TUSD/TBTC\n");

  // Add initial liquidity
  console.log("💧 Adding initial liquidity...");

  // Approve tokens
  const liquidityAmount1 = hre.ethers.parseEther("10000");
  const liquidityAmount2 = hre.ethers.parseEther("10000");

  await platformToken.approve(dexAddress, liquidityAmount1);
  await testUSD.approve(dexAddress, liquidityAmount2);
  await dex.addLiquidity(
    platformTokenAddress,
    testUSDAddress,
    liquidityAmount1,
    liquidityAmount2
  );
  console.log("✅ Liquidity added: SWAP/TUSD");

  await platformToken.approve(dexAddress, liquidityAmount1);
  await testBTC.approve(dexAddress, hre.ethers.parseEther("5000"));
  await dex.addLiquidity(
    platformTokenAddress,
    testBTCAddress,
    liquidityAmount1,
    hre.ethers.parseEther("5000")
  );
  console.log("✅ Liquidity added: SWAP/TBTC");

  await testUSD.approve(dexAddress, hre.ethers.parseEther("10000"));
  await testBTC.approve(dexAddress, hre.ethers.parseEther("5000"));
  await dex.addLiquidity(
    testUSDAddress,
    testBTCAddress,
    hre.ethers.parseEther("10000"),
    hre.ethers.parseEther("5000")
  );
  console.log("✅ Liquidity added: TUSD/TBTC\n");

  // ============================================
  // 5. Deploy NFT Collection
  // ============================================
  console.log("📝 Deploying NFT Collection...");
  const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
  const nftCollection = await NFTCollection.deploy(
    "DeFi Art Collection",
    "DFART",
    "ipfs://QmYourBaseURI/" // Replace with your IPFS base URI
  );
  await nftCollection.waitForDeployment();
  const nftCollectionAddress = await nftCollection.getAddress();
  console.log("✅ NFT Collection deployed to:", nftCollectionAddress, "\n");

  // Mint sample NFTs
  console.log("🎨 Minting sample NFTs...");
  const nftMetadataURIs = [
    "QmHash1.json",
    "QmHash2.json",
    "QmHash3.json",
    "QmHash4.json",
    "QmHash5.json",
  ];

  for (let i = 0; i < nftMetadataURIs.length; i++) {
    await nftCollection.mintNFT(deployer.address, nftMetadataURIs[i]);
    console.log(`✅ NFT #${i} minted`);
  }
  console.log("");

  // ============================================
  // 6. Deploy NFT Marketplace
  // ============================================
  console.log("📝 Deploying NFT Marketplace...");
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const marketplace = await NFTMarketplace.deploy(
    nftCollectionAddress,
    platformTokenAddress,
    dexAddress
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ NFT Marketplace deployed to:", marketplaceAddress, "\n");

  // Add supported tokens to marketplace
  console.log("🔧 Configuring marketplace...");
  await marketplace.addSupportedToken(testUSDAddress);
  console.log("✅ Test USD added as payment option");

  await marketplace.addSupportedToken(testBTCAddress);
  console.log("✅ Test BTC added as payment option\n");

  // Transfer NFTs to marketplace for sale
  console.log("🖼️  Transferring NFTs to marketplace...");
  await nftCollection.setApprovalForAll(marketplaceAddress, true);
  for (let i = 0; i < 3; i++) {
    await nftCollection.transferFrom(deployer.address, marketplaceAddress, i);
  }
  console.log("✅ 3 NFTs transferred to marketplace\n");

  // ============================================
  // Save Deployment Info
  // ============================================
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      PlatformToken: platformTokenAddress,
      TestUSD: testUSDAddress,
      TestBTC: testBTCAddress,
      TokenFaucet: faucetAddress,
      MultiTokenDEX: dexAddress,
      NFTCollection: nftCollectionAddress,
      NFTMarketplace: marketplaceAddress,
    },
  };

  const deploymentPath = "./deployment.json";
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to:", deploymentPath, "\n");

  // ============================================
  // Deployment Summary
  // ============================================
  console.log("═══════════════════════════════════════════════════════");
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("═══════════════════════════════════════════════════════");
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("\n📋 CONTRACT ADDRESSES:");
  console.log("───────────────────────────────────────────────────────");
  console.log("Platform Token (SWAP):", platformTokenAddress);
  console.log("Test USD (TUSD):", testUSDAddress);
  console.log("Test BTC (TBTC):", testBTCAddress);
  console.log("Token Faucet:", faucetAddress);
  console.log("Multi-Token DEX:", dexAddress);
  console.log("NFT Collection:", nftCollectionAddress);
  console.log("NFT Marketplace:", marketplaceAddress);
  console.log("═══════════════════════════════════════════════════════\n");

  console.log("📝 Next steps:");
  console.log("1. Verify contracts on block explorer");
  console.log("2. Upload NFT metadata to IPFS");
  console.log("3. Update frontend with contract addresses");
  console.log("4. Test all features on testnet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
