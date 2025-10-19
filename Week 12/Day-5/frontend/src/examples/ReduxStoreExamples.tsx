/**
 * REDUX STORE USAGE EXAMPLES
 *
 * This file contains practical examples of how to use the Redux store
 * in your components. Copy and adapt these patterns to your needs.
 */

// ============================================================================
// Example 1: Displaying Token Balances
// ============================================================================

import { useAppSelector } from "@/store/hooks";
import { selectAllBalances, selectTokensList } from "@/store/selectors";

function TokenBalancesExample() {
  const balances = useAppSelector(selectAllBalances);
  const tokens = useAppSelector(selectTokensList);

  return (
    <div>
      <h2>Your Token Balances</h2>
      {tokens.map((token) => {
        const balance = balances[token.address];
        return (
          <div key={token.address}>
            <strong>
              {token.name} ({token.symbol})
            </strong>
            <span>{balance?.formattedBalance || "0"}</span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Example 2: Getting Specific Token Data
// ============================================================================

import {
  selectTokenByAddress,
  selectBalanceByAddress,
} from "@/store/selectors";
import { CONTRACT_ADDRESSES } from "@/config/contract";

function SpecificTokenExample() {
  const platformToken = useAppSelector(
    selectTokenByAddress(CONTRACT_ADDRESSES.PlatformToken)
  );

  const balance = useAppSelector(
    selectBalanceByAddress(CONTRACT_ADDRESSES.PlatformToken)
  );

  if (!platformToken) return <div>Loading...</div>;

  return (
    <div>
      <h3>{platformToken.name}</h3>
      <p>Symbol: {platformToken.symbol}</p>
      <p>Decimals: {platformToken.decimals}</p>
      <p>Your Balance: {balance?.formattedBalance || "0"}</p>
    </div>
  );
}

// ============================================================================
// Example 3: Accessing Pool Reserves for DEX
// ============================================================================

import { selectPoolReserve } from "@/store/selectors";

function PoolReservesExample() {
  const { PlatformToken, TestUSD } = CONTRACT_ADDRESSES;

  const poolReserve = useAppSelector(selectPoolReserve(PlatformToken, TestUSD));

  if (!poolReserve) {
    return <div>Pool not found or not loaded</div>;
  }

  return (
    <div>
      <h3>Pool Reserves</h3>
      <p>Reserve A: {poolReserve.reserveA}</p>
      <p>Reserve B: {poolReserve.reserveB}</p>
      <p>Price: {poolReserve.price}</p>
    </div>
  );
}

// ============================================================================
// Example 4: Calculating Swap with Store Data
// ============================================================================

import { useState } from "react";
import { calculateSwapOutput } from "@/utils/dexService";

function SwapCalculatorExample() {
  const [amountIn, setAmountIn] = useState("");
  const [tokenInAddress, setTokenInAddress] = useState("");
  const [tokenOutAddress, setTokenOutAddress] = useState("");

  const tokens = useAppSelector(selectTokensList);
  const poolReserve = useAppSelector(
    selectPoolReserve(tokenInAddress, tokenOutAddress)
  );

  // Calculate output using pool reserves from store
  const amountOut = poolReserve
    ? calculateSwapOutput(amountIn, poolReserve.reserveA, poolReserve.reserveB)
    : "0";

  return (
    <div>
      <select onChange={(e) => setTokenInAddress(e.target.value)}>
        {tokens.map((token) => (
          <option key={token.address} value={token.address}>
            {token.symbol}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
        placeholder="Amount"
      />

      <select onChange={(e) => setTokenOutAddress(e.target.value)}>
        {tokens.map((token) => (
          <option key={token.address} value={token.address}>
            {token.symbol}
          </option>
        ))}
      </select>

      <div>You will receive: {amountOut}</div>
    </div>
  );
}

// ============================================================================
// Example 5: Refreshing Data After Transaction
// ============================================================================

import { useRefreshBalances, useRefreshPools } from "@/hooks/useTokenData";
import { ethers } from "ethers";
import { PLATFORM_TOKEN_ABI, CONTRACT_ADDRESSES } from "@/config/contract";
import { useWallet } from "@/context/WalletContext";

function TransactionWithRefreshExample() {
  const { signer } = useWallet();
  const { refreshBalances } = useRefreshBalances();
  const { refreshPools } = useRefreshPools();
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    try {
      setLoading(true);

      // Perform transaction
      const tokenContract = new ethers.Contract(
        CONTRACT_ADDRESSES.PlatformToken,
        PLATFORM_TOKEN_ABI,
        signer!
      );

      const tx = await tokenContract.transfer(
        "0x...", // recipient
        ethers.parseEther("10")
      );

      await tx.wait();

      // Refresh data from store after transaction
      await refreshBalances();
      await refreshPools();

      alert("Transfer successful!");
    } catch (error) {
      console.error("Transfer failed:", error);
      alert("Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleTransfer} disabled={loading}>
      {loading ? "Transferring..." : "Transfer Tokens"}
    </button>
  );
}

// ============================================================================
// Example 6: Loading States and Error Handling
// ============================================================================

import { selectTokensLoading, selectTokensError } from "@/store/selectors";

function LoadingAndErrorExample() {
  const tokens = useAppSelector(selectTokensList);
  const balances = useAppSelector(selectAllBalances);
  const loading = useAppSelector(selectTokensLoading);
  const error = useAppSelector(selectTokensError);

  if (loading) {
    return <div>Loading token data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (tokens.length === 0) {
    return <div>No tokens found</div>;
  }

  return (
    <div>
      {tokens.map((token) => (
        <div key={token.address}>
          {token.symbol}: {balances[token.address]?.formattedBalance || "0"}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Example 7: Using Token Service Utilities
// ============================================================================

import { formatTokenAmount, parseTokenAmount } from "@/utils/tokenService";

function TokenUtilitiesExample() {
  // Format wei to human-readable
  const balance = BigInt("1000000000000000000"); // 1 token in wei
  const formatted = formatTokenAmount(balance, 18); // "1.0"

  // Parse human-readable to wei
  const amount = "1.5";
  const parsed = parseTokenAmount(amount, 18); // 1500000000000000000n

  return (
    <div>
      <p>Formatted: {formatted}</p>
      <p>Parsed: {parsed.toString()}</p>
    </div>
  );
}

// ============================================================================
// Example 8: Calculating Total Portfolio Value
// ============================================================================

import { selectTotalPortfolioValue } from "@/store/selectors";

function PortfolioValueExample() {
  const totalValue = useAppSelector(selectTotalPortfolioValue);

  return (
    <div>
      <h2>Portfolio Summary</h2>
      <p className="total-value">Total Value: {totalValue} tokens</p>
    </div>
  );
}

// ============================================================================
// Example 9: Token Dropdown Component
// ============================================================================

function TokenSelectExample({
  value,
  onChange,
}: {
  value: string;
  onChange: (address: string) => void;
}) {
  const tokens = useAppSelector(selectTokensList);
  const balances = useAppSelector(selectAllBalances);

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {tokens.map((token) => {
        const balance = balances[token.address];
        return (
          <option key={token.address} value={token.address}>
            {token.symbol} (Balance: {balance?.formattedBalance || "0"})
          </option>
        );
      })}
    </select>
  );
}

// ============================================================================
// Example 10: Complete Component with All Features
// ============================================================================

function CompleteExample() {
  const [amountIn, setAmountIn] = useState("");
  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");

  // Get data from store
  const tokens = useAppSelector(selectTokensList);
  const balances = useAppSelector(selectAllBalances);
  const loading = useAppSelector(selectTokensLoading);
  const poolReserve = useAppSelector(selectPoolReserve(tokenIn, tokenOut));

  // Hooks for refreshing
  const { refreshBalances } = useRefreshBalances();
  const { signer } = useWallet();

  // Calculate output
  const amountOut = poolReserve
    ? calculateSwapOutput(amountIn, poolReserve.reserveA, poolReserve.reserveB)
    : "0";

  // Get token info
  const tokenInInfo = tokens.find((t) => t.address === tokenIn);
  const tokenInBalance = balances[tokenIn];

  const handleSwap = async () => {
    // Perform swap transaction
    // Example: const tx = await swapContract.swap(...)
    // await tx.wait();

    // Refresh data after swap
    await refreshBalances();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Token Swap</h2>

      {/* Token In Selection */}
      <div>
        <label>From</label>
        <select value={tokenIn} onChange={(e) => setTokenIn(e.target.value)}>
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
        <p>
          Balance: {tokenInBalance?.formattedBalance || "0"}{" "}
          {tokenInInfo?.symbol}
        </p>
      </div>

      {/* Amount Input */}
      <input
        type="number"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
        placeholder="0.0"
      />

      {/* Token Out Selection */}
      <div>
        <label>To</label>
        <select value={tokenOut} onChange={(e) => setTokenOut(e.target.value)}>
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
        <p>You will receive: {amountOut}</p>
      </div>

      {/* Pool Info */}
      {poolReserve && (
        <div>
          <p>Pool Liquidity:</p>
          <p>
            {poolReserve.reserveA} / {poolReserve.reserveB}
          </p>
          <p>Price: {poolReserve.price}</p>
        </div>
      )}

      {/* Swap Button */}
      <button onClick={handleSwap}>Swap</button>
    </div>
  );
}

export {
  TokenBalancesExample,
  SpecificTokenExample,
  PoolReservesExample,
  SwapCalculatorExample,
  TransactionWithRefreshExample,
  LoadingAndErrorExample,
  TokenUtilitiesExample,
  PortfolioValueExample,
  TokenSelectExample,
  CompleteExample,
};
