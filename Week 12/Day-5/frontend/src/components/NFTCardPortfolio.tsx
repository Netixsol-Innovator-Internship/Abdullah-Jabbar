"use client";

import { useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import {
  CONTRACT_ADDRESSES,
  NFT_MARKETPLACE_ABI,
  NFT_COLLECTION_ABI,
} from "@/config/contract";
import { NFTMetadata } from "@/types/nft";
import { useI18n } from "@/i18n/i18nContext";
import { validateNFTPrice, sanitizeNumericInput } from "@/utils/validation";

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
  const { t } = useI18n();
  const [showListModal, setShowListModal] = useState(false);
  const [price, setPrice] = useState(listingPrice || "");
  const [processing, setProcessing] = useState(false);
  const [priceError, setPriceError] = useState("");

  const getImageUrl = (imageUri: string) => {
    if (imageUri.startsWith("ipfs://")) {
      const ipfsHash = imageUri.replace("ipfs://", "");
      return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    }
    return imageUri;
  };

  // Price validation and handling
  const handlePriceChange = (value: string) => {
    // Sanitize input
    const sanitized = sanitizeNumericInput(value);
    setPrice(sanitized);

    // Clear previous error
    setPriceError("");

    // Validate if there's a value
    if (sanitized) {
      const validation = validateNFTPrice(sanitized);
      if (!validation.isValid) {
        setPriceError(validation.error || "");
      }
    }
  };

  const validateListing = (): boolean => {
    if (!price) {
      setPriceError(t("validation.required"));
      return false;
    }

    const validation = validateNFTPrice(price);
    if (!validation.isValid) {
      setPriceError(validation.error || "");
      return false;
    }

    setPriceError("");
    return true;
  };

  const handleListNFT = async () => {
    // Validate inputs first
    if (!validateListing()) {
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
      console.log("Approving marketplace for NFT #", tokenId);
      try {
        const approveTx = await nftContract.approve(
          CONTRACT_ADDRESSES.NFTMarketplace,
          tokenId
        );
        await approveTx.wait();
        console.log("Approved");
      } catch (approveError) {
        console.error("Approval error:", approveError);
        // Check if it's because we don't own the NFT
        try {
          const currentOwner = await nftContract.ownerOf(tokenId);
          const userAddress = await signer.getAddress();
          console.log("Current owner:", currentOwner);
          console.log("User address:", userAddress);

          if (currentOwner.toLowerCase() !== userAddress.toLowerCase()) {
            alert(
              `You don't own this NFT!\nNFT Owner: ${currentOwner}\nYour Address: ${userAddress}`
            );
            setProcessing(false);
            onUpdate();
            return;
          }
        } catch (ownerError) {
          console.error("Could not verify ownership:", ownerError);
        }
        throw approveError; // Re-throw the original error
      }

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

  // Note: Since the contract doesn't have a delistNFT function,
  // we're showing a message to the user about this limitation

  return (
    <>
      <div className="nft-card owned">
        <div className="nft-image-placeholder">
          {metadataLoading ? (
            <div className="loading-spinner">Loading...</div>
          ) : metadata?.image ? (
            <>
              <Image
                src={getImageUrl(metadata.image)}
                alt={metadata.name || `NFT #${tokenId}`}
                width={300}
                height={300}
                className="nft-image"
                unoptimized
              />
            </>
          ) : (
            <span className="nft-id">#{tokenId}</span>
          )}
        </div>
        <div className="nft-info">
          <div className="nft-title-row">
            <h3>
              {metadata?.name ||
                `${t("marketplace.nftDetails.name")} #${tokenId}`}
            </h3>
            {isListed && (
              <span
                className="listing-badge-portfolio"
                title={t("marketplace.badges.listedOnMarket")}
              >
                🏷️
              </span>
            )}
          </div>

          {isListed ? (
            <>
              <div className="listed-badge">
                📋 {t("marketplace.badges.listedOnMarket")}
              </div>
              <div className="price-section">
                <span className="price-label-portfolio">
                  {t("marketplace.nftDetails.price")}
                </span>
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
              <div className="owned-badge">
                ✅ {t("marketplace.badges.owned")}
              </div>
              <div style={{ height: "0.5rem" }} />
              <button
                onClick={() => setShowListModal(true)}
                disabled={processing}
                className="btn-primary btn-small list-for-sale-btn"
                style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
              >
                🏷️ {t("marketplace.modal.listForSaleBtn")}
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
              <h3>{t("marketplace.modal.listForSale")}</h3>
              <button
                className="modal-close"
                onClick={() => setShowListModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                {t("marketplace.modal.setPriceDescription")}
              </p>
              <div className="modal-warning">
                {t("marketplace.modal.listingWarning")}
              </div>
              <div className="form-group">
                <label htmlFor="list-price">
                  {t("marketplace.modal.priceLabel")}
                </label>
                <input
                  id="list-price"
                  type="number"
                  min="0.001"
                  max="1000000"
                  step="0.001"
                  value={price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder={t("marketplace.listingPrice")}
                  className={`form-input ${priceError ? "error" : ""}`}
                  disabled={processing}
                />
                {priceError && (
                  <div className="input-error-message">{priceError}</div>
                )}
                <div className="input-hint">
                  {t("validation.minimumPrice").replace("{min}", "0.001")} -{" "}
                  {t("validation.maximumPrice").replace("{max}", "1,000,000")}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowListModal(false)}
                className="btn-secondary"
                disabled={processing}
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleListNFT}
                className="btn-primary"
                disabled={processing || !price || !!priceError}
              >
                {processing
                  ? t("marketplace.listing")
                  : t("marketplace.listNFT")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
