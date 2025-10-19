/**
 * Constants for token configuration
 */

export const TOKEN_CONFIG = {
  PLATFORM_TOKEN: {
    defaultSymbol: "CLAW",
    defaultName: "Platform Token",
  },
  TEST_USD: {
    defaultSymbol: "TUSD",
    defaultName: "Test USD",
  },
  TEST_BTC: {
    defaultSymbol: "TBTC",
    defaultName: "Test BTC",
  },
} as const;

export const DEX_CONFIG = {
  FEE_PERCENT: 0.3, // 0.3% fee
  SLIPPAGE_TOLERANCE: 0.5, // 0.5% slippage tolerance
  MIN_LIQUIDITY: "0.000001", // Minimum liquidity for pools
} as const;

export const UI_CONFIG = {
  REFRESH_INTERVAL: 30000, // 30 seconds
  DEBOUNCE_DELAY: 500, // 500ms for input debouncing
  MAX_DECIMALS_DISPLAY: 6,
  MIN_DECIMALS_DISPLAY: 2,
} as const;

/**
 * Format addresses for display
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Check if an address is valid
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + "B";
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + "M";
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + "K";
  }
  return num.toFixed(2);
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function for input handlers
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if a value is a valid number
 */
export function isValidNumber(value: string): boolean {
  if (!value || value.trim() === "") return false;
  const num = parseFloat(value);
  return !isNaN(num) && num > 0 && isFinite(num);
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumericInput(value: string): string {
  // Remove all non-numeric characters except decimal point
  let sanitized = value.replace(/[^\d.]/g, "");

  // Ensure only one decimal point
  const parts = sanitized.split(".");
  if (parts.length > 2) {
    sanitized = parts[0] + "." + parts.slice(1).join("");
  }

  return sanitized;
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Format time ago
 */
export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Open address in block explorer
 */
export function openInExplorer(
  address: string,
  type: "address" | "tx" = "address",
  network: string = "sepolia"
): void {
  const baseUrl = `https://${network}.etherscan.io`;
  const url =
    type === "tx"
      ? `${baseUrl}/tx/${address}`
      : `${baseUrl}/address/${address}`;
  window.open(url, "_blank");
}
