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
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await dispatch(loadTokensInfo(provider));
          await dispatch(loadAllPoolReserves(provider));
        } catch (error) {
          console.error("Error loading initial token data:", error);
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
    if (!isConnected) return;

    const intervalId = setInterval(async () => {
      if (typeof window !== "undefined") {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await dispatch(loadAllPoolReserves(provider));
        } catch (error) {
          console.error("Error refreshing pool reserves:", error);
        }
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
    if (typeof window !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await dispatch(loadAllPoolReserves(provider));
      } catch (error) {
        console.error("Error refreshing pools:", error);
      }
    }
  };

  return { refreshPools };
}
