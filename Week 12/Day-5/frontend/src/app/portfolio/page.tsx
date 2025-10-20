"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ethers } from "ethers";
import {
  CONTRACT_ADDRESSES,
  NFT_COLLECTION_ABI,
  NFT_MARKETPLACE_ABI,
} from "@/config/contract";
import { useWallet } from "@/context/WalletContext";
import { useAppSelector } from "@/store/hooks";
import {
  selectAllBalances,
  selectTokensList,
  selectTokensLoading,
} from "@/store/selectors";
import { useRefreshBalances } from "@/hooks/useTokenData";
import { isContractAvailable, formatValueOrNA } from "@/utils/contractUtils";
import NFTCardPortfolio from "@/components/NFTCardPortfolio";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface NFT {
  tokenId: number;
  tokenURI?: string;
  metadata?: NFTMetadata;
  metadataLoading?: boolean;
  isListed?: boolean;
  listingPrice?: string;
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

  const fetchNFTMetadata = async (
    tokenURI: string
  ): Promise<NFTMetadata | null> => {
    try {
      console.log("Fetching metadata for tokenURI:", tokenURI);

      if (!tokenURI || tokenURI.trim() === "") {
        console.log("Empty tokenURI, skipping metadata fetch");
        return null;
      }

      // Fix malformed URIs with double ipfs://
      let cleanedURI = tokenURI;
      const ipfsCount = (tokenURI.match(/ipfs:\/\//g) || []).length;
      if (ipfsCount > 1) {
        const lastIpfsIndex = tokenURI.lastIndexOf("ipfs://");
        cleanedURI = tokenURI.substring(lastIpfsIndex);
        console.log("Cleaned URI:", cleanedURI);
      }

      // Convert IPFS URI to HTTP gateway URL
      let metadataUrl = cleanedURI;
      if (cleanedURI.startsWith("ipfs://")) {
        let ipfsHash = cleanedURI.replace("ipfs://", "");

        // Fix missing slash between CID and filename
        if (ipfsHash.includes(".json") && !ipfsHash.includes("/")) {
          const match = ipfsHash.match(/^([a-zA-Z0-9]+)(\d+\.json)$/);
          if (match) {
            ipfsHash = `${match[1]}/${match[2]}`;
            console.log("Fixed missing slash in URI:", ipfsHash);
          }
        }

        metadataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      }

      console.log("Fetching from URL:", metadataUrl);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(metadataUrl, {
        signal: controller.signal,
        mode: "cors",
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`Failed to fetch metadata (HTTP ${response.status})`);
        return null;
      }

      const contentType = response.headers.get("content-type");

      // If response is an image, use it directly
      if (
        contentType &&
        (contentType.includes("image/") || contentType.includes("video/"))
      ) {
        console.log("TokenURI points to media file directly");
        return {
          name: `NFT`,
          description: `NFT from collection`,
          image: cleanedURI,
          attributes: [],
        };
      }

      if (!contentType || !contentType.includes("application/json")) {
        console.warn("Response is not JSON, content-type:", contentType);
        return null;
      }

      const metadata: NFTMetadata = await response.json();
      console.log("Metadata fetched successfully:", metadata);
      return metadata;
    } catch (error) {
      console.warn("Error fetching NFT metadata:", error);
      return null;
    }
  };

  const loadNFTs = async () => {
    try {
      setNftsLoading(true);

      const nftContract = new ethers.Contract(
        CONTRACT_ADDRESSES.NFTCollection,
        NFT_COLLECTION_ABI,
        signer!
      );

      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.NFTMarketplace,
        NFT_MARKETPLACE_ABI,
        signer!
      );

      // Get NFTs owned directly by the user
      const tokenIds = await nftContract.tokensOfOwner(account);
      const nftData: NFT[] = [];

      for (const tokenId of tokenIds) {
        try {
          const tokenURI = await nftContract.tokenURI(tokenId);
          nftData.push({
            tokenId: Number(tokenId),
            tokenURI: tokenURI,
            metadataLoading: true,
            isListed: false,
          });
        } catch (error) {
          console.error(`Error loading NFT ${tokenId}:`, error);
        }
      }

      // Get total supply to check for listed NFTs
      const totalSupply = await nftContract.totalSupply();

      // Check each NFT in the collection for listings by this user
      for (let i = 0; i < Number(totalSupply); i++) {
        try {
          const owner = await nftContract.ownerOf(i);

          // If NFT is owned by marketplace, check if it's listed by this user
          if (
            owner.toLowerCase() ===
            CONTRACT_ADDRESSES.NFTMarketplace.toLowerCase()
          ) {
            const listing = await marketplaceContract.listings(i);

            // Check if this NFT is listed and the seller is the current user
            if (
              listing.isActive &&
              listing.seller.toLowerCase() === account.toLowerCase()
            ) {
              const tokenURI = await nftContract.tokenURI(i);
              nftData.push({
                tokenId: i,
                tokenURI: tokenURI,
                metadataLoading: true,
                isListed: true,
                listingPrice: ethers.formatEther(listing.price),
              });
            }
          }
        } catch (error) {
          console.error(`Error checking NFT ${i} for listings:`, error);
        }
      }

      setNfts(nftData);

      // Fetch metadata for each NFT
      const nftsWithMetadata = await Promise.all(
        nftData.map(async (nft) => {
          try {
            const metadata = await fetchNFTMetadata(nft.tokenURI || "");
            return {
              ...nft,
              metadata: metadata || undefined,
              metadataLoading: false,
            };
          } catch (error) {
            console.error(
              `Error fetching metadata for NFT ${nft.tokenId}:`,
              error
            );
            return { ...nft, metadata: undefined, metadataLoading: false };
          }
        })
      );

      setNfts(nftsWithMetadata);
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
                  <NFTCardPortfolio
                    key={nft.tokenId}
                    tokenId={nft.tokenId}
                    metadata={nft.metadata}
                    metadataLoading={nft.metadataLoading}
                    isListed={nft.isListed}
                    listingPrice={nft.listingPrice}
                    signer={signer!}
                    onUpdate={loadNFTs}
                  />
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
