# Smart Contract Deployment Instructions

## Step-by-Step Remix Deployment

### 1. Open Remix IDE
Go to [https://remix.ethereum.org](https://remix.ethereum.org)

### 2. Create New File
- Click the "+" icon in the file explorer
- Name it: `TodoList.sol`

### 3. Copy Contract Code
Copy and paste the entire content from:
```
contracts/TodoList.sol
```

### 4. Compile Contract
- Go to "Solidity Compiler" tab (second icon in left sidebar)
- Select compiler version: `0.8.19` or higher
- Enable optimization: Check "Enable optimization" and set to 200 runs
- Click "Compile TodoList.sol"
- Ensure there are no compilation errors

### 5. Configure MetaMask for Kasplex Testnet
Add Kasplex Testnet to MetaMask:
- Network Name: `Kasplex Testnet`
- RPC URL: `https://rpc-testnet.kasplex.org`
- Chain ID: `1337`
- Currency Symbol: `KAS`
- Block Explorer: `https://explorer-testnet.kasplex.org`

### 6. Deploy Contract
- Go to "Deploy & Run Transactions" tab (third icon)
- Environment: Select "Injected Provider - MetaMask"
- Ensure MetaMask is connected and on Kasplex Testnet
- Account: Your MetaMask account should appear
- Contract: Select "TodoList" from dropdown
- Click "Deploy" button
- Confirm transaction in MetaMask popup
- Wait for deployment confirmation

### 7. Save Contract Address
After successful deployment:
- Copy the contract address from the deployment log
- Save it in a safe place
- You'll need this address for the frontend configuration

### 8. Update Frontend
In your frontend code, update the contract address:
```typescript
// In frontend/app/components/TodoApp.tsx
const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE'
```

### 9. Test Deployment
- You can test contract functions directly in Remix
- Try calling `createTask` with test parameters
- Verify the transaction on the Kasplex block explorer

## Example Deployment Transaction
After deployment, you should see something like:
```
[block] from: 0xYour...Address in: TodoList 0xContract...Address
status: 0x1 Transaction mined and execution succeed
transaction hash: 0x123...abc
gas: 1234567 gas
```

## Verification
To verify your contract is working:
1. Call `taskCounts(your_address)` - should return 0
2. Call `createTask("Test Task", 3, "General")`
3. Call `taskCounts(your_address)` - should return 1
4. Call `getAllTasks()` - should return array with your task

## Need Help?
- Check MetaMask is on correct network
- Ensure you have KAS tokens for gas fees
- Verify contract compilation is successful
- Contact support if deployment fails

## Contract Address Template
```
Deployed Contract Address: 0x...
Network: Kasplex Testnet
Block Explorer: https://explorer-testnet.kasplex.org/address/0x...
Deployment Date: [Date]
Deployer: [Your Address]
```