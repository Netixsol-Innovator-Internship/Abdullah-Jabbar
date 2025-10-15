// Contract configuration
export const CONTRACT_CONFIG = {
  // Replace with your deployed contract address
  address: "0xd9a69f11159Fb9fB2b6A60f8ce926618543303C5" as `0x${string}`,

  // Contract ABI from Remix
  abi: [
    {
      inputs: [],
      name: "clearAllTasks",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_content",
          type: "string",
        },
        {
          internalType: "uint8",
          name: "_priority",
          type: "uint8",
        },
        {
          internalType: "string",
          name: "_category",
          type: "string",
        },
      ],
      name: "createTask",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_taskId",
          type: "uint256",
        },
      ],
      name: "deleteTask",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "EmptyTaskContent",
      type: "error",
    },
    {
      inputs: [],
      name: "TaskAlreadyCompleted",
      type: "error",
    },
    {
      inputs: [],
      name: "TaskNotCompleted",
      type: "error",
    },
    {
      inputs: [],
      name: "TaskNotFound",
      type: "error",
    },
    {
      inputs: [],
      name: "UnauthorizedAccess",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "taskId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "content",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint8",
          name: "priority",
          type: "uint8",
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "category",
          type: "bytes32",
        },
      ],
      name: "TaskCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "taskId",
          type: "uint256",
        },
      ],
      name: "TaskDeleted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "taskId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "isCompleted",
          type: "bool",
        },
      ],
      name: "TaskToggled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "taskId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "newContent",
          type: "string",
        },
      ],
      name: "TaskUpdated",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_taskId",
          type: "uint256",
        },
      ],
      name: "toggleTask",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_taskId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_newContent",
          type: "string",
        },
      ],
      name: "updateTask",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_bytes32",
          type: "bytes32",
        },
      ],
      name: "bytes32ToString",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllTasks",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "content",
              type: "string",
            },
            {
              internalType: "bool",
              name: "isCompleted",
              type: "bool",
            },
            {
              internalType: "uint32",
              name: "createdAt",
              type: "uint32",
            },
            {
              internalType: "uint8",
              name: "priority",
              type: "uint8",
            },
            {
              internalType: "bytes32",
              name: "category",
              type: "bytes32",
            },
          ],
          internalType: "struct TodoList.Task[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_taskId",
          type: "uint256",
        },
      ],
      name: "getTask",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "content",
              type: "string",
            },
            {
              internalType: "bool",
              name: "isCompleted",
              type: "bool",
            },
            {
              internalType: "uint32",
              name: "createdAt",
              type: "uint32",
            },
            {
              internalType: "uint8",
              name: "priority",
              type: "uint8",
            },
            {
              internalType: "bytes32",
              name: "category",
              type: "bytes32",
            },
          ],
          internalType: "struct TodoList.Task",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint8",
          name: "_priority",
          type: "uint8",
        },
      ],
      name: "getTasksByPriority",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "content",
              type: "string",
            },
            {
              internalType: "bool",
              name: "isCompleted",
              type: "bool",
            },
            {
              internalType: "uint32",
              name: "createdAt",
              type: "uint32",
            },
            {
              internalType: "uint8",
              name: "priority",
              type: "uint8",
            },
            {
              internalType: "bytes32",
              name: "category",
              type: "bytes32",
            },
          ],
          internalType: "struct TodoList.Task[]",
          name: "",
          type: "tuple[]",
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "_completed",
          type: "bool",
        },
      ],
      name: "getTasksByStatus",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "content",
              type: "string",
            },
            {
              internalType: "bool",
              name: "isCompleted",
              type: "bool",
            },
            {
              internalType: "uint32",
              name: "createdAt",
              type: "uint32",
            },
            {
              internalType: "uint8",
              name: "priority",
              type: "uint8",
            },
            {
              internalType: "bytes32",
              name: "category",
              type: "bytes32",
            },
          ],
          internalType: "struct TodoList.Task[]",
          name: "",
          type: "tuple[]",
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getTaskStats",
      outputs: [
        {
          internalType: "uint256",
          name: "total",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "completed",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "pending",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "taskCounts",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const,
} as const;

// Chain configuration
export const CHAIN_CONFIG = {
  // You can add different chain configurations here
  sepolia: {
    id: 11155111,
    name: "Sepolia",
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    blockExplorer: "https://sepolia.etherscan.io",
  },
  localhost: {
    id: 31337,
    name: "Localhost",
    rpcUrl: "http://127.0.0.1:8545",
    blockExplorer: "",
  },
};
