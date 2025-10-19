import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";

export const useWalletConnection = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [hasTriedConnection, setHasTriedConnection] = useState(false);

  // Get MetaMask connector specifically
  const metaMaskConnector = connectors.find(
    (connector) =>
      connector.name.toLowerCase().includes("metamask") ||
      connector.id === "metaMask"
  );

  // Prevent auto-connection on page load
  useEffect(() => {
    if (!hasTriedConnection) {
      setHasTriedConnection(true);
    }
  }, [hasTriedConnection]);

  const connectToMetaMask = async () => {
    if (metaMaskConnector) {
      try {
        await connect({ connector: metaMaskConnector });
      } catch (error) {
        console.error("Failed to connect to MetaMask:", error);
      }
    } else {
      console.error("MetaMask connector not found");
      // Try to connect with the first available connector
      if (connectors.length > 0) {
        await connect({ connector: connectors[0] });
      }
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return {
    address,
    isConnected,
    isConnecting,
    connectToMetaMask,
    disconnectWallet,
    metaMaskConnector,
    hasTriedConnection,
  };
};
