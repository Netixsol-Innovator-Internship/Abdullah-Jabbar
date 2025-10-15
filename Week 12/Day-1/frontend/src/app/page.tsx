"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import TokenInfo from "@/components/TokenInfo";
import TransferTokens from "@/components/TransferTokens";
import BurnTokens from "@/components/BurnTokens";
import ApproveTokens from "@/components/ApproveTokens";
import AdminPanel from "@/components/AdminPanel";
import MetaMaskConnectButton from "@/components/MetaMaskConnectButton";
import { Coins } from "lucide-react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering connection-dependent content until mounted
  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Claw Token</h1>
                  <p className="text-sm text-slate-400">Advanced ERC-20 DApp</p>
                </div>
              </div>
              {hasMounted && isConnected ? (
                <ConnectButton />
              ) : (
                <MetaMaskConnectButton className="text-sm px-4 py-2" />
              )}
            </div>
          </div>
        </header>

        {/* Main Content - Loading state */}
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center max-w-md">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl w-20 h-20 mx-auto mb-6">
                <Coins className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome to Claw Token
              </h2>
              <p className="text-slate-300 mb-8">Loading...</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-slate-400 text-sm">
              <p>Claw Token - Advanced ERC-20 with Race Condition Protection</p>
              <p className="mt-1">Built with Next.js, RainbowKit, and Wagmi</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Claw Token</h1>
                <p className="text-sm text-slate-400">Advanced ERC-20 DApp</p>
              </div>
            </div>
            {hasMounted && isConnected ? (
              <ConnectButton />
            ) : (
              <MetaMaskConnectButton className="text-sm px-4 py-2" />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center max-w-md">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl w-20 h-20 mx-auto mb-6">
                <Coins className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome to Claw Token
              </h2>
              <p className="text-slate-300 mb-8">
                Connect your wallet to interact with the Claw Token smart
                contract. Experience advanced features including tax system,
                snapshots, and more.
              </p>
              <div className="flex justify-center">
                <MetaMaskConnectButton />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Token Info */}
            <TokenInfo />

            {/* User Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TransferTokens />
              <BurnTokens />
              <ApproveTokens />
            </div>

            {/* Admin Panel */}
            <AdminPanel userAddress={address} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-slate-400 text-sm">
            <p>Claw Token - Advanced ERC-20 with Race Condition Protection</p>
            <p className="mt-1">Built with Next.js, RainbowKit, and Wagmi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
