"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import {
  CONTRACT_ADDRESSES,
  MULTI_TOKEN_DEX_ABI,
  PLATFORM_TOKEN_ABI,
} from "@/config/contract";
import { useWallet } from "@/context/WalletContext";
import { useAppSelector } from "@/store/hooks";
import {
  selectAllBalances,
  selectTokensList,
  selectPoolReserve,
} from "@/store/selectors";
import { useRefreshBalances, useRefreshPools } from "@/hooks/useTokenData";
import { calculateSwapOutput } from "@/utils/dexService";
import { isContractAvailable, formatValueOrNA } from "@/utils/contractUtils";

export default function DEX() {
  const { signer, account, isConnected } = useWallet();
  const { refreshBalances } = useRefreshBalances();
  const { refreshPools } = useRefreshPools();

  // Get data from Redux store
  const balances = useAppSelector(selectAllBalances);
  const tokens = useAppSelector(selectTokensList);

  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [amountIn, setAmountIn] = useState("");
  const [swapping, setSwapping] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Get pool reserve from Redux
  const poolReserve = useAppSelector(selectPoolReserve(tokenIn, tokenOut));

  const reserveIn = poolReserve?.reserveA || "0";
  const reserveOut = poolReserve?.reserveB || "0";
  const price = poolReserve?.price || "0";

  // Calculate output amount
  const amountOut = calculateSwapOutput(amountIn, reserveIn, reserveOut);

  const isDexDeployed = isContractAvailable(CONTRACT_ADDRESSES.MultiTokenDEX);
  const areTokensDeployed = tokens.every((t) => isContractAvailable(t.address));
  const contractsAvailable = isDexDeployed && areTokensDeployed;

  // Initialize token selection
  useEffect(() => {
    if (tokens.length >= 2 && !tokenIn && !tokenOut) {
      setTokenIn(tokens[0].address);
      setTokenOut(tokens[1].address);
    }
  }, [tokens, tokenIn, tokenOut]);

  const handleRefresh = async () => {
    if (!isConnected) return;
    setRefreshing(true);
    try {
      await Promise.all([refreshBalances(), refreshPools()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      // Delay to allow animation to complete (1.5s for 3 spins)
      setTimeout(() => setRefreshing(false), 1500);
    }
  };

  const handleSwap = async () => {
    try {
      if (!amountIn || parseFloat(amountIn) <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      if (!signer || !account) {
        alert("Please connect your wallet");
        return;
      }

      setSwapping(true);

      const tokenInContract = new ethers.Contract(
        tokenIn,
        PLATFORM_TOKEN_ABI,
        signer
      );

      const amountInWei = ethers.parseEther(amountIn);

      console.log("Approving tokens...");
      const approveTx = await tokenInContract.approve(
        CONTRACT_ADDRESSES.MultiTokenDEX,
        amountInWei
      );
      await approveTx.wait();

      console.log("Performing swap...");
      const dexContract = new ethers.Contract(
        CONTRACT_ADDRESSES.MultiTokenDEX,
        MULTI_TOKEN_DEX_ABI,
        signer
      );

      const minAmountOut = ethers.parseEther(
        (parseFloat(amountOut) * 0.95).toFixed(18)
      );

      const swapTx = await dexContract.swap(
        tokenIn,
        tokenOut,
        amountInWei,
        minAmountOut
      );
      await swapTx.wait();

      alert("Swap successful!");
      setAmountIn("");

      // Refresh data after swap
      await refreshBalances();
      await refreshPools();
    } catch (error) {
      console.error("Error swapping:", error);
      alert("Swap failed. Please try again.");
    } finally {
      setSwapping(false);
    }
  };

  const handleSwitchTokens = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
  };

  const handleMaxAmount = () => {
    const balance = balances[tokenIn];
    if (balance) {
      setAmountIn(balance.formattedBalance);
    }
  };

  if (!isConnected) {
    return (
      <div className="connect-prompt">
        <div className="connect-card">
          <h1>👋 Connect your wallet</h1>
          <p>Please connect MetaMask to use the DEX</p>
        </div>
      </div>
    );
  }

  const tokenInInfo = tokens.find((t) => t.address === tokenIn);
  const tokenOutInfo = tokens.find((t) => t.address === tokenOut);
  const tokenInBalance = balances[tokenIn];
  const tokenOutBalance = balances[tokenOut];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-row">
          <h1>🔄 Token Swap</h1>
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
        <p>Trade tokens instantly</p>
      </div>

      <div className="card swap-card">
        <div className="swap-container">
          {/* Token In Section */}
          <div className="swap-section">
            <div className="swap-header">
              <span>From</span>
              <span className="balance">
                Balance:{" "}
                {formatValueOrNA(
                  tokenInBalance
                    ? parseFloat(tokenInBalance.formattedBalance)
                    : 0,
                  4,
                  contractsAvailable
                )}
              </span>
            </div>
            <div className="swap-input-row">
              <input
                type="number"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                placeholder="0.0"
                className="swap-input"
              />
              <div className="token-select-row">
                <button onClick={handleMaxAmount} className="max-btn">
                  MAX
                </button>
                <select
                  value={tokenIn}
                  onChange={(e) => setTokenIn(e.target.value)}
                  className="token-select"
                >
                  {tokens.map((token) => (
                    <option
                      key={`${token.address}-${token.symbol}`}
                      value={token.address}
                    >
                      {contractsAvailable ? token.symbol : "N/A"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Switch Button */}
          <div className="switch-container">
            <button
              onClick={handleSwitchTokens}
              className="switch-btn"
              disabled={swapping}
            >
              ⇅
            </button>
          </div>

          {/* Token Out Section */}
          <div className="swap-section">
            <div className="swap-header">
              <span>To</span>
              <span className="balance">
                Balance:{" "}
                {formatValueOrNA(
                  tokenOutBalance
                    ? parseFloat(tokenOutBalance.formattedBalance)
                    : 0,
                  4,
                  contractsAvailable
                )}
              </span>
            </div>
            <div className="swap-input-row">
              <input
                type="number"
                value={amountOut}
                readOnly
                placeholder="0.0"
                className="swap-input"
              />
              <select
                value={tokenOut}
                onChange={(e) => setTokenOut(e.target.value)}
                className="token-select"
              >
                {tokens.map((token) => (
                  <option
                    key={`${token.address}-${token.symbol}`}
                    value={token.address}
                  >
                    {contractsAvailable ? token.symbol : "N/A"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Details */}
          {amountIn && parseFloat(amountIn) > 0 && (
            <div className="swap-details">
              <div className="detail-row">
                <span>Price</span>
                <span>
                  1 {contractsAvailable ? tokenInInfo?.symbol : "N/A"} ={" "}
                  {contractsAvailable ? price : "N/A"}{" "}
                  {contractsAvailable ? tokenOutInfo?.symbol : "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span>Pool Liquidity</span>
                <span>
                  {formatValueOrNA(
                    parseFloat(reserveIn),
                    2,
                    contractsAvailable
                  )}{" "}
                  {contractsAvailable ? tokenInInfo?.symbol : "N/A"} /{" "}
                  {formatValueOrNA(
                    parseFloat(reserveOut),
                    2,
                    contractsAvailable
                  )}{" "}
                  {contractsAvailable ? tokenOutInfo?.symbol : "N/A"}
                </span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <button
            onClick={() => void handleSwap()}
            disabled={
              !contractsAvailable ||
              swapping ||
              !amountIn ||
              parseFloat(amountIn) <= 0 ||
              parseFloat(amountOut) <= 0
            }
            className="swap-btn"
          >
            {swapping ? "Swapping..." : "Swap"}
          </button>
        </div>
      </div>

      {/* Pool Information */}
      <div className="card info-card">
        <h3>💧 Liquidity Pools</h3>
        <p className="info-text">
          Current pool reserves for{" "}
          {contractsAvailable ? tokenInInfo?.symbol : "N/A"} /{" "}
          {contractsAvailable ? tokenOutInfo?.symbol : "N/A"}
        </p>
        <div className="pool-stats">
          <div className="pool-stat">
            <span className="stat-label">
              {contractsAvailable ? tokenInInfo?.symbol : "N/A"} Reserve
            </span>
            <span className="stat-value">
              {formatValueOrNA(parseFloat(reserveIn), 2, contractsAvailable)}
            </span>
          </div>
          <div className="pool-stat">
            <span className="stat-label">
              {contractsAvailable ? tokenOutInfo?.symbol : "N/A"} Reserve
            </span>
            <span className="stat-value">
              {formatValueOrNA(parseFloat(reserveOut), 2, contractsAvailable)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
