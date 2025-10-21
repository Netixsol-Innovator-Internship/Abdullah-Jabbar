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
    <div className="lp-tokens-container">
      <div className="section-header">
        <h2>{t("dex.yourLiquidityPositions")}</h2>
        <button
          onClick={fetchLPTokens}
          className="refresh-button"
          disabled={loading}
        >
          {loading ? t("common.loading") : `🔄 ${t("common.refresh")}`}
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">{t("common.loading")}</div>
        </div>
      ) : lpTokens.length === 0 ? (
        <div className="empty-state">
          <p>{t("dex.noLiquidityPositions")}</p>
          <p className="hint">{t("dex.addLiquidityHint")}</p>
        </div>
      ) : (
        <div className="lp-tokens-list">
          {lpTokens.map((lp) => (
            <div key={lp.poolId} className="lp-token-card">
              <div className="lp-token-header">
                <h3>
                  {lp.tokenA} / {lp.tokenB}
                </h3>
                <span className="lp-share-badge">
                  {lp.sharePercent.toFixed(2)}% {t("dex.share")}
                </span>
              </div>
              <div className="lp-token-details">
                <div className="lp-detail-row">
                  <span className="lp-label">{t("dex.yourLiquidity")}:</span>
                  <span className="lp-value">
                    {parseFloat(lp.userLiquidity).toFixed(6)} LP
                  </span>
                </div>
                <div className="lp-detail-row">
                  <span className="lp-label">
                    {t("dex.totalPoolLiquidity")}:
                  </span>
                  <span className="lp-value">
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
