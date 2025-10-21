/**
 * Validation utilities for input fields
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  errorKey?: string;
  errorParams?: Record<string, string | number>;
}

/**
 * Validate numeric input for amounts
 */
export const validateAmount = (
  value: string,
  options: {
    min?: number;
    max?: number;
    maxDecimals?: number;
    allowZero?: boolean;
  } = {}
): ValidationResult => {
  const { min = 0, max, maxDecimals = 18, allowZero = false } = options;

  // Check if value is empty
  if (!value || value.trim() === "") {
    return {
      isValid: false,
      error: "Amount is required",
      errorKey: "validation.required",
    };
  }

  // Check if value is a valid number
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return {
      isValid: false,
      error: "Please enter a valid number",
      errorKey: "validation.invalidNumber",
    };
  }

  // Check if value is negative
  if (numValue < 0) {
    return {
      isValid: false,
      error: "Amount cannot be negative",
      errorKey: "validation.negative",
    };
  }

  // Check if zero is allowed
  if (!allowZero && numValue === 0) {
    return {
      isValid: false,
      error: "Amount must be greater than 0",
      errorKey: "validation.mustBeGreaterThanZero",
    };
  }

  // Check minimum value
  if (numValue < min) {
    return {
      isValid: false,
      error: `Amount must be at least ${min}`,
      errorKey: "validation.mustBeAtLeast",
      errorParams: { min: min.toString() },
    };
  }

  // Check maximum value
  if (max !== undefined && numValue > max) {
    return {
      isValid: false,
      error: `Amount cannot exceed ${max}`,
      errorKey: "validation.cannotExceed",
      errorParams: { max: max.toString() },
    };
  }

  // Check decimal places
  const decimalPart = value.split(".")[1];
  if (decimalPart && decimalPart.length > maxDecimals) {
    return {
      isValid: false,
      error: `Maximum ${maxDecimals} decimal places allowed`,
      errorKey: "validation.maxDecimals",
      errorParams: { decimals: maxDecimals.toString() },
    };
  }

  return { isValid: true };
};

/**
 * Validate balance sufficiency
 */
export const validateBalance = (
  amount: string,
  balance: string | number,
  tokenSymbol: string = "tokens"
): ValidationResult => {
  const amountNum = parseFloat(amount);
  const balanceNum =
    typeof balance === "string" ? parseFloat(balance) : balance;

  if (isNaN(amountNum) || isNaN(balanceNum)) {
    return { isValid: false, error: "Invalid amount or balance" };
  }

  if (amountNum > balanceNum) {
    return {
      isValid: false,
      error: `Insufficient ${tokenSymbol} balance. Available: ${balanceNum.toFixed(6)}`,
    };
  }

  return { isValid: true };
};

/**
 * Validate NFT listing price
 */
export const validateNFTPrice = (price: string): ValidationResult => {
  // Basic amount validation
  const baseValidation = validateAmount(price, {
    min: 0.001, // Minimum 0.001 tokens
    max: 1000000, // Maximum 1M tokens
    maxDecimals: 6,
    allowZero: false,
  });

  if (!baseValidation.isValid) {
    return baseValidation;
  }

  const priceNum = parseFloat(price);

  // Additional NFT-specific validations
  if (priceNum < 0.001) {
    return { isValid: false, error: "Minimum price is 0.001 CLAW" };
  }

  if (priceNum > 1000000) {
    return { isValid: false, error: "Maximum price is 1,000,000 CLAW" };
  }

  return { isValid: true };
};

/**
 * Validate DEX swap amount
 */
export const validateSwapAmount = (
  amount: string,
  balance: string,
  tokenSymbol: string
): ValidationResult => {
  // Basic amount validation
  const baseValidation = validateAmount(amount, {
    min: 0.000001, // Minimum 0.000001 tokens (1 wei in ETH terms)
    maxDecimals: 18,
    allowZero: false,
  });

  if (!baseValidation.isValid) {
    return baseValidation;
  }

  // Balance validation
  const balanceValidation = validateBalance(amount, balance, tokenSymbol);
  if (!balanceValidation.isValid) {
    return balanceValidation;
  }

  return { isValid: true };
};

/**
 * Sanitize numeric input (remove invalid characters)
 */
export const sanitizeNumericInput = (value: string): string => {
  // Allow only digits, one decimal point, and leading minus
  return value
    .replace(/[^0-9.-]/g, "")
    .replace(/(\..*?)\./g, "$1") // Remove extra decimal points
    .replace(/^(-?)0+(?=\d)/g, "$1"); // Remove leading zeros
};

/**
 * Format number for display with proper decimal places
 */
export const formatDisplayNumber = (
  value: string | number,
  maxDecimals: number = 6
): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
};
