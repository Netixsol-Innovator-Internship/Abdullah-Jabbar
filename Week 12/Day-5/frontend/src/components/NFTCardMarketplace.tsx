"use client";

import { useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import {
  CONTRACT_ADDRESSES,
  NFT_MARKETPLACE_ABI,
  PLATFORM_TOKEN_ABI,
} from "@/config/contract";
import { formatValueOrNA } from "@/utils/contractUtils";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface NFTCardMarketplaceProps {
  tokenId: number;
  owner: string;
  metadata?: NFTMetadata;
  metadataLoading?: boolean;
  isAvailable: boolean;
  isListed?: boolean;
  seller?: string;
  priceInSelectedToken?: string;
  selectedPayment: string;
  account: string;
  signer: ethers.Signer;
  contractsAvailable: boolean;
  getTokenSymbol: (address: string) => string;
  onBuySuccess: () => void;
}

export default function NFTCardMarketplace({
  tokenId,
  owner,
  metadata,
  metadataLoading,
  isAvailable,
  isListed,
  seller,
  priceInSelectedToken,
  selectedPayment,
  account,
  signer,
  contractsAvailable,
  getTokenSymbol,
  onBuySuccess,
}: NFTCardMarketplaceProps) {
  const [buying, setBuying] = useState(false);

  const getImageUrl = (imageUri: string) => {
    if (imageUri.startsWith("ipfs://")) {
      const ipfsHash = imageUri.replace("ipfs://", "");
      return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    }
    return imageUri;
  };

  const handleBuyNFT = async () => {
    try {
      setBuying(true);

      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.NFTMarketplace,
        NFT_MARKETPLACE_ABI,
        signer
      );

      const paymentTokenContract = new ethers.Contract(
        selectedPayment,
        PLATFORM_TOKEN_ABI,
        signer
      );

      // Use the calculated price from props
      const paymentAmount = ethers.parseEther(priceInSelectedToken || "0");

      console.log("Approving tokens...");
      const approveTx = await paymentTokenContract.approve(
        CONTRACT_ADDRESSES.NFTMarketplace,
        paymentAmount
      );
      await approveTx.wait();
      console.log("Tokens approved");

      console.log("Buying NFT...");
      let buyTx;

      if (isListed) {
        // Buy from user listing
        buyTx = await marketplaceContract.buyListedNFT(
          tokenId,
          selectedPayment
        );
      } else {
        // Buy from primary sale
        if (selectedPayment === CONTRACT_ADDRESSES.PlatformToken) {
          buyTx = await marketplaceContract.buyNFTWithPlatformToken(tokenId);
        } else {
          buyTx = await marketplaceContract.buyNFTWithToken(
            tokenId,
            selectedPayment
          );
        }
      }

      await buyTx.wait();
      console.log("NFT purchased!");

      alert("NFT purchased successfully! 🎉");
      onBuySuccess();
    } catch (error) {
      console.error("Error buying NFT:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert("Failed to buy NFT: " + errorMessage);
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="nft-card">
      <div className="nft-image-placeholder">
        {metadataLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : metadata?.image ? (
          <Image
            src={getImageUrl(metadata.image)}
            alt={metadata.name || `NFT #${tokenId}`}
            width={300}
            height={300}
            className="nft-image"
            unoptimized
          />
        ) : (
          <span className="nft-id">#{tokenId}</span>
        )}
      </div>

      <div className="nft-info">
        <div className="nft-content">
          <div className="nft-title-row">
            <h3>{metadata?.name || `DeFi Art #${tokenId}`}</h3>
            {isListed && (
              <span className="listing-badge" title="Listed by user">
                ✓
              </span>
            )}
          </div>

          {metadata?.description && (
            <p className="nft-description">{metadata.description}</p>
          )}

          {metadata?.attributes && metadata.attributes.length > 0 && (
            <div className="nft-attributes">
              {metadata.attributes.map((attr, idx) => (
                <div key={idx} className="attribute-badge">
                  <span className="attr-type">{attr.trait_type}:</span>
                  <span className="attr-value">{attr.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="nft-metadata">
            <div className="metadata-item">
              <span className="label">Owner:</span>
              <span className="value">
                {owner.substring(0, 6)}...{owner.substring(38)}
              </span>
            </div>

            {isAvailable && priceInSelectedToken && (
              <div className="metadata-item">
                <span className="label">Price:</span>
                <span className="value price">
                  {formatValueOrNA(priceInSelectedToken, 2, contractsAvailable)}{" "}
                  {getTokenSymbol(selectedPayment)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="nft-actions">
          {isAvailable ? (
            <button
              onClick={handleBuyNFT}
              disabled={
                buying ||
                !contractsAvailable ||
                (isListed && seller?.toLowerCase() === account.toLowerCase())
              }
              className="btn-primary btn-buy"
            >
              {buying ? "Buying..." : "🛒 Buy NFT"}
            </button>
          ) : owner.toLowerCase() === account.toLowerCase() ? (
            <div className="owned-badge">✅ You own this</div>
          ) : (
            <div className="sold-badge">❌ Sold</div>
          )}
        </div>
      </div>
    </div>
  );
}
