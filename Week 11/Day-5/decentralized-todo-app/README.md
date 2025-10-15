# 🚀 Decentralized Todo List

A fully decentralized todo list application built with Solidity smart contracts and Next.js frontend. Manage your tasks on the blockchain with complete transparency and permanence.

## ✨ Features

- **🔗 Blockchain Integration**: Tasks are stored permanently on the blockchain
- **🔒 Wallet Connection**: Connect with MetaMask and other Web3 wallets
- **📝 Full CRUD Operations**: Create, read, update, and delete tasks
- **🎯 Priority Levels**: Set task priorities from Very Low to Very High
- **🏷️ Categories**: Organize tasks with custom categories
- **📊 Statistics**: View completion rates and task analytics
- **🎨 Modern UI**: Clean, responsive design with dark mode support
- **⚡ Real-time Updates**: Automatic UI updates when blockchain state changes

## 🛠️ Tech Stack

### Smart Contract
- **Solidity ^0.8.19**: Smart contract development
- **Custom Errors**: Gas-optimized error handling
- **Events**: Frontend integration and logging
- **Mappings & Structs**: Efficient data storage

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Wagmi**: React hooks for Ethereum
- **Viem**: TypeScript interface for Ethereum
- **React Hot Toast**: Beautiful notifications

## 📋 Smart Contract Features

### Core Functions
- `createTask(content, priority, category)` - Create new tasks
- `toggleTask(taskId)` - Mark tasks complete/incomplete
- `updateTask(taskId, newContent)` - Edit task descriptions
- `deleteTask(taskId)` - Remove tasks
- `getAllTasks()` - Retrieve all user tasks
- `getTask(taskId)` - Get specific task details

### Advanced Features
- `getTasksByStatus(completed)` - Filter by completion status
- `getTasksByPriority(priority)` - Filter by priority level
- `getTaskStats()` - Get completion statistics
- `clearAllTasks()` - Emergency clear function

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MetaMask wallet
- Kasplex Testnet KAS tokens (request from team)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd decentralized-todo-app
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Deploy the smart contract**
   - Open [Remix IDE](https://remix.ethereum.org)
   - Create new file: `TodoList.sol`
   - Copy contract code from `contracts/TodoList.sol`
   - Compile with Solidity 0.8.19+
   - Deploy to Kasplex Testnet
   - Copy the deployed contract address

5. **Update contract address**
   ```typescript
   // In frontend/app/components/TodoApp.tsx
   const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS'
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open the application**
   - Navigate to `http://localhost:3000`
   - Connect your MetaMask wallet
   - Switch to Kasplex Testnet
   - Start creating tasks!

## 🌐 Network Configuration

### Kasplex Testnet
- **Network Name**: Kasplex Testnet
- **RPC URL**: `https://rpc-testnet.kasplex.org`
- **Chain ID**: 1337
- **Currency Symbol**: KAS
- **Block Explorer**: `https://explorer-testnet.kasplex.org`

Add this network to MetaMask:
1. Open MetaMask
2. Click network dropdown
3. Select "Add Network"
4. Enter the above details

## 📱 Usage Guide

### Connecting Wallet
1. Click "Connect Wallet" button
2. Approve MetaMask connection
3. Ensure you're on Kasplex Testnet
4. You'll see your wallet address displayed

### Creating Tasks
1. Enter task description
2. Optionally set priority and category
3. Click "Create Task"
4. Confirm the blockchain transaction
5. Wait for confirmation

### Managing Tasks
- **Toggle Completion**: Click the circle button
- **Delete Task**: Click the trash icon
- **Filter Tasks**: Use the filter buttons
- **View Statistics**: Check the stats dashboard

## 🔧 Development

### Project Structure
```
decentralized-todo-app/
├── contracts/
│   └── TodoList.sol          # Smart contract
├── frontend/
│   ├── app/
│   │   ├── components/       # React components
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Main page
│   │   └── globals.css       # Global styles
│   ├── lib/
│   │   └── wagmi.ts          # Wagmi configuration
│   └── package.json
└── README.md
```

### Key Components
- `TodoApp.tsx` - Main application logic
- `TaskList.tsx` - Task listing component
- `TaskItem.tsx` - Individual task component
- `AddTaskForm.tsx` - Task creation form
- `TaskStats.tsx` - Statistics dashboard
- `TaskFilters.tsx` - Filter controls
- `WalletButton.tsx` - Wallet connection

### Smart Contract Events
```solidity
event TaskCreated(address indexed user, uint256 indexed taskId, string content, uint8 priority, bytes32 category)
event TaskToggled(address indexed user, uint256 indexed taskId, bool isCompleted)
event TaskUpdated(address indexed user, uint256 indexed taskId, string newContent)
event TaskDeleted(address indexed user, uint256 indexed taskId)
```

## 🧪 Testing

### Frontend Testing
```bash
npm run build          # Test build
npm run type-check     # TypeScript validation
npm run lint           # Linting
```

### Smart Contract Testing
Use Remix IDE:
1. Deploy to test environment
2. Test each function manually
3. Monitor events in console
4. Verify gas usage

## 🚀 Deployment

### Smart Contract Deployment
1. **Remix IDE Deployment**
   - Compile with optimization enabled
   - Deploy to Kasplex Testnet
   - Verify on block explorer
   - Save contract address

2. **Alternative: Hardhat Deployment**
   ```bash
   npx hardhat compile
   npx hardhat deploy --network kasplex-testnet
   ```

### Frontend Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel deploy
   ```

3. **Environment Variables**
   - Set `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

## 📊 Gas Optimization

The smart contract includes several gas optimizations:
- Custom errors instead of require strings
- Packed structs for storage efficiency
- uint32 for timestamps (sufficient until 2106)
- bytes32 for categories instead of strings
- Efficient array operations for task deletion

## 🛡️ Security Features

- Input validation for all functions
- Access control (users can only modify their tasks)
- Reentrancy protection
- Safe math operations
- Event logging for transparency

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abdullah Jabbar**
- GitHub: [@Abdullah-Jabbar](https://github.com/Abdullah-Jabbar)
- Email: abdullahjabbar.dev@gmail.com

## 🙏 Acknowledgments

- Ethereum Foundation for Web3 infrastructure
- OpenZeppelin for security best practices
- Wagmi team for excellent React hooks
- Next.js team for the amazing framework
- Tailwind CSS for utility-first styling

## 📞 Support

If you encounter any issues:
1. Check the [Issues](https://github.com/Abdullah-Jabbar/decentralized-todo-app/issues) page
2. Join our Discord community
3. Contact the development team

---

**Built with ❤️ for the Blockchain Hackathon Challenge**