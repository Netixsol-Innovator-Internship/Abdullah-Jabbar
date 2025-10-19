"use client";

import { useState } from "react";
import SwapInterface from "../../components/SwapInterface";
import LiquidityPool from "../../components/LiquidityPool";
import PriceDisplay from "../../components/PriceDisplay";
import Navigation from "../../components/Navigation";
import MetaMaskConnectButton from "../../components/MetaMaskConnectButton";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Coins } from "lucide-react";

export default function DEXPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { isConnected } = useAccount();

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
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

            {/* Centered Navigation */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Navigation />
            </div>

            {/* Wallet Connect */}
            <div>
              {isConnected ? (
                <ConnectButton />
              ) : (
                <MetaMaskConnectButton className="text-sm px-4 py-2" />
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="py-6 lg:py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3">
              CLAW-TIGER DEX
            </h1>
            <p className="text-base lg:text-lg text-gray-600">
              Decentralized exchange for CLAW and TIGER tokens
            </p>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Main Content - Swap Interface */}
            <div className="space-y-6">
              <SwapInterface onSwapComplete={handleRefresh} />

              {/* Swap Instructions */}
              <div className="bg-white rounded-xl shadow-lg p-5 lg:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  How to Swap
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="flex items-start space-x-3 bg-blue-50 p-3 rounded-lg">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </span>
                    <p className="text-sm text-gray-700">
                      Connect wallet with CLAW or TIGER tokens
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 bg-green-50 p-3 rounded-lg">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </span>
                    <p className="text-sm text-gray-700">
                      Enter amount to swap
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 bg-indigo-50 p-3 rounded-lg">
                    <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </span>
                    <p className="text-sm text-gray-700">
                      Review rate & impact
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 bg-cyan-50 p-3 rounded-lg">
                    <span className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      4
                    </span>
                    <p className="text-sm text-gray-700">
                      Approve & execute swap
                    </p>
                  </div>
                </div>
              </div>

              {/* DEX Features */}
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 rounded-xl shadow-lg p-5 lg:p-6 text-white">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  DEX Features
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span className="text-sm">0.3% trading fee</span>
                  </li>
                  <li className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span className="text-sm">Constant product AMM</span>
                  </li>
                  <li className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span className="text-sm">Slippage protection</span>
                  </li>
                  <li className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span className="text-sm">LP token rewards</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sidebar - Price & Pool Info */}
            <div className="space-y-6">
              {/* Price Display */}
              <PriceDisplay key={`price-${refreshKey}`} />

              {/* Liquidity Pool Information */}
              <LiquidityPool key={`liquidity-${refreshKey}`} />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-10 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-300">
            <p className="text-gray-600 text-sm lg:text-base">
              CLAW-TIGER DEX - A decentralized exchange built with smart
              contracts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
