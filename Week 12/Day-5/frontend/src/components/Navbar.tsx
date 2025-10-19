"use client";

import Link from "next/link";
import { useWallet } from "@/context/WalletContext";

export default function Navbar() {
  const { account, isConnected, connectWallet, disconnectWallet } = useWallet();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h2 className="nav-brand-title">Planer's Mint</h2>
        </div>

        <div className="nav-links">
          <Link href="/">Faucet</Link>
          <Link href="/dex">DEX</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/portfolio">Portfolio</Link>
        </div>

        <div className="nav-wallet">
          {isConnected ? (
            <div className="wallet-info">
              <span className="wallet-address">
                {account.substring(0, 6)}...{account.substring(38)}
              </span>
              <button onClick={disconnectWallet} className="btn-disconnect">
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={connectWallet} className="btn-connect">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
