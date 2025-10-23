"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/context/WalletContext";
import { useI18n } from "@/i18n/i18nContext";
import {
  CONTRACT_ADDRESSES,
  NFT_MARKETPLACE_ABI,
  NFT_COLLECTION_ABI,
} from "@/config/contract";
import RefreshButton from "@/components/RefreshButton";

interface Transaction {
  id: string; // txHash + index
  type: string;
  timestamp: number;
  txHash: string;
  details: {
    tokenId?: string;
    amount?: string;
    price?: string;
    from?: string;
    to?: string;
    amountIn?: string;
    amountOut?: string;
    amountA?: string;
    amountB?: string;
    liquidity?: string;
    [key: string]: string | undefined;
  };
}

export default function NFTTransactionHistory() {
  const { signer, account, isConnected } = useWallet();
  const { t } = useI18n();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Define the event type for our transactions
  interface EventWithArgs {
    blockNumber: number;
    transactionHash: string;
    index: number;
    args: {
      tokenId?: ethers.BigNumberish;
      amount?: ethers.BigNumberish;
      price?: ethers.BigNumberish;
      from?: string;
      to?: string;
      amountIn?: ethers.BigNumberish;
      amountOut?: ethers.BigNumberish;
      amountA?: ethers.BigNumberish;
      amountB?: ethers.BigNumberish;
      liquidity?: ethers.BigNumberish;
      [key: string]: ethers.BigNumberish | string | undefined;
    };
    getBlock: () => Promise<{ timestamp: number }>;
  }

  const fetchTransactionHistory = async () => {
    if (!signer || !account) return;

    setLoading(true);
    try {
      // Get providers
      const provider = signer.provider as ethers.Provider;
      if (!provider) throw new Error("Provider not available");

      // Create contracts for NFT-related transactions only
      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.NFTMarketplace,
        NFT_MARKETPLACE_ABI,
        signer
      );

      const nftContract = new ethers.Contract(
        CONTRACT_ADDRESSES.NFTCollection,
        NFT_COLLECTION_ABI,
        signer
      );

      // Determine block range
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 10000); // Last 10,000 blocks

      const marketplaceNFTPurchasedFilter =
        marketplaceContract.filters.NFTPurchased(null, account);
      const marketplaceNFTListedFilter = marketplaceContract.filters.NFTListed(
        null,
        account
      );
      const marketplaceNFTDelistedFilter =
        marketplaceContract.filters.NFTDelisted(null);

      const nftTransferFilter = nftContract.filters.Transfer(null, account);
      const nftTransferFromFilter = nftContract.filters.Transfer(account);

      // Fetch events - only NFT transactions
      const [
        purchaseEvents,
        listEvents,
        delistEvents,
        transferToEvents,
        transferFromEvents,
      ] = await Promise.all([
        marketplaceContract.queryFilter(
          marketplaceNFTPurchasedFilter,
          fromBlock
        ) as Promise<EventWithArgs[]>,
        marketplaceContract.queryFilter(
          marketplaceNFTListedFilter,
          fromBlock
        ) as Promise<EventWithArgs[]>,
        marketplaceContract.queryFilter(
          marketplaceNFTDelistedFilter,
          fromBlock
        ) as Promise<EventWithArgs[]>,
        nftContract.queryFilter(nftTransferFilter, fromBlock) as Promise<
          EventWithArgs[]
        >,
        nftContract.queryFilter(nftTransferFromFilter, fromBlock) as Promise<
          EventWithArgs[]
        >,
      ]);

      // Process events into transactions
      const allTransactions: Transaction[] = [];

      // Process NFT purchase events
      for (const event of purchaseEvents) {
        const block = await event.getBlock();
        allTransactions.push({
          id: `${event.transactionHash}-${event.index}`,
          type: "buyNFT",
          timestamp: block.timestamp,
          txHash: event.transactionHash,
          details: {
            tokenId:
              event.args?.tokenId?.toString() ||
              event.args?.[0]?.toString() ||
              "0",
            paymentToken: (
              event.args?.paymentToken ||
              event.args?.[2] ||
              ""
            ).toString(),
            amount: ethers.formatEther(
              event.args?.amount || event.args?.[3] || 0
            ),
          },
        });
      }

      // Process NFT listing events
      for (const event of listEvents) {
        const block = await event.getBlock();
        allTransactions.push({
          id: `${event.transactionHash}-${event.index}`,
          type: "listNFT",
          timestamp: block.timestamp,
          txHash: event.transactionHash,
          details: {
            tokenId:
              event.args?.tokenId?.toString() ||
              event.args?.[0]?.toString() ||
              "0",
            price: ethers.formatEther(
              event.args?.price || event.args?.[2] || 0
            ),
          },
        });
      }

      // Process NFT transfer events (to user)
      for (const event of transferToEvents) {
        const block = await event.getBlock();
        // Skip events that are already covered by purchases
        if (
          !purchaseEvents.some(
            (p) => p.transactionHash === event.transactionHash
          )
        ) {
          allTransactions.push({
            id: `${event.transactionHash}-${event.index}`,
            type: "receiveNFT",
            timestamp: block.timestamp,
            txHash: event.transactionHash,
            details: {
              tokenId:
                event.args?.tokenId?.toString() ||
                event.args?.[2]?.toString() ||
                "0",
              from: (event.args?.from || event.args?.[0] || "").toString(),
            },
          });
        }
      }

      // Process NFT delist events
      for (const event of delistEvents) {
        const block = await event.getBlock();
        allTransactions.push({
          id: `${event.transactionHash}-${event.index}`,
          type: "delistNFT",
          timestamp: block.timestamp,
          txHash: event.transactionHash,
          details: {
            tokenId:
              event.args?.tokenId?.toString() ||
              event.args?.[1]?.toString() ||
              "0",
          },
        });
      }

      // Process NFT transfer events (from user)
      for (const event of transferFromEvents) {
        const block = await event.getBlock();
        // Skip events that are already covered by listings
        if (
          !listEvents.some((p) => p.transactionHash === event.transactionHash)
        ) {
          allTransactions.push({
            id: `${event.transactionHash}-${event.index}`,
            type: "sendNFT",
            timestamp: block.timestamp,
            txHash: event.transactionHash,
            details: {
              tokenId:
                event.args?.tokenId?.toString() ||
                event.args?.[2]?.toString() ||
                "0",
              to: (event.args?.to || event.args?.[1] || "").toString(),
            },
          });
        }
      }

      // Sort transactions by timestamp (newest first)
      allTransactions.sort((a, b) => b.timestamp - a.timestamp);

      setTransactions(allTransactions);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && account) {
      fetchTransactionHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, account]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  const getTransactionDetails = (tx: Transaction) => {
    switch (tx.type) {
      case "swap":
        return (
          <div className="tx-details">
            <p>
              {t("history.swappedTokens")}{" "}
              {parseFloat(tx.details.amountIn || "0").toFixed(6)}{" "}
              {t("history.tokensFor")}{" "}
              {parseFloat(tx.details.amountOut || "0").toFixed(6)}{" "}
              {t("history.tokens")}
            </p>
          </div>
        );
      case "addLiquidity":
        return (
          <div className="tx-details">
            <p>
              {t("history.addedLiquidity")}{" "}
              {parseFloat(tx.details.amountA || "0").toFixed(4)}{" "}
              {t("history.and")}{" "}
              {parseFloat(tx.details.amountB || "0").toFixed(4)}{" "}
              {t("history.tokensToPool")}
            </p>
            <p>
              {t("history.receivedLP")}{" "}
              {parseFloat(tx.details.liquidity || "0").toFixed(6)}{" "}
              {t("history.lpTokens")}
            </p>
          </div>
        );
      case "removeLiquidity":
        return (
          <div className="tx-details">
            <p>
              {t("history.removedLP")}{" "}
              {parseFloat(tx.details.liquidity || "0").toFixed(6)}{" "}
              {t("history.lpTokensFromPool")}
            </p>
            <p>
              {t("history.receivedTokens")}{" "}
              {parseFloat(tx.details.amountA || "0").toFixed(4)}{" "}
              {t("history.and")}{" "}
              {parseFloat(tx.details.amountB || "0").toFixed(4)}{" "}
              {t("history.tokens")}
            </p>
          </div>
        );
      case "buyNFT":
        return (
          <div className="tx-details">
            <p>
              {t("history.purchasedNFT")} #{tx.details.tokenId}{" "}
              {t("history.for")}{" "}
              {parseFloat(tx.details.amount || "0").toFixed(4)}{" "}
              {t("history.tokens")}
            </p>
          </div>
        );
      case "listNFT":
        return (
          <div className="tx-details">
            <p>
              {t("history.listedNFT")} #{tx.details.tokenId}{" "}
              {t("history.forSaleAt")}{" "}
              {parseFloat(tx.details.price || "0").toFixed(4)} CLAW
            </p>
          </div>
        );
      case "delistNFT":
        return (
          <div className="tx-details">
            <p>
              {t("history.removedNFT")} #{tx.details.tokenId}{" "}
              {t("history.fromMarketplace")}
            </p>
          </div>
        );
      case "receiveNFT":
        return (
          <div className="tx-details">
            <p>
              {t("history.receivedNFT")} #{tx.details.tokenId}{" "}
              {t("history.from")} {formatAddress(tx.details.from || "")}
            </p>
          </div>
        );
      case "sendNFT":
        return (
          <div className="tx-details">
            <p>
              {t("history.sentNFT")} #{tx.details.tokenId} {t("history.to")}{" "}
              {formatAddress(tx.details.to || "")}
            </p>
          </div>
        );
      default:
        return (
          <div className="tx-details">
            <p>{t("history.transactionDetailsNotAvailable")}</p>
          </div>
        );
    }
  };

  if (!isConnected) {
    return (
      <div className="container py-8">
        <div className="empty-state">
          <h2>{t("history.title")}</h2>
          <p>{t("history.connectWalletMessage")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="page-header">
        <div className="page-title-row">
          <h1>📜 {t("history.title")}</h1>
          <RefreshButton
            onRefresh={fetchTransactionHistory}
            disabled={loading}
            title={t("common.refresh")}
          />
        </div>
        <p>{t("history.subtitle")}</p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <p className="text-secondary">
          {account && (
            <>
              {t("history.connected")}: {formatAddress(account)}
            </>
          )}
        </p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">{t("history.loadingHistory")}</div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <p>{t("history.noTransactions")}</p>
          <p className="hint">{t("history.recentBlocksInfo")}</p>
        </div>
      ) : (
        <div className="transaction-list">
          {transactions.map((tx) => (
            <div key={tx.id} className="transaction-card">
              <div className="tx-header">
                <div className="tx-type">
                  <span
                    className={`tx-badge ${tx.type.toLowerCase().replace(" ", "-")}`}
                  >
                    {t(`history.types.${tx.type}`)}
                  </span>
                </div>
                <div className="tx-time">{formatDate(tx.timestamp)}</div>
              </div>

              {getTransactionDetails(tx)}

              <div className="tx-footer">
                <a
                  href={`https://etherscan.io/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-link"
                >
                  {t("history.viewOnExplorer")}: {formatHash(tx.txHash)} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
