/**
 * Contract Verification Script
 * Run this with: node verify-contract.js
 *
 * This script helps diagnose why token name and supply aren't showing
 */

const { createPublicClient, http } = require("viem");
const { CONTRACT_ADDRESS, CONTRACT_ABI } = require("./src/config/contract.ts");

// Define the chains
const kasplexTestnet = {
  id: 167012,
  name: "Kasplex Testnet",
  rpcUrls: {
    default: { http: ["https://rpc.kasplextest.xyz"] },
  },
};

const sepolia = {
  id: 11155111,
  name: "Sepolia",
  rpcUrls: {
    default: { http: ["https://rpc.sepolia.org"] },
  },
};

async function verifyContract(chain) {
  console.log(`\n🔍 Checking contract on ${chain.name}...`);
  console.log(`📍 Contract Address: ${CONTRACT_ADDRESS}`);

  const client = createPublicClient({
    chain: chain,
    transport: http(),
  });

  try {
    // Check if contract exists
    const code = await client.getBytecode({ address: CONTRACT_ADDRESS });

    if (!code || code === "0x") {
      console.log(`❌ No contract found at this address on ${chain.name}`);
      return false;
    }

    console.log(`✅ Contract exists on ${chain.name}`);

    // Try to read contract data
    try {
      const name = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "name",
      });
      console.log(`📝 Token Name: ${name}`);
    } catch (e) {
      console.log(`❌ Failed to read name: ${e.message}`);
    }

    try {
      const symbol = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "symbol",
      });
      console.log(`🔤 Token Symbol: ${symbol}`);
    } catch (e) {
      console.log(`❌ Failed to read symbol: ${e.message}`);
    }

    try {
      const totalSupply = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "totalSupply",
      });
      const formattedSupply = Number(totalSupply) / 1e18;
      console.log(
        `💰 Total Supply: ${formattedSupply.toLocaleString()} tokens`
      );
    } catch (e) {
      console.log(`❌ Failed to read totalSupply: ${e.message}`);
    }

    try {
      const decimals = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "decimals",
      });
      console.log(`🔢 Decimals: ${decimals}`);
    } catch (e) {
      console.log(`❌ Failed to read decimals: ${e.message}`);
    }

    return true;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("🚀 ClawToken Contract Verification");
  console.log("=".repeat(50));

  // Check both networks
  const foundOnKasplex = await verifyContract(kasplexTestnet);
  const foundOnSepolia = await verifyContract(sepolia);

  console.log("\n" + "=".repeat(50));
  console.log("📊 Summary:");
  console.log(
    `Kasplex Testnet: ${foundOnKasplex ? "✅ Found" : "❌ Not Found"}`
  );
  console.log(`Sepolia: ${foundOnSepolia ? "✅ Found" : "❌ Not Found"}`);

  if (!foundOnKasplex && !foundOnSepolia) {
    console.log("\n⚠️  ISSUE FOUND:");
    console.log("The contract is not deployed on either network!");
    console.log("\n💡 Solutions:");
    console.log("1. Deploy the contract to one of these networks");
    console.log("2. Update CONTRACT_ADDRESS in src/config/contract.ts");
    console.log(
      "3. Make sure you are connecting to the right network in MetaMask"
    );
  }
}

main().catch(console.error);
