"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import {
  CONTRACT_ADDRESSES,
  NFT_MARKETPLACE_ABI,
  NFT_COLLECTION_ABI,
  PLATFORM_TOKEN_ABI,
} from "@/config/contract";
import { useWallet } from "@/context/WalletContext";
import { isContractAvailable, formatValueOrNA } from "@/utils/contractUtils";

const TOKENS = [
  { address: CONTRACT_ADDRESSES.PlatformToken, symbol: "CLAW" },
  { address: CONTRACT_ADDRESSES.TestUSD, symbol: "TUSD" },
  { address: CONTRACT_ADDRESSES.TestBTC, symbol: "TBTC" },
];

interface NFT {
  tokenId: number;
  owner: string;
  tokenURI: string;
  isAvailable: boolean;
}

export default function Marketplace() {
  const { signer, account, isConnected } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(
    CONTRACT_ADDRESSES.PlatformToken
  );
  const [nftPrice, setNftPrice] = useState("0");
  const [pricesInTokens, setPricesInTokens] = useState<Record<string, string>>(
    {}
  );
  const [contractsAvailable, setContractsAvailable] = useState(false);

  const isMarketplaceDeployed = isContractAvailable(
    CONTRACT_ADDRESSES.NFTMarketplace
  );
  const isNFTCollectionDeployed = isContractAvailable(
    CONTRACT_ADDRESSES.NFTCollection
  );
  const isTokensDeployed = TOKENS.every((t) => isContractAvailable(t.address));

  useEffect(() => {
    setContractsAvailable(
      isMarketplaceDeployed && isNFTCollectionDeployed && isTokensDeployed
    );
  }, [isMarketplaceDeployed, isNFTCollectionDeployed, isTokensDeployed]);

  useEffect(() => {
    if (signer && account && contractsAvailable) {
      void loadMarketplace();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, account, contractsAvailable]);

  const handleRefresh = async () => {
    if (!isConnected) return;
    setRefreshing(true);
    try {
      if (contractsAvailable) {
        await loadMarketplace();
      }
    } catch (error) {
      console.error("Error refreshing marketplace:", error);
    } finally {
      // Delay to allow animation to complete (1.5s for 3 spins)
      setTimeout(() => setRefreshing(false), 1500);
    }
  };

  const loadMarketplace = async () => {
    try {
      setLoading(true);

      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.NFTMarketplace,
        NFT_MARKETPLACE_ABI,
        signer!
      );

      const nftContract = new ethers.Contract(
        CONTRACT_ADDRESSES.NFTCollection,
        NFT_COLLECTION_ABI,
        signer!
      );

      const price = await marketplaceContract.nftPrice();
      setNftPrice(ethers.formatEther(price));

      const prices: Record<string, string> = {};
      for (const token of TOKENS) {
        try {
          const tokenPrice = await marketplaceContract.calculatePriceInToken(
            token.address
          );
          prices[token.address] = ethers.formatEther(tokenPrice);
        } catch (error) {
          console.error(`Error getting price for ${token.symbol}:`, error);
          prices[token.address] = "0";
        }
      }
      setPricesInTokens(prices);

      const totalSupply = await nftContract.totalSupply();

      const nftData: NFT[] = [];
      for (let i = 0; i < Number(totalSupply); i++) {
        try {
          const owner = await nftContract.ownerOf(i);
          const tokenURI = await nftContract.tokenURI(i);

          nftData.push({
            tokenId: i,
            owner: owner,
            tokenURI: tokenURI,
            isAvailable:
              owner.toLowerCase() ===
              CONTRACT_ADDRESSES.NFTMarketplace.toLowerCase(),
          });
        } catch (error) {
          console.error(`Error loading NFT ${i}:`, error);
        }
      }

      setNfts(nftData);
    } catch (error) {
      console.error("Error loading marketplace:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNFT = async (tokenId: number) => {
    try {
      setBuying(true);

      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.NFTMarketplace,
        NFT_MARKETPLACE_ABI,
        signer!
      );

      const paymentTokenContract = new ethers.Contract(
        selectedPayment,
        PLATFORM_TOKEN_ABI,
        signer!
      );

      const paymentAmount = ethers.parseEther(
        pricesInTokens[selectedPayment] || nftPrice
      );

      console.log("Approving tokens...");
      const approveTx = await paymentTokenContract.approve(
        CONTRACT_ADDRESSES.NFTMarketplace,
        paymentAmount
      );
      await approveTx.wait();
      console.log("Tokens approved");

      console.log("Buying NFT...");
      let buyTx;
      if (selectedPayment === CONTRACT_ADDRESSES.PlatformToken) {
        buyTx = await marketplaceContract.buyNFTWithPlatformToken(tokenId);
      } else {
        buyTx = await marketplaceContract.buyNFTWithToken(
          tokenId,
          selectedPayment
        );
      }
      await buyTx.wait();
      console.log("NFT purchased!");

      alert("NFT purchased successfully! 🎉");
      await loadMarketplace();
    } catch (error) {
      console.error("Error buying NFT:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert("Failed to buy NFT: " + errorMessage);
    } finally {
      setBuying(false);
    }
  };

  const getTokenSymbol = (address: string) => {
    if (!contractsAvailable) return "N/A";
    const token = TOKENS.find((t) => t.address === address);
    return token ? token.symbol : "N/A";
  };

  if (!isConnected) {
    return (
      <div className="connect-prompt">
        <div className="connect-card">
          <h1>👋 Connect your wallet</h1>
          <p>Please connect MetaMask to view the marketplace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-row">
          <h1>🖼️ NFT Marketplace</h1>
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
        <p>Buy unique NFTs with multiple token options</p>
      </div>

      <div className="card payment-selector">
        <h3>Select Payment Token</h3>
        <div className="payment-options">
          {TOKENS.map((token) => (
            <button
              key={`${token.address}-${token.symbol}`}
              onClick={() => setSelectedPayment(token.address)}
              className={`payment-option ${selectedPayment === token.address ? "active" : ""}`}
            >
              <span className="token-symbol">
                {contractsAvailable ? token.symbol : "N/A"}
              </span>
              <span className="token-price">
                {formatValueOrNA(
                  pricesInTokens[token.address]
                    ? parseFloat(pricesInTokens[token.address]).toFixed(2)
                    : nftPrice,
                  2,
                  contractsAvailable
                )}{" "}
                {contractsAvailable ? token.symbol : "N/A"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading NFTs...</div>
      ) : (
        <div className="nft-grid">
          {nfts.length === 0 ? (
            <div className="no-nfts">
              <p>No NFTs available yet</p>
            </div>
          ) : (
            nfts.map((nft) => (
              <div key={nft.tokenId} className="nft-card">
                <div className="nft-image-placeholder">
                  <span className="nft-id">#{nft.tokenId}</span>
                </div>

                <div className="nft-info">
                  <h3>DeFi Art #{nft.tokenId}</h3>

                  <div className="nft-metadata">
                    <div className="metadata-item">
                      <span className="label">Owner:</span>
                      <span className="value">
                        {nft.owner.substring(0, 6)}...{nft.owner.substring(38)}
                      </span>
                    </div>

                    {nft.isAvailable && (
                      <div className="metadata-item">
                        <span className="label">Price:</span>
                        <span className="value price">
                          {formatValueOrNA(
                            pricesInTokens[selectedPayment]
                              ? parseFloat(
                                  pricesInTokens[selectedPayment]
                                ).toFixed(2)
                              : nftPrice,
                            2,
                            contractsAvailable
                          )}{" "}
                          {getTokenSymbol(selectedPayment)}
                        </span>
                      </div>
                    )}
                  </div>

                  {nft.isAvailable ? (
                    <button
                      onClick={() => handleBuyNFT(nft.tokenId)}
                      disabled={buying || !contractsAvailable}
                      className="btn-primary btn-buy"
                    >
                      {buying ? "Buying..." : "🛒 Buy NFT"}
                    </button>
                  ) : nft.owner.toLowerCase() === account.toLowerCase() ? (
                    <div className="owned-badge">✅ You own this</div>
                  ) : (
                    <div className="sold-badge">❌ Sold</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="info-section">
        <h3>💡 How to Buy</h3>
        <ul>
          <li>Select your preferred payment token (CLAW, TUSD, or TBTC)</li>
          <li>Click &quot;Buy NFT&quot; on any available NFT</li>
          <li>Approve the token transaction in MetaMask</li>
          <li>Confirm the purchase transaction</li>
          <li>The NFT will be transferred to your wallet!</li>
        </ul>
      </div>
    </div>
  );
}
