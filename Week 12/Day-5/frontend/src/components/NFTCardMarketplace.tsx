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
import { useI18n } from "@/i18n/i18nContext";

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
  const { t } = useI18n();
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

      console.log(t("marketplace.approveTokens"));
      const approveTx = await paymentTokenContract.approve(
        CONTRACT_ADDRESSES.NFTMarketplace,
        paymentAmount
      );
      await approveTx.wait();
      console.log("Tokens approved");

      console.log(t("marketplace.buyingNFT"));

      // Since marketplace only shows listed NFTs, always use buyListedNFT
      const buyTx = await marketplaceContract.buyListedNFT(
        tokenId,
        selectedPayment
      );

      await buyTx.wait();
      console.log("NFT purchased!");

      alert(t("marketplace.purchaseSuccess"));
      onBuySuccess();
    } catch (error) {
      console.error("Error buying NFT:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(t("marketplace.purchaseFailed") + ": " + errorMessage);
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="nft-card">
      <div className="nft-image-placeholder">
        {metadataLoading ? (
          <div className="loading-spinner">{t("common.loading")}</div>
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
            <h3>
              {metadata?.name ||
                `${t("marketplace.nftDetails.name")} #${tokenId}`}
            </h3>
            {isListed && (
              <span
                className="listing-badge"
                title={t("marketplace.badges.listedByUser")}
              >
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
              <span className="label">
                {t("marketplace.nftDetails.owner")}:
              </span>
              <span className="value">
                {owner.substring(0, 6)}...{owner.substring(38)}
              </span>
            </div>

            {isAvailable && priceInSelectedToken && (
              <div className="metadata-item">
                <span className="label">
                  {t("marketplace.nftDetails.price")}:
                </span>
                <span className="value price">
                  {formatValueOrNA(priceInSelectedToken, 2, contractsAvailable)}{" "}
                  {getTokenSymbol(selectedPayment)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="nft-actions">
          {/* Check if user is trying to buy their own listed NFT */}
          {seller?.toLowerCase() === account.toLowerCase() ? (
            <div className="owned-badge">✅ {t("marketplace.youOwnThis")}</div>
          ) : (
            <button
              onClick={handleBuyNFT}
              disabled={buying || !contractsAvailable}
              className="btn-primary btn-buy"
            >
              {buying ? t("marketplace.buying") : `🛒 Buy Listed NFT`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
