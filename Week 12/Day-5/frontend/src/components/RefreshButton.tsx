"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/i18n/i18nContext";

interface RefreshButtonProps {
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  title?: string;
  className?: string;
}

export default function RefreshButton({
  onRefresh,
  disabled = false,
  title,
  className = "",
}: RefreshButtonProps) {
  const { t } = useI18n();
  const [refreshing, setRefreshing] = useState(false);

  const handleClick = async () => {
    if (disabled || refreshing) return;

    setRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      // Delay to allow animation to complete (1.5s for 3 spins)
      setTimeout(() => setRefreshing(false), 1500);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || refreshing}
      className={`btn-refresh-page ${className}`}
      title={title || t("common.refresh")}
      aria-label={title || t("common.refresh")}
    >
      <Image
        src="/refresh.svg"
        alt={title || t("common.refresh")}
        width={24}
        height={24}
        className={refreshing ? "spinning" : ""}
      />
    </button>
  );
}
