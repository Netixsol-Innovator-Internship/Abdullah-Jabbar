// utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number | { $numberDecimal?: string } | undefined,
  currency: string = "USD"
): string {
  // Handle undefined
  if (amount === undefined) return "$0.00";

  // Convert Decimal128 from MongoDB to number
  let numericAmount: number;
  if (
    typeof amount === "object" &&
    amount !== null &&
    "$numberDecimal" in amount
  ) {
    numericAmount = parseFloat(amount.$numberDecimal || "0");
  } else {
    numericAmount = typeof amount === "number" ? amount : 0;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}
