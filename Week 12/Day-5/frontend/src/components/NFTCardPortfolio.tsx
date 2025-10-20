"use client";

import { useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import {
  CONTRACT_ADDRESSES,
  NFT_MARKETPLACE_ABI,
  NFT_COLLECTION_ABI,
} from "@/config/contract";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface NFTCardPortfolioProps {
  tokenId: number;
  metadata?: NFTMetadata;
  metadataLoading?: boolean;
  isListed?: boolean;
  listingPrice?: string;
  signer: ethers.Signer;
  onUpdate: () => void;
}

export default function NFTCardPortfolio({
  tokenId,
  metadata,
  metadataLoading,
  isListed,
  listingPrice,
  signer,
  onUpdate,
}: NFTCardPortfolioProps) {
  const [showListModal, setShowListModal] = useState(false);
  const [price, setPrice] = useState(listingPrice || "");
  const [processing, setProcessing] = useState(false);

  const getImageUrl = (imageUri: string) => {
    if (imageUri.startsWith("ipfs://")) {
      const ipfsHash = imageUri.replace("ipfs://", "");
      return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    }
    return imageUri;
  };

  const handleListNFT = async () => {
    if (!price || parseFloat(price) <= 0) {
      alert("Please enter a valid price");
      return;
    }

    try {
      setProcessing(true);

      const nftContract = new ethers.Contract(
        CONTRACT_ADDRESSES.NFTCollection,
        NFT_COLLECTION_ABI,
        signer
      );

      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.NFTMarketplace,
        NFT_MARKETPLACE_ABI,
        signer
      );

      // Approve marketplace to transfer NFT
      console.log("Approving marketplace...");
      const approveTx = await nftContract.approve(
        CONTRACT_ADDRESSES.NFTMarketplace,
        tokenId
      );
      await approveTx.wait();
      console.log("Approved");

      // List NFT
      console.log("Listing NFT...");
      const priceInWei = ethers.parseEther(price);
      const listTx = await marketplaceContract.listNFT(tokenId, priceInWei);
      await listTx.wait();
      console.log("Listed!");

      alert("NFT listed successfully! 🎉");
      setShowListModal(false);
      setPrice("");
      onUpdate();
    } catch (error) {
      console.error("Error listing NFT:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert("Failed to list NFT: " + errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="nft-card owned">
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
          <div className="nft-title-row">
            <h3>{metadata?.name || `DeFi Art #${tokenId}`}</h3>
            {isListed && (
              <span className="listing-badge-portfolio" title="Listed for sale">
                🏷️
              </span>
            )}
          </div>

          {isListed ? (
            <>
              <div className="listed-badge">📋 Listed on Market</div>
              <div className="price-section">
                <span className="price-label-portfolio">Price</span>
                <div className="listing-price-value" title={listingPrice}>
                  <span className="price-amount cursor-help">
                    {(listingPrice ?? "").length > 15
                      ? `${(listingPrice ?? "").slice(0, 15)}...`
                      : (listingPrice ?? "")}
                  </span>
                  <span className="price-currency"> CLAW</span>
                </div>
              </div>
            </>
          ) : (
            <div className="owned-section">
              <div className="owned-badge">✅ Owned</div>
              <div style={{ height: "0.5rem" }} />
              <button
                onClick={() => setShowListModal(true)}
                disabled={processing}
                className="btn-primary btn-small list-for-sale-btn"
                style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
              >
                🏷️ List for Sale
              </button>
            </div>
          )}
        </div>
      </div>

      {/* List NFT Modal */}
      {showListModal && (
        <div className="modal-overlay" onClick={() => setShowListModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>List NFT for Sale</h3>
              <button
                className="modal-close"
                onClick={() => setShowListModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                Set a price for your NFT in CLAW tokens
              </p>
              <div className="modal-warning">
                ⚠️ Note: Once listed, you cannot unlist or change the price.
              </div>
              <div className="form-group">
                <label htmlFor="list-price">Price (CLAW)</label>
                <input
                  id="list-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price..."
                  className="form-input"
                  disabled={processing}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowListModal(false)}
                className="btn-secondary"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleListNFT}
                className="btn-primary"
                disabled={processing || !price}
              >
                {processing ? "Listing..." : "List NFT"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
