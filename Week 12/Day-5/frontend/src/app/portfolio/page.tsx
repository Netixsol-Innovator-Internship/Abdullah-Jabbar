"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, NFT_COLLECTION_ABI } from "@/config/contract";
import { useWallet } from "@/context/WalletContext";
import { useAppSelector } from "@/store/hooks";
import {
  selectAllBalances,
  selectTokensList,
  selectTokensLoading,
} from "@/store/selectors";
import { useRefreshBalances } from "@/hooks/useTokenData";
import { isContractAvailable, formatValueOrNA } from "@/utils/contractUtils";

interface NFT {
  tokenId: number;
}

export default function Portfolio() {
  const { signer, account, isConnected } = useWallet();
  const { refreshBalances } = useRefreshBalances();

  // Get data from Redux store
  const balances = useAppSelector(selectAllBalances);
  const tokens = useAppSelector(selectTokensList);
  const tokensLoading = useAppSelector(selectTokensLoading);

  const [nfts, setNfts] = useState<NFT[]>([]);
  const [nftsLoading, setNftsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Memoize contract availability checks
  const contractsAvailable = useMemo(() => {
    const areTokensDeployed = tokens.every((t) =>
      isContractAvailable(t.address)
    );
    const isNFTCollectionDeployed = isContractAvailable(
      CONTRACT_ADDRESSES.NFTCollection
    );
    return areTokensDeployed && isNFTCollectionDeployed;
  }, [tokens]);

  // Calculate total portfolio value from Redux balances
  const totalValue = useMemo(() => {
    return Object.values(balances).reduce((sum, balance) => {
      return sum + parseFloat(balance.formattedBalance || "0");
    }, 0);
  }, [balances]);

  useEffect(() => {
    if (signer && account && contractsAvailable) {
      void loadNFTs();
    } else {
      setNftsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, account, contractsAvailable]);

  const loadNFTs = async () => {
    try {
      setNftsLoading(true);

      const nftContract = new ethers.Contract(
        CONTRACT_ADDRESSES.NFTCollection,
        NFT_COLLECTION_ABI,
        signer!
      );

      const tokenIds = await nftContract.tokensOfOwner(account);
      const nftData: NFT[] = [];

      for (const tokenId of tokenIds) {
        try {
          nftData.push({
            tokenId: Number(tokenId),
          });
        } catch (error) {
          console.error(`Error loading NFT ${tokenId}:`, error);
        }
      }

      setNfts(nftData);
    } catch (error) {
      console.error("Error loading NFTs:", error);
    } finally {
      setNftsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshBalances();
      if (contractsAvailable) {
        await loadNFTs();
      }
    } catch (error) {
      console.error("Error refreshing portfolio:", error);
    } finally {
      // Delay to allow animation to complete (1.5s for 3 spins)
      setTimeout(() => setRefreshing(false), 1500);
    }
  };

  if (!isConnected) {
    return (
      <div className="connect-prompt">
        <div className="connect-card">
          <h1>👋 Connect your wallet</h1>
          <p>Please connect MetaMask to view your portfolio</p>
        </div>
      </div>
    );
  }

  const loading = tokensLoading || nftsLoading;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-row">
          <h1>👛 Your Portfolio</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
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
        <p>View all your tokens and NFTs</p>
      </div>

      {loading ? (
        <div className="loading">Loading portfolio...</div>
      ) : (
        <>
          <div className="card summary-card">
            <h2>Portfolio Summary</h2>
            <div className="summary-stats">
              <div className="summary-item">
                <span className="summary-label">Total Value</span>
                <span className="summary-value">
                  {formatValueOrNA(totalValue, 2, contractsAvailable)} tokens
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">NFTs Owned</span>
                <span className="summary-value">{nfts.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Tokens</span>
                <span className="summary-value">{tokens.length}</span>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>💰 Token Balances</h2>
            <div className="token-list">
              {tokens.map((token) => {
                const balance = balances[token.address];
                return (
                  <div key={token.address} className="token-item">
                    <div className="token-icon">
                      {contractsAvailable && token.symbol
                        ? token.symbol.charAt(0)
                        : "?"}
                    </div>
                    <div className="token-details">
                      <h3>{contractsAvailable ? token.name : "N/A"}</h3>
                      <p className="token-symbol">
                        {contractsAvailable ? token.symbol : "N/A"}
                      </p>
                    </div>
                    <div className="token-balance">
                      <span className="balance-amount">
                        {formatValueOrNA(
                          balance ? parseFloat(balance.formattedBalance) : 0,
                          4,
                          contractsAvailable
                        )}
                      </span>
                      <span className="balance-symbol">
                        {contractsAvailable ? token.symbol : "N/A"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="section">
            <h2>🖼️ Your NFTs ({nfts.length})</h2>
            {nfts.length === 0 ? (
              <div className="empty-state">
                <p>You don&apos;t own any NFTs yet</p>
                <p>Visit the marketplace to buy some!</p>
              </div>
            ) : (
              <div className="nft-grid">
                {nfts.map((nft) => (
                  <div key={nft.tokenId} className="nft-card owned">
                    <div className="nft-image-placeholder">
                      <span className="nft-id">#{nft.tokenId}</span>
                    </div>
                    <div className="nft-info">
                      <h3>DeFi Art #{nft.tokenId}</h3>
                      <div className="owned-badge">✅ Owned</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card actions-card">
            <h3>⚡ Quick Actions</h3>
            <div className="action-buttons">
              <Link href="/" className="action-btn">
                💧 Get More Tokens
              </Link>
              <Link href="/dex" className="action-btn">
                🔄 Swap Tokens
              </Link>
              <Link href="/marketplace" className="action-btn">
                🛒 Buy NFTs
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
