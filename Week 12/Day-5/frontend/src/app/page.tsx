"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, TOKEN_FAUCET_ABI } from "@/config/contract";
import { useWallet } from "@/context/WalletContext";
import { useI18n } from "@/i18n/i18nContext";
import { useAppSelector } from "@/store/hooks";
import { selectBalanceByAddress } from "@/store/selectors";
import { useRefreshBalances } from "@/hooks/useTokenData";
import { isContractAvailable, formatValueOrNA } from "@/utils/contractUtils";
import RefreshButton from "@/components/RefreshButton";

export default function Home() {
  const { signer, account, isConnected } = useWallet();
  const { t } = useI18n();
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
    await refreshBalances();
    if (contractsAvailable) {
      await loadFaucetData();
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

      alert(t("faucet.claimSuccess"));

      // Refresh balance from Redux store
      await refreshBalances();
      await loadFaucetData();
    } catch (error) {
      console.error("Error claiming tokens:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("common.error");
      alert(t("faucet.claimError") + ": " + errorMessage);
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-[var(--card-bg)] p-12 rounded-2xl text-center border border-[var(--card-border)]">
          <h1 className="mb-4 text-[var(--primary-color)]">
            {t("home.title")}
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            {t("home.connectWallet")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-12 relative">
        <div className="flex justify-center items-center mb-2 relative w-full">
          <h1 className="text-[2.5rem] mb-0 bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] bg-clip-text text-transparent">
            💧 {t("faucet.title")}
          </h1>
          <RefreshButton
            onRefresh={handleRefresh}
            disabled={!isConnected}
            title={t("common.refresh")}
          />
        </div>
        <p className="text-[var(--text-secondary)] text-lg">
          {t("faucet.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8 mb-8">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8 mb-8 text-center">
          <h2 className="mb-6 text-[var(--text-primary)]">
            {t("faucet.claimTokens")}
          </h2>
          <div className="text-5xl font-bold my-8 text-[var(--primary-color)]">
            <span>{formatValueOrNA(claimAmount, 2, contractsAvailable)}</span>
            <span className="text-2xl text-[var(--text-secondary)] ml-2">
              {contractsAvailable ? "CLAW" : "N/A"}
            </span>
          </div>

          {canClaim && contractsAvailable ? (
            <button
              onClick={handleClaimTokens}
              disabled={claiming}
              className="w-full p-4 text-lg mt-4 bg-[var(--primary-color)] text-white border-none px-6 py-3 rounded-lg cursor-pointer font-semibold transition-all duration-300 hover:bg-[var(--primary-dark)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {claiming ? t("common.loading") : `🎁 ${t("faucet.claimTokens")}`}
            </button>
          ) : (
            <div className="my-8">
              <p className="text-[var(--text-secondary)] mb-2">
                ⏰ {t("faucet.cooldownMessage")}:
              </p>
              {contractsAvailable && (
                <p className="text-3xl font-bold text-[var(--warning-color)] font-mono">
                  {formatTime(timeUntilClaim)}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8 mb-8">
          <h2 className="mb-6 text-[var(--text-primary)]">
            {t("faucet.statistics")}
          </h2>
          <div className="flex justify-between p-4 border-b border-[var(--card-border)] last:border-b-0">
            <span className="text-[var(--text-secondary)]">
              {t("faucet.tokenBalance")}:
            </span>
            <span className="font-semibold text-[var(--primary-color)]">
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
          <div className="flex justify-between p-4 border-b border-[var(--card-border)] last:border-b-0">
            <span className="text-[var(--text-secondary)]">
              {t("faucet.totalClaimed")}:
            </span>
            <span className="font-semibold text-[var(--primary-color)]">
              {formatValueOrNA(
                parseFloat(totalClaimed).toFixed(2),
                2,
                contractsAvailable
              )}{" "}
              {contractsAvailable ? "CLAW" : "N/A"}
            </span>
          </div>
          <div className="flex justify-between p-4 border-b border-[var(--card-border)] last:border-b-0">
            <span className="text-[var(--text-secondary)]">
              {t("faucet.faucetBalance")}:
            </span>
            <span className="font-semibold text-[var(--primary-color)]">
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

      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-8 mt-8">
        <h3 className="mb-4">ℹ️ {t("faucet.howItWorks")}</h3>
        <ul className="list-inside text-[var(--text-secondary)]">
          <li className="py-2">
            {t("faucet.howToClaimText").replace(
              "{amount}",
              formatValueOrNA(claimAmount, 2, contractsAvailable)
            )}{" "}
            {contractsAvailable ? "CLAW" : "N/A"} {t("faucet.tokens")}
          </li>
          <li className="py-2">{t("faucet.claimFrequency")}</li>
          <li className="py-2">{t("faucet.tokenUsage")}</li>
          <li className="py-2">{t("faucet.freeTokens")}</li>
        </ul>
      </div>
    </div>
  );
}
