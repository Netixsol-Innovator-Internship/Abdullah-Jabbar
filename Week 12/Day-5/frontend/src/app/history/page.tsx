"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/context/WalletContext";
import {
  CONTRACT_ADDRESSES,
  NFT_MARKETPLACE_ABI,
  NFT_COLLECTION_ABI,
} from "@/config/contract";

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
          type: "Buy NFT",
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
          type: "List NFT",
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
            type: "Receive NFT",
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
          type: "Delist NFT",
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
            type: "Send NFT",
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
      case "Swap":
        return (
          <div className="tx-details">
            <p>
              Swapped {parseFloat(tx.details.amountIn || "0").toFixed(6)} tokens
              for {parseFloat(tx.details.amountOut || "0").toFixed(6)} tokens
            </p>
          </div>
        );
      case "Add Liquidity":
        return (
          <div className="tx-details">
            <p>
              Added {parseFloat(tx.details.amountA || "0").toFixed(4)} and{" "}
              {parseFloat(tx.details.amountB || "0").toFixed(4)} tokens to a
              liquidity pool
            </p>
            <p>
              Received {parseFloat(tx.details.liquidity || "0").toFixed(6)} LP
              tokens
            </p>
          </div>
        );
      case "Remove Liquidity":
        return (
          <div className="tx-details">
            <p>
              Removed {parseFloat(tx.details.liquidity || "0").toFixed(6)} LP
              tokens from a pool
            </p>
            <p>
              Received {parseFloat(tx.details.amountA || "0").toFixed(4)} and{" "}
              {parseFloat(tx.details.amountB || "0").toFixed(4)} tokens
            </p>
          </div>
        );
      case "Buy NFT":
        return (
          <div className="tx-details">
            <p>
              Purchased NFT #{tx.details.tokenId} for{" "}
              {parseFloat(tx.details.amount || "0").toFixed(4)} tokens
            </p>
          </div>
        );
      case "List NFT":
        return (
          <div className="tx-details">
            <p>
              Listed NFT #{tx.details.tokenId} for sale at{" "}
              {parseFloat(tx.details.price || "0").toFixed(4)} CLAW
            </p>
          </div>
        );
      case "Delist NFT":
        return (
          <div className="tx-details">
            <p>Removed NFT #{tx.details.tokenId} from marketplace</p>
          </div>
        );
      case "Receive NFT":
        return (
          <div className="tx-details">
            <p>
              Received NFT #{tx.details.tokenId} from{" "}
              {formatAddress(tx.details.from || "")}
            </p>
          </div>
        );
      case "Send NFT":
        return (
          <div className="tx-details">
            <p>
              Sent NFT #{tx.details.tokenId} to{" "}
              {formatAddress(tx.details.to || "")}
            </p>
          </div>
        );
      default:
        return (
          <div className="tx-details">
            <p>Transaction details not available</p>
          </div>
        );
    }
  };

  if (!isConnected) {
    return (
      <div className="container py-8">
        <div className="empty-state">
          <h2>Transaction History</h2>
          <p>Connect your wallet to view your transaction history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="page-header">
        <div className="page-title-row">
          <h1>📜 NFT Transaction History</h1>
          <button
            onClick={fetchTransactionHistory}
            disabled={loading}
            className="btn-refresh-page"
            title="Refresh data"
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              <span className="refresh-icon">↻</span>
            )}
          </button>
        </div>
        <p>View your NFT transaction history</p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <p className="text-secondary">
          {account && <>Connected: {formatAddress(account)}</>}
        </p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">Loading transaction history...</div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <p>No transactions found for this address.</p>
          <p className="hint">
            Transactions from the last 10,000 blocks are shown.
          </p>
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
                    {tx.type}
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
                  View on Etherscan: {formatHash(tx.txHash)} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
