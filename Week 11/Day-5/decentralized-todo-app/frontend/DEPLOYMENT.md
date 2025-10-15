# Decentralized Todo List - Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Smart Contract Deployment

1. **Open Remix IDE**
   - Go to [https://remix.ethereum.org](https://remix.ethereum.org)
   - Create a new file: `TodoList.sol`

2. **Copy Smart Contract Code**
   ```bash
   # Copy the contract from
   ./contracts/TodoList.sol
   ```

3. **Compile the Contract**
   - Go to "Solidity Compiler" tab
   - Select Solidity version: `^0.8.19`
   - Enable optimization: 200 runs
   - Click "Compile TodoList.sol"

4. **Deploy to Kasplex Testnet**
   - Go to "Deploy & Run Transactions" tab
   - Environment: "Injected Provider - MetaMask"
   - Ensure MetaMask is connected to Kasplex Testnet
   - Select "TodoList" contract
   - Click "Deploy"
   - Confirm transaction in MetaMask
   - **Save the deployed contract address!**

### 2. Frontend Configuration

1. **Update Contract Address**
   ```typescript
   // In frontend/app/components/TodoApp.tsx line 25
   const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE'
   ```

2. **Set Environment Variables**
   ```bash
   cd frontend
   cp .env.example .env.local
   # Edit .env.local and add your contract address
   ```

3. **Install Dependencies & Start**
   ```bash
   npm install
   npm run dev
   ```

### 3. Test the Application

1. **Connect Wallet**
   - Open http://localhost:3000
   - Click "Connect Wallet"
   - Approve MetaMask connection
   - Ensure you're on Kasplex Testnet

2. **Create Your First Task**
   - Enter a task description
   - Set priority and category (optional)
   - Click "Create Task"
   - Confirm the transaction
   - Wait for blockchain confirmation

3. **Test All Features**
   - ✅ Create tasks
   - ✅ Mark tasks as complete
   - ✅ Delete tasks
   - ✅ Filter tasks
   - ✅ View statistics

## 🌐 Network Setup

### Add Kasplex Testnet to MetaMask

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Enter these details:
   - **Network Name**: Kasplex Testnet
   - **RPC URL**: https://rpc-testnet.kasplex.org
   - **Chain ID**: 1337
   - **Currency Symbol**: KAS
   - **Block Explorer**: https://explorer-testnet.kasplex.org

## 📱 Production Deployment

### Deploy Frontend to Vercel

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel deploy
   ```

3. **Set Environment Variables in Vercel**
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (optional)

### Alternative: Deploy to Netlify

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Upload to Netlify**
   - Drag the `out` folder to Netlify dashboard
   - Or connect your Git repository

## 🔍 Verification Steps

After deployment, verify:

- [ ] Smart contract is deployed and verified on block explorer
- [ ] Frontend connects to correct contract address
- [ ] Wallet connection works properly
- [ ] Task creation works and shows in blockchain
- [ ] Task toggle/delete operations work
- [ ] Statistics update correctly
- [ ] All UI components render properly

## 🚨 Troubleshooting

### Common Issues

1. **"Contract not ready" error**
   - Check CONTRACT_ADDRESS is set correctly
   - Ensure you're on the right network (Kasplex Testnet)

2. **Transaction fails**
   - Check you have enough KAS for gas fees
   - Ensure MetaMask is connected to Kasplex Testnet

3. **Tasks not loading**
   - Check contract address is correct
   - Verify network connection
   - Check browser console for errors

4. **Wallet connection issues**
   - Clear browser cache
   - Reset MetaMask account
   - Try different browser

### Getting Help

- Check the browser console for error messages
- Verify contract on block explorer
- Test individual contract functions in Remix
- Join our support Discord

## 📊 Contract Verification

To verify your contract on the block explorer:

1. Go to [Kasplex Testnet Explorer](https://explorer-testnet.kasplex.org)
2. Find your contract address
3. Go to "Contract" tab
4. Click "Verify and Publish"
5. Upload the Solidity source code
6. Set compiler version and optimization settings

## 🎯 Submission Checklist

For hackathon submission:

- [ ] Smart contract deployed to Kasplex Testnet
- [ ] Contract address documented
- [ ] Frontend deployed and accessible
- [ ] All core features working
- [ ] README.md completed
- [ ] Demo video recorded (optional)
- [ ] Code commented and clean

## 🏆 Demo Script

For presenting your dApp:

1. **Introduction** (30 seconds)
   - Show the landing page
   - Explain the concept of decentralized todos

2. **Wallet Connection** (30 seconds)
   - Connect MetaMask
   - Show wallet integration

3. **Core Features** (2 minutes)
   - Create a new task
   - Mark task as complete
   - Delete a task
   - Show statistics

4. **Advanced Features** (1 minute)
   - Filter tasks
   - Set priorities and categories
   - Show blockchain transaction

5. **Conclusion** (30 seconds)
   - Highlight decentralization benefits
   - Show contract on block explorer

---

**Good luck with your deployment! 🚀**