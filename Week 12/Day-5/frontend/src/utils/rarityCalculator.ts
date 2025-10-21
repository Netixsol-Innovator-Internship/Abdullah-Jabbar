"use client";

import { NFTMetadata } from "@/types/nft";

interface RarityStats {
  [traitType: string]: {
    [value: string]: number;
  };
}

interface NFTRarity {
  tokenId: number;
  rarityScore: number;
  traitScores: {
    [traitType: string]: number;
  };
}

export default function calculateRarity(nfts: {
  [id: string]: NFTMetadata;
}): NFTRarity[] {
  // If no NFTs, return empty array
  if (!nfts || Object.keys(nfts).length === 0) {
    return [];
  }

  // Count traits frequency across all NFTs
  const rarityStats: RarityStats = {};
  const nftIds = Object.keys(nfts);
  const totalNFTs = nftIds.length;

  // Initialize rarityStats with all trait types and values
  nftIds.forEach((id) => {
    const nft = nfts[id];

    if (!nft || !nft.attributes) return;

    nft.attributes.forEach((attr) => {
      const { trait_type, value } = attr;

      // Initialize trait type if it doesn't exist yet
      if (!rarityStats[trait_type]) {
        rarityStats[trait_type] = {};
      }

      // Initialize value for this trait if it doesn't exist yet
      if (!rarityStats[trait_type][String(value)]) {
        rarityStats[trait_type][String(value)] = 0;
      }

      // Increment count for this trait value
      rarityStats[trait_type][String(value)]++;
    });
  });

  // Calculate rarity scores for each NFT
  const nftRarities: NFTRarity[] = nftIds.map((id) => {
    const nft = nfts[id];
    const tokenId = parseInt(id);
    let rarityScore = 0;
    const traitScores: { [traitType: string]: number } = {};

    if (!nft || !nft.attributes) {
      return { tokenId, rarityScore: 0, traitScores: {} };
    }

    // Calculate rarity score based on traits
    nft.attributes.forEach((attr) => {
      const { trait_type, value } = attr;
      const traitValue = String(value);

      // Calculate trait rarity (1 / frequency)
      const frequency = rarityStats[trait_type][traitValue] / totalNFTs;
      const traitScore = 1 / frequency;

      // Add to overall rarity score
      rarityScore += traitScore;

      // Store trait score
      traitScores[trait_type] = parseFloat(traitScore.toFixed(2));
    });

    return {
      tokenId,
      rarityScore: parseFloat(rarityScore.toFixed(2)),
      traitScores,
    };
  });

  // Sort by rarity score (highest to lowest)
  nftRarities.sort((a, b) => b.rarityScore - a.rarityScore);

  return nftRarities;
}
