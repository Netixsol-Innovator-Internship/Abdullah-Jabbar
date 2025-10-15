const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TodoList contract...");

  // Get the ContractFactory
  const TodoList = await ethers.getContractFactory("TodoList");

  // Deploy the contract
  const todoList = await TodoList.deploy();

  // Wait for deployment to complete
  await todoList.waitForDeployment();

  const contractAddress = await todoList.getAddress();

  console.log("TodoList deployed to:", contractAddress);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);

  // Verify the contract is working by calling a view function
  try {
    const taskCount = await todoList.taskCounts(await todoList.runner.address);
    console.log("Initial task count:", taskCount.toString());
    console.log("Contract deployment successful! ✅");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }

  console.log("\n📋 Next Steps:");
  console.log("1. Copy the contract address above");
  console.log(
    "2. Update CONTRACT_ADDRESS in frontend/src/components/TodoApp.tsx"
  );
  console.log("3. Make sure your wallet is connected to the same network");
  console.log("4. Add some test ETH to your wallet for gas fees");

  return contractAddress;
}

main()
  .then((address) => {
    console.log(`\n🎉 Deployment complete! Contract address: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
