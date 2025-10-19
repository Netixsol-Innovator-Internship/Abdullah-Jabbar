"use client";

import { useTokenData } from "@/hooks/useTokenData";

export function TokenDataLoader({ children }: { children: React.ReactNode }) {
  useTokenData();
  return <>{children}</>;
}
