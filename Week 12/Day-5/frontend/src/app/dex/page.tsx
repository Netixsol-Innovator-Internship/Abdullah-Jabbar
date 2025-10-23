"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  CONTRACT_ADDRESSES,
  MULTI_TOKEN_DEX_ABI,
  PLATFORM_TOKEN_ABI,
} from "@/config/contract";
import { useWallet } from "@/context/WalletContext";
import { useI18n } from "@/i18n/i18nContext";
import { useAppSelector } from "@/store/hooks";
import {
  selectAllBalances,
  selectTokensList,
  selectPoolReserve,
} from "@/store/selectors";
import { useRefreshBalances, useRefreshPools } from "@/hooks/useTokenData";
import { calculateSwapOutput } from "@/utils/dexService";
import { isContractAvailable, formatValueOrNA } from "@/utils/contractUtils";
import { sanitizeNumericInput } from "@/utils/validation";
import LPTokenDisplay from "@/components/LPTokenDisplay";
import PriceChart from "@/components/PriceChart";
import SlippageSelector from "@/components/SlippageSelector";
import RefreshButton from "@/components/RefreshButton";

export default function DEX() {
  const { signer, account, isConnected } = useWallet();
  const { t } = useI18n();
  const { refreshBalances } = useRefreshBalances();
  const { refreshPools } = useRefreshPools();

  // Get data from Redux store
  const balances = useAppSelector(selectAllBalances);
  const tokens = useAppSelector(selectTokensList);

  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [amountIn, setAmountIn] = useState("");
  const [slippage, setSlippage] = useState(1.0); // Default 1% slippage
  const [swapping, setSwapping] = useState(false);
  const [amountError, setAmountError] = useState("");

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
    await Promise.all([refreshBalances(), refreshPools()]);
  };

  // Input validation and handling
  const handleAmountChange = (value: string) => {
    // Sanitize input
    const sanitized = sanitizeNumericInput(value);

    // Get token info and balance
    const tokenInInfo = tokens.find((t) => t.address === tokenIn);
    const tokenInBalance = balances[tokenIn];

    // Auto-reduce if exceeds balance
    let finalAmount = sanitized;
    if (
      tokenInBalance &&
      sanitized &&
      parseFloat(sanitized) > parseFloat(tokenInBalance.formattedBalance)
    ) {
      finalAmount = tokenInBalance.formattedBalance;
    }

    setAmountIn(finalAmount);

    // Clear previous error
    setAmountError("");

    // Show warnings but don't block input for minor issues
    if (finalAmount) {
      if (tokenInInfo && tokenInBalance) {
        const amountNum = parseFloat(finalAmount);
        const balanceNum = parseFloat(tokenInBalance.formattedBalance);

        // Only show warnings, don't block input
        if (amountNum <= 0) {
          setAmountError(t("validation.mustBeGreaterThanZero"));
        } else if (amountNum < 0.000001) {
          setAmountError(t("dex.minimumAmount"));
        } else if (amountNum > balanceNum) {
          setAmountError(
            t("validation.insufficientBalance")
              .replace("{token}", tokenInInfo.symbol)
              .replace("{balance}", balanceNum.toFixed(6))
          );
        }
      }
    }
  };

  const canSwap = (): boolean => {
    if (!amountIn || !tokenIn || !tokenOut) return false;

    const tokenInBalance = balances[tokenIn];
    if (!tokenInBalance) return false;

    const amountNum = parseFloat(amountIn);
    const balanceNum = parseFloat(tokenInBalance.formattedBalance);

    // Only prevent swap for critical issues
    return amountNum > 0 && amountNum >= 0.000001 && amountNum <= balanceNum;
  };

  const handleSwap = async () => {
    try {
      // Final validation before swap
      if (!canSwap()) {
        alert(t("dex.enterValidAmount"));
        return;
      }

      if (!signer || !account) {
        alert(t("dex.connectWalletFirst"));
        return;
      }

      setSwapping(true);

      console.log(`Using slippage tolerance: ${slippage}%`);

      const tokenInContract = new ethers.Contract(
        tokenIn,
        PLATFORM_TOKEN_ABI,
        signer
      );

      const amountInWei = ethers.parseEther(amountIn);

      console.log(t("dex.approving"));
      const approveTx = await tokenInContract.approve(
        CONTRACT_ADDRESSES.MultiTokenDEX,
        amountInWei
      );
      await approveTx.wait();

      console.log(t("dex.performing"));
      const dexContract = new ethers.Contract(
        CONTRACT_ADDRESSES.MultiTokenDEX,
        MULTI_TOKEN_DEX_ABI,
        signer
      );

      // Use the slippage tolerance set by the user for minimum output
      const minAmountOut = ethers.parseEther(
        (parseFloat(amountOut) * (1 - slippage / 100)).toFixed(18)
      );

      console.log(`Swapping with ${slippage}% slippage tolerance`);
      const swapTx = await dexContract.swap(
        tokenIn,
        tokenOut,
        amountInWei,
        minAmountOut
      );
      await swapTx.wait();

      alert(t("dex.swapSuccess"));
      setAmountIn("");

      // Refresh data after swap
      await refreshBalances();
      await refreshPools();
    } catch (error) {
      console.error("Error swapping:", error);
      alert(t("dex.swapFailed"));
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
          <h1>{t("dex.connectWallet")}</h1>
          <p>{t("dex.connectMessage")}</p>
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
          <h1>{t("dex.tokenSwap")}</h1>
          <RefreshButton
            onRefresh={handleRefresh}
            disabled={!isConnected}
            title={t("dex.refresh")}
          />
        </div>
        <p>{t("dex.tradeInstantly")}</p>
      </div>

      <div className="card swap-card">
        <div className="swap-container">
          {/* Token In Section */}
          <div className="swap-section">
            <div className="swap-header">
              <span>{t("dex.from")}</span>
              <span className="balance">
                {t("dex.balance")}:{" "}
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
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder={t("dex.placeholder")}
                className={`swap-input ${amountError ? "warning" : ""}`}
                min="0"
                step="0.000001"
              />
              <div className="token-select-row">
                <button onClick={handleMaxAmount} className="max-btn">
                  {t("dex.max")}
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
                      {contractsAvailable
                        ? token.symbol
                        : t("dex.notAvailable")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {amountError && (
              <div className="input-warning-message">⚠️ {amountError}</div>
            )}
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
              <span>{t("dex.to")}</span>
              <span className="balance">
                {t("dex.balance")}:{" "}
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
                placeholder={t("dex.placeholder")}
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
                    {contractsAvailable ? token.symbol : t("dex.notAvailable")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slippage Selector */}
          <SlippageSelector
            slippage={slippage}
            onSlippageChange={setSlippage}
          />

          {/* Swap Details */}
          {amountIn && parseFloat(amountIn) > 0 && (
            <div className="swap-details">
              <div className="detail-row">
                <span>{t("dex.price")}</span>
                <span>
                  1{" "}
                  {contractsAvailable
                    ? tokenInInfo?.symbol
                    : t("dex.notAvailable")}{" "}
                  = {contractsAvailable ? price : t("dex.notAvailable")}{" "}
                  {contractsAvailable
                    ? tokenOutInfo?.symbol
                    : t("dex.notAvailable")}
                </span>
              </div>
              <div className="detail-row">
                <span>{t("dex.liquidityPool")}</span>
                <span>
                  {formatValueOrNA(
                    parseFloat(reserveIn),
                    2,
                    contractsAvailable
                  )}{" "}
                  {contractsAvailable
                    ? tokenInInfo?.symbol
                    : t("dex.notAvailable")}{" "}
                  /{" "}
                  {formatValueOrNA(
                    parseFloat(reserveOut),
                    2,
                    contractsAvailable
                  )}{" "}
                  {contractsAvailable
                    ? tokenOutInfo?.symbol
                    : t("dex.notAvailable")}
                </span>
              </div>
              <div className="detail-row">
                <span>{t("dex.slippage")}</span>
                <span>{slippage}%</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <button
            onClick={() => void handleSwap()}
            disabled={
              !contractsAvailable ||
              swapping ||
              !canSwap() ||
              parseFloat(amountOut) <= 0
            }
            className="swap-btn"
          >
            {swapping ? t("common.loading") : t("dex.swapTokens")}
          </button>
        </div>
      </div>

      {/* Price Chart */}
      <div className="card mt-8">
        <PriceChart
          tokenA={
            contractsAvailable ? tokenInInfo?.symbol || "Token A" : "Token A"
          }
          tokenB={
            contractsAvailable ? tokenOutInfo?.symbol || "Token B" : "Token B"
          }
          currentPrice={price ? parseFloat(price) : 0}
        />
      </div>

      {/* Pool Information */}
      <div className="card info-card">
        <h3>{t("dex.liquidityPools")}</h3>
        <p className="info-text">
          {t("dex.currentPoolReserves")}{" "}
          {contractsAvailable ? tokenInInfo?.symbol : t("dex.notAvailable")} /{" "}
          {contractsAvailable ? tokenOutInfo?.symbol : t("dex.notAvailable")}
        </p>
        <div className="pool-stats">
          <div className="pool-stat">
            <span className="stat-label">
              {contractsAvailable ? tokenInInfo?.symbol : t("dex.notAvailable")}{" "}
              {t("dex.reserve")}
            </span>
            <span className="stat-value">
              {formatValueOrNA(parseFloat(reserveIn), 2, contractsAvailable)}
            </span>
          </div>
          <div className="pool-stat">
            <span className="stat-label">
              {contractsAvailable
                ? tokenOutInfo?.symbol
                : t("dex.notAvailable")}{" "}
              {t("dex.reserve")}
            </span>
            <span className="stat-value">
              {formatValueOrNA(parseFloat(reserveOut), 2, contractsAvailable)}
            </span>
          </div>
        </div>
      </div>

      {/* LP Tokens Display */}
      {isConnected && (
        <div className="mt-8">
          <LPTokenDisplay />
        </div>
      )}
    </div>
  );
}
