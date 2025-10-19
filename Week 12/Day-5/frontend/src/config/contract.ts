import platformTokenAbi from "../data/platform_token_abi.json";
import tokenFaucetAbi from "../data/token_faucet_abi.json";
import multiTokenDexAbi from "../data/multi_token_dex_abi.json";
import nftCollectionAbi from "../data/nft_collection_abi.json";
import nftMarketplaceAbi from "../data/nft_marketplace_abi.json";

import {
  PLATFORM_TOKEN_ADDRESS,
  TEST_USD_ADDRESS,
  TEST_BTC_ADDRESS,
  TOKEN_FAUCET_ADDRESS,
  MULTI_TOKEN_DEX_ADDRESS,
  NFT_COLLECTION_ADDRESS,
  NFT_MARKETPLACE_ADDRESS,
} from "./addresses";

export const PLATFORM_TOKEN_ABI = platformTokenAbi;
export const TOKEN_FAUCET_ABI = tokenFaucetAbi;
export const MULTI_TOKEN_DEX_ABI = multiTokenDexAbi;
export const NFT_COLLECTION_ABI = nftCollectionAbi;
export const NFT_MARKETPLACE_ABI = nftMarketplaceAbi;

export const TOKEN_SYMBOLS = {
  [PLATFORM_TOKEN_ADDRESS]: "CLAW",
  [TEST_USD_ADDRESS]: "TUSD",
  [TEST_BTC_ADDRESS]: "TBTC",
};

export const CONTRACT_ADDRESSES = {
  PlatformToken: PLATFORM_TOKEN_ADDRESS,
  TestUSD: TEST_USD_ADDRESS,
  TestBTC: TEST_BTC_ADDRESS,
  TokenFaucet: TOKEN_FAUCET_ADDRESS,
  MultiTokenDEX: MULTI_TOKEN_DEX_ADDRESS,
  NFTCollection: NFT_COLLECTION_ADDRESS,
  NFTMarketplace: NFT_MARKETPLACE_ADDRESS,
};
