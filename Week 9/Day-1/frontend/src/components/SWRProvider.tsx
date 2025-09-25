"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";

interface SWRProviderProps {
  children: ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 0, // Disable automatic refresh by default
        revalidateOnFocus: false, // Disable revalidation on window focus by default
        revalidateOnReconnect: true, // Revalidate when connection is restored
        errorRetryCount: 3, // Retry failed requests up to 3 times
        errorRetryInterval: 1000, // Wait 1 second between retries
        dedupingInterval: 2000, // Dedupe requests within 2 seconds
        onError: (error) => {
          console.error("SWR Error:", error);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
