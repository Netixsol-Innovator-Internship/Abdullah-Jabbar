"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState } from "react";

interface MetaMaskConnectButtonProps {
  className?: string;
}

export default function MetaMaskConnectButton({
  className = "",
}: MetaMaskConnectButtonProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  // Get MetaMask connector specifically
  const metaMaskConnector = connectors.find(
    (connector) =>
      connector.name.toLowerCase().includes("metamask") ||
      connector.id === "metaMask" ||
      connector.type === "metaMask"
  );

  const handleConnect = async () => {
    if (isConnected) {
      await disconnect();
      return;
    }

    setIsConnecting(true);
    try {
      if (metaMaskConnector) {
        await connect({ connector: metaMaskConnector });
      } else {
        // Fallback to first available connector
        if (connectors.length > 0) {
          await connect({ connector: connectors[0] });
        } else {
          alert("No wallet connectors available. Please install MetaMask.");
        }
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert(
        "Failed to connect wallet. Please make sure MetaMask is installed and try again."
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const getButtonText = () => {
    if (isConnecting || isPending) return "Connecting...";
    if (isConnected)
      return `Disconnect ${address?.slice(0, 6)}...${address?.slice(-4)}`;
    return "Connect to MetaMask";
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting || isPending}
      className={`
        px-6 py-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer
        ${
          isConnected
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        }
        ${isConnecting || isPending ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
        ${className}
      `}
    >
      {getButtonText()}
    </button>
  );
}
