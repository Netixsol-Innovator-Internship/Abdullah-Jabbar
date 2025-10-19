import { ethers } from "ethers";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * Check if a contract address is deployed (not zero address)
 */
export const isContractDeployed = (address: string): boolean => {
  return (
    address !== ZERO_ADDRESS &&
    address !== "" &&
    ethers.getAddress(address) !== ethers.getAddress(ZERO_ADDRESS)
  );
};

/**
 * Format value or return NA if contract not deployed
 */
export const formatValueOrNA = (
  value: string | number,
  decimals: number = 2,
  isDeployed: boolean = true,
  suffix: string = ""
): string => {
  if (!isDeployed) {
    return "NA";
  }

  if (typeof value === "string") {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return "NA";
    }
    return `${numValue.toFixed(decimals)}${suffix ? " " + suffix : ""}`;
  }

  return `${value.toFixed(decimals)}${suffix ? " " + suffix : ""}`;
};

/**
 * Check if a contract is available before attempting to interact
 */
export const isContractAvailable = (address: string): boolean => {
  return (
    Boolean(address) &&
    address !== ZERO_ADDRESS &&
    address !== "0x0000000000000000000000000000000000000000"
  );
};

/**
 * Get display message for unavailable contract
 */
export const getContractUnavailableMessage = (contractName: string): string => {
  return `${contractName} has not been deployed yet`;
};
