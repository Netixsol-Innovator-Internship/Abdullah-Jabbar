"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import { CONTRACT_ADDRESSES, TOKEN_FAUCET_ABI } from "@/config/contract";
import { useWallet } from "@/context/WalletContext";
import { useAppSelector } from "@/store/hooks";
import { selectBalanceByAddress } from "@/store/selectors";
import { useRefreshBalances } from "@/hooks/useTokenData";
import { isContractAvailable, formatValueOrNA } from "@/utils/contractUtils";

export default function Home() {
  const { signer, account, isConnected } = useWallet();
  const { refreshBalances } = useRefreshBalances();

  // Get platform token balance from Redux
  const platformBalance = useAppSelector(
    selectBalanceByAddress(CONTRACT_ADDRESSES.PlatformToken)
  );

  const [claiming, setClaiming] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [timeUntilClaim, setTimeUntilClaim] = useState(0);
  const [totalClaimed, setTotalClaimed] = useState("0");
  const [claimAmount, setClaimAmount] = useState("0");
  const [faucetBalance, setFaucetBalance] = useState("0");
  const [contractsAvailable, setContractsAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isFaucetDeployed = isContractAvailable(CONTRACT_ADDRESSES.TokenFaucet);
  const isPlatformTokenDeployed = isContractAvailable(
    CONTRACT_ADDRESSES.PlatformToken
  );

  useEffect(() => {
    setContractsAvailable(isFaucetDeployed && isPlatformTokenDeployed);
  }, [isFaucetDeployed, isPlatformTokenDeployed]);

  useEffect(() => {
    if (signer && account && contractsAvailable) {
      void loadFaucetData();
      const interval = setInterval(() => void loadFaucetData(), 5000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, account, contractsAvailable]);

  const loadFaucetData = async () => {
    try {
      const faucetContract = new ethers.Contract(
        CONTRACT_ADDRESSES.TokenFaucet,
        TOKEN_FAUCET_ABI,
        signer!
      );

      const canClaimNow = await faucetContract.canClaim(account);
      setCanClaim(canClaimNow);

      if (!canClaimNow) {
        const time = await faucetContract.getTimeUntilNextClaim(account);
        setTimeUntilClaim(Number(time));
      } else {
        setTimeUntilClaim(0);
      }

      const claimed = await faucetContract.getTotalClaimed(account);
      setTotalClaimed(ethers.formatEther(claimed));

      const amount = await faucetContract.claimAmount();
      setClaimAmount(ethers.formatEther(amount));

      const faucetBal = await faucetContract.getFaucetBalance();
      setFaucetBalance(ethers.formatEther(faucetBal));
    } catch (error) {
      console.error("Error loading faucet data:", error);
    }
  };

  const handleRefresh = async () => {
    if (!isConnected) return;
    setRefreshing(true);
    try {
      await refreshBalances();
      if (contractsAvailable) {
        await loadFaucetData();
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      // Delay to allow animation to complete (1.5s for 3 spins)
      setTimeout(() => setRefreshing(false), 1500);
    }
  };

  const handleClaimTokens = async () => {
    try {
      setClaiming(true);

      const faucetContract = new ethers.Contract(
        CONTRACT_ADDRESSES.TokenFaucet,
        TOKEN_FAUCET_ABI,
        signer!
      );

      const tx = await faucetContract.claimTokens();
      console.log("Transaction sent:", tx.hash);

      await tx.wait();
      console.log("Transaction confirmed!");

      alert("Tokens claimed successfully! 🎉");

      // Refresh balance from Redux store
      await refreshBalances();
      await loadFaucetData();
    } catch (error) {
      console.error("Error claiming tokens:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert("Failed to claim tokens: " + errorMessage);
    } finally {
      setClaiming(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  if (!isConnected) {
    return (
      <div className="connect-prompt">
        <div className="connect-card">
          <h1>👋 Welcome to DeFi + NFT Ecosystem</h1>
          <p>Connect your MetaMask wallet to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-row">
          <h1>💧 Token Faucet</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing || !isConnected}
            className="btn-refresh-page"
            title="Refresh data"
          >
            <Image
              src="/refresh.svg"
              alt="Refresh"
              width={24}
              height={24}
              className={refreshing ? "spinning" : ""}
            />
          </button>
        </div>
        <p>Claim free CLAW tokens every 24 hours</p>
      </div>

      <div className="card-grid">
        <div className="card claim-card">
          <h2>Claim Tokens</h2>
          <div className="claim-amount">
            <span className="amount">
              {formatValueOrNA(claimAmount, 2, contractsAvailable)}
            </span>
            <span className="token-symbol">
              {contractsAvailable ? "CLAW" : "N/A"}
            </span>
          </div>

          {canClaim && contractsAvailable ? (
            <button
              onClick={handleClaimTokens}
              disabled={claiming}
              className="btn-primary btn-large"
            >
              {claiming ? "Claiming..." : "🎁 Claim Tokens"}
            </button>
          ) : (
            <div className="cooldown-info">
              <p className="cooldown-text">⏰ Next claim available in:</p>
              {contractsAvailable && (
                <p className="cooldown-timer">{formatTime(timeUntilClaim)}</p>
              )}
            </div>
          )}
        </div>

        <div className="card stats-card">
          <h2>Your Statistics</h2>
          <div className="stat-row">
            <span className="stat-label">Your Balance:</span>
            <span className="stat-value">
              {formatValueOrNA(
                platformBalance
                  ? parseFloat(platformBalance.formattedBalance)
                  : 0,
                4,
                contractsAvailable
              )}{" "}
              {contractsAvailable ? "CLAW" : "N/A"}
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Total Claimed:</span>
            <span className="stat-value">
              {formatValueOrNA(
                parseFloat(totalClaimed).toFixed(2),
                2,
                contractsAvailable
              )}{" "}
              {contractsAvailable ? "CLAW" : "N/A"}
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Faucet Balance:</span>
            <span className="stat-value">
              {formatValueOrNA(
                parseFloat(faucetBalance).toFixed(2),
                2,
                contractsAvailable
              )}{" "}
              {contractsAvailable ? "CLAW" : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>ℹ️ How it works</h3>
        <ul>
          <li>
            Click &quot;Claim Tokens&quot; to receive{" "}
            {formatValueOrNA(claimAmount, 2, contractsAvailable)}{" "}
            {contractsAvailable ? "CLAW" : "N/A"} tokens
          </li>
          <li>You can claim once every 24 hours</li>
          <li>Use CLAW tokens to trade on the DEX or buy NFTs</li>
          <li>Free tokens for testing the platform!</li>
        </ul>
      </div>
    </div>
  );
}
