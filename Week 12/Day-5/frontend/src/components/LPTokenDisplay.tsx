"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { useI18n } from "@/i18n/i18nContext";

interface LPToken {
  poolId: string;
  tokenA: string;
  tokenB: string;
  userLiquidity: string;
  totalLiquidity: string;
  sharePercent: number;
}

export default function LPTokenDisplay() {
  const { signer, account, isConnected } = useWallet();
  const { t } = useI18n();
  const [lpTokens, setLpTokens] = useState<LPToken[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLPTokens = async () => {
    if (!signer || !account) return;

    setLoading(true);
    try {
      // Since getAllPools function is not available in the ABI
      console.log("getAllPools function is not available in the contract ABI");

      // Set empty array and return - unable to fetch pools without getAllPools function
      setLpTokens([]);
    } catch (error) {
      console.error("Error fetching LP tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && account) {
      fetchLPTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, account]);

  if (!isConnected) {
    return <p className="text-center py-4">{t("dex.connectWalletToViewLP")}</p>;
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-6 my-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          {t("dex.yourLiquidityPositions")}
        </h2>
        <button
          onClick={fetchLPTokens}
          className="px-4 py-2 bg-[rgba(99,102,241,0.1)] border border-[var(--primary-color)] rounded-lg text-[var(--primary-color)] font-medium transition-all duration-200 hover:bg-[rgba(99,102,241,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? t("common.loading") : ` ${t("common.refresh")}`}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="text-[var(--text-secondary)] text-xl animate-pulse">
            {t("common.loading")}
          </div>
        </div>
      ) : lpTokens.length === 0 ? (
        <div className="text-center py-8 text-[var(--text-secondary)]">
          <p>{t("dex.noLiquidityPositions")}</p>
          <p className="mt-2 text-sm text-[var(--primary-color)]">
            {t("dex.addLiquidityHint")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {lpTokens.map((lp) => (
            <div
              key={lp.poolId}
              className="bg-[rgba(30,41,59,0.5)] border border-[var(--card-border)] rounded-xl p-5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                  {lp.tokenA} / {lp.tokenB}
                </h3>
                <span className="bg-[rgba(16,185,129,0.15)] text-[var(--secondary-color)] px-2 py-1 rounded text-xs font-medium">
                  {lp.sharePercent.toFixed(2)}% {t("dex.share")}
                </span>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[var(--text-secondary)] text-sm">
                    {t("dex.yourLiquidity")}:
                  </span>
                  <span className="font-medium text-[0.95rem]">
                    {parseFloat(lp.userLiquidity).toFixed(6)} LP
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-[var(--text-secondary)] text-sm">
                    {t("dex.totalPoolLiquidity")}:
                  </span>
                  <span className="font-medium text-[0.95rem]">
                    {parseFloat(lp.totalLiquidity).toFixed(2)} LP
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
