"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { useState, useEffect } from "react";
import { TodoApp } from "../components/TodoApp";
import { WalletButton } from "../components/WalletButton";
import { Header } from "../components/Header";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function Home() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSpinner />;
  }

  const handleConnect = () => {
    connect({ connector: metaMask() });
  };

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <Header />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🚀 Decentralized Todo List
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your tasks on the blockchain with complete decentralization
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <WalletButton
              isConnected={isConnected}
              isConnecting={isConnecting}
              address={address}
              onConnect={handleConnect}
              onDisconnect={() => disconnect()}
            />
          </div>

          {isConnected && address ? (
            <TodoApp userAddress={address} />
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔗</div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Connect your MetaMask wallet to start creating and managing your
                decentralized tasks. Make sure you&apos;re connected to the
                Kasplex Testnet.
              </p>
            </div>
          )}
        </div>

        <footer className="text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>
            Built with ❤️ by Abdullah Jabbar
          </p>
         
        </footer>
      </div>
    </main>
  );
}
