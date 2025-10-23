"use client";

import { useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/context/WalletContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loadTokensInfo,
  loadTokenBalances,
  clearBalances,
} from "@/store/tokenSlice";
import { loadAllPoolReserves } from "@/store/dexSlice";
import { selectIsDataLoaded } from "@/store/selectors";
import { KASPLEX_TESTNET_RPC } from "@/config/addresses";

/**
 * Custom hook to automatically load and sync token data with the blockchain
 * This should be used at the app level to ensure data is always fresh
 */
export function useTokenData() {
  const dispatch = useAppDispatch();
  const { account, signer, isConnected } = useWallet();
  const isDataLoaded = useAppSelector(selectIsDataLoaded);

  // Load initial token info when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      if (!isDataLoaded && typeof window !== "undefined") {
        // Only try to load if wallet is available
        if (!window.ethereum) {
          // No wallet provider available - skip loading to avoid RPC errors
          return;
        }

        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          // Verify we can actually use this provider
          await provider.getNetwork();

          await dispatch(loadTokensInfo(provider));
          await dispatch(loadAllPoolReserves(provider));
        } catch (error) {
          // Silently fail - data will load when user connects wallet
          console.warn(
            "Unable to load initial data:",
            error instanceof Error ? error.message : error
          );
        }
      }
    };

    void loadInitialData();
  }, [dispatch, isDataLoaded]);

  // Load balances when wallet connects
  useEffect(() => {
    const loadBalances = async () => {
      if (isConnected && account && signer) {
        try {
          await dispatch(
            loadTokenBalances({ accountAddress: account, provider: signer })
          );
        } catch (error) {
          console.error("Error loading balances:", error);
        }
      } else if (!isConnected) {
        dispatch(clearBalances());
      }
    };

    void loadBalances();
  }, [dispatch, isConnected, account, signer]);

  // Refresh pool reserves periodically (every 30 seconds)
  useEffect(() => {
    if (!isConnected || !window.ethereum) return;

    const intervalId = setInterval(async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await dispatch(loadAllPoolReserves(provider));
      } catch (error) {
        console.warn(
          "Error refreshing pool reserves:",
          error instanceof Error ? error.message : error
        );
      }
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [dispatch, isConnected]);

  return {
    isDataLoaded,
  };
}

/**
 * Hook to refresh token balances on demand
 */
export function useRefreshBalances() {
  const dispatch = useAppDispatch();
  const { account, signer, isConnected } = useWallet();

  const refreshBalances = async () => {
    if (isConnected && account && signer) {
      try {
        await dispatch(
          loadTokenBalances({ accountAddress: account, provider: signer })
        );
      } catch (error) {
        console.error("Error refreshing balances:", error);
      }
    }
  };

  return { refreshBalances };
}

/**
 * Hook to refresh pool reserves on demand
 */
export function useRefreshPools() {
  const dispatch = useAppDispatch();

  const refreshPools = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      console.warn("Wallet not available - cannot refresh pools");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await dispatch(loadAllPoolReserves(provider));
    } catch (error) {
      console.warn(
        "Error refreshing pools:",
        error instanceof Error ? error.message : error
      );
    }
  };

  return { refreshPools };
}
