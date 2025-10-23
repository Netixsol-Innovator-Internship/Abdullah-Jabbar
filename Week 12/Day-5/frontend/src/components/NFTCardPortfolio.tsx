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
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-hidden transition-transform duration-300 flex flex-col h-full hover:-translate-y-1">
        <div className="bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] h-[300px] flex items-center justify-center text-5xl font-bold text-white relative overflow-hidden">
          {metadataLoading ? (
            <div className="text-white text-base animate-pulse">Loading...</div>
          ) : metadata?.image ? (
            <>
              <Image
                src={getImageUrl(metadata.image)}
                alt={metadata.name || `NFT #${tokenId}`}
                width={300}
                height={300}
                className="w-full h-full object-cover"
                unoptimized
              />
            </>
          ) : (
            <span>#{tokenId}</span>
          )}
        </div>
        <div className="p-6 flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="m-0 text-xl flex-1">
              {metadata?.name ||
                `${t("marketplace.nftDetails.name")} #${tokenId}`}
            </h3>
            {isListed && (
              <span
                className="text-xl flex-shrink-0 cursor-help"
                title={t("marketplace.badges.listedOnMarket")}
              >
                🏷️
              </span>
            )}
          </div>

          {isListed ? (
            <>
              <div className="text-center p-3 rounded-lg font-semibold bg-[rgba(245,158,11,0.1)] text-[var(--warning-color)] border border-[var(--warning-color)]">
                📋 {t("marketplace.badges.listedOnMarket")}
              </div>
              <div className="mt-3">
                <span className="block text-sm text-[var(--text-secondary)] font-semibold mb-2 uppercase tracking-wide">
                  {t("marketplace.nftDetails.price")}
                </span>
                <div
                  className="text-center py-3 px-2 bg-[rgba(99,102,241,0.1)] border border-[var(--primary-color)] rounded-lg text-base font-bold text-[var(--primary-color)] tracking-wide whitespace-nowrap overflow-hidden text-ellipsis"
                  title={listingPrice}
                >
                  <span className="cursor-help">
                    {(listingPrice ?? "").length > 15
                      ? `${(listingPrice ?? "").slice(0, 15)}...`
                      : (listingPrice ?? "")}
                  </span>
                  <span> CLAW</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="text-center p-3 rounded-lg font-semibold bg-[rgba(34,197,94,0.1)] text-[var(--success)] mb-0">
                ✅ {t("marketplace.badges.owned")}
              </div>
              <div style={{ height: "0.5rem" }} />
              <button
                onClick={() => setShowListModal(true)}
                disabled={processing}
                className="px-4 py-3 text-sm w-full bg-[var(--primary-color)] text-white border-none rounded-lg cursor-pointer font-semibold transition-all duration-300 hover:bg-[var(--primary-dark)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black/75 flex items-center justify-center z-[2000] p-4 backdrop-blur-sm"
          onClick={() => setShowListModal(false)}
        >
          <div
            className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl max-w-[500px] w-full max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[var(--card-border)] flex justify-between items-center">
              <h3 className="m-0 text-xl">
                {t("marketplace.modal.listForSale")}
              </h3>
              <button
                className="bg-transparent border-none text-[var(--text-secondary)] text-4xl cursor-pointer leading-none p-0 w-8 h-8 flex items-center justify-center transition-colors duration-300 hover:text-[var(--text-primary)]"
                onClick={() => setShowListModal(false)}
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <p className="text-[var(--text-secondary)] mb-6 text-sm">
                {t("marketplace.modal.setPriceDescription")}
              </p>
              <div className="bg-[rgba(245,158,11,0.1)] border border-[var(--warning-color)] text-[var(--warning-color)] p-4 rounded-lg text-sm mb-6 leading-relaxed">
                {t("marketplace.modal.listingWarning")}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="list-price"
                  className="block mb-2 font-medium text-[var(--text-primary)]"
                >
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
                  className={`w-full p-3 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-[var(--text-primary)] text-base transition-colors duration-300 focus:outline-none focus:border-[var(--primary-color)] disabled:opacity-60 disabled:cursor-not-allowed ${priceError ? "!border-[var(--danger-color)] !shadow-[0_0_0_2px_rgba(239,68,68,0.1)]" : ""}`}
                  disabled={processing}
                />
                {priceError && (
                  <div className="text-[var(--danger-color)] text-sm mt-1 block">
                    {priceError}
                  </div>
                )}
                <div className="text-[var(--text-secondary)] text-xs mt-1 block">
                  {t("validation.minimumPrice").replace("{min}", "0.001")} -{" "}
                  {t("validation.maximumPrice").replace("{max}", "1,000,000")}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[var(--card-border)] flex gap-4 justify-end">
              <button
                onClick={() => setShowListModal(false)}
                className="bg-[var(--background)] text-[var(--text-primary)] border border-[var(--card-border)] px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={processing}
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleListNFT}
                className="bg-[var(--primary-color)] text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-[var(--primary-dark)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
