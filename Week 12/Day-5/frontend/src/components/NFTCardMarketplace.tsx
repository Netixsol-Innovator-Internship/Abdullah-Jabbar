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
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-hidden transition-transform duration-300 flex flex-col h-full hover:-translate-y-1">
      <div className="bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] h-[300px] flex items-center justify-center text-5xl font-bold text-white relative overflow-hidden">
        {metadataLoading ? (
          <div className="text-white text-base animate-pulse">
            {t("common.loading")}
          </div>
        ) : metadata?.image ? (
          <Image
            src={getImageUrl(metadata.image)}
            alt={metadata.name || `NFT #${tokenId}`}
            width={300}
            height={300}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          <span>#{tokenId}</span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="m-0 text-xl flex-1">
              {metadata?.name ||
                `${t("marketplace.nftDetails.name")} #${tokenId}`}
            </h3>
            {isListed && (
              <span
                className="text-lg bg-[rgba(34,197,94,0.1)] border border-[var(--success)] text-[var(--success)] px-2 py-1 rounded-md cursor-help flex-shrink-0 font-semibold"
                title={t("marketplace.badges.listedByUser")}
              >
                ✓
              </span>
            )}
          </div>

          {metadata?.description && (
            <p className="text-[var(--text-secondary)] text-sm mb-2 leading-relaxed line-clamp-2">
              {metadata.description}
            </p>
          )}

          {metadata?.attributes && metadata.attributes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 max-h-[7.8rem] overflow-hidden content-start">
              {metadata.attributes.map((attr, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--background)] border border-[var(--card-border)] px-2.5 py-1.5 rounded-md text-sm flex gap-1.5 leading-tight h-fit"
                >
                  <span className="text-[var(--text-secondary)] font-medium">
                    {attr.trait_type}:
                  </span>
                  <span className="text-[var(--primary-color)] font-semibold">
                    {attr.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="my-2">
            <div className="flex justify-between py-1.5 text-sm">
              <span className="text-[var(--text-secondary)]">
                {t("marketplace.nftDetails.owner")}:
              </span>
              <span>
                {owner.substring(0, 6)}...{owner.substring(38)}
              </span>
            </div>

            {isAvailable && priceInSelectedToken && (
              <div className="flex justify-between py-1.5 text-sm">
                <span className="text-[var(--text-secondary)]">
                  {t("marketplace.nftDetails.price")}:
                </span>
                <span className="text-[var(--primary-color)] font-bold text-lg">
                  {formatValueOrNA(priceInSelectedToken, 2, contractsAvailable)}{" "}
                  {getTokenSymbol(selectedPayment)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto pt-4">
          {/* Check if user is trying to buy their own listed NFT */}
          {seller?.toLowerCase() === account.toLowerCase() ? (
            <div className="text-center p-3 rounded-lg font-semibold bg-[rgba(34,197,94,0.1)] text-[var(--success)]">
              ✅ {t("marketplace.youOwnThis")}
            </div>
          ) : (
            <button
              onClick={handleBuyNFT}
              disabled={buying || !contractsAvailable}
              className="w-full bg-[var(--primary-color)] text-white border-none px-6 py-3 rounded-lg cursor-pointer font-semibold transition-all duration-300 hover:bg-[var(--primary-dark)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {buying ? t("marketplace.buying") : `🛒 Buy NFT`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
