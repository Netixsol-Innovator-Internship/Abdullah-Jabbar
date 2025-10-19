import { createConfig, http } from "wagmi";
import { metaMask, injected } from "wagmi/connectors";
import { defineChain } from "viem";

export const kasplexTestnet = defineChain({
  id: 167012,
  name: "Kasplex Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Kasplex",
    symbol: "KAS",
  },
  rpcUrls: {
    default: { http: ["https://rpc.kasplextest.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Kasplex Explorer",
      url: "https://explorer.testnet.kasplextest.xyz",
    },
  },
  testnet: true,
});

export const sepolia = defineChain({
  id: 11_155_111,
  name: "Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Sepolia Ether",
    symbol: "SEP",
  },
  rpcUrls: {
    default: { http: ["https://rpc.sepolia.org"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [kasplexTestnet, sepolia],
  connectors: [
    metaMask({
      dappMetadata: {
        name: "Planer's Mint",
        url:
          typeof window !== "undefined"
            ? window.location.origin
            : "https://your-domain.com",
      },
    }),
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [kasplexTestnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export const chains = [kasplexTestnet, sepolia];
