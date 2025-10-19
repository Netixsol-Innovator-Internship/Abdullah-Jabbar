"use client"; "use client";



import { useState, useEffect } from "react"; import { useState, useEffect } from "react";

import { ethers } from "ethers"; import { ethers } from "ethers";

import {import {

  CONTRACT_ADDRESSES, CONTRACT_ADDRESSES,

  TOKEN_FAUCET_ABI, TOKEN_FAUCET_ABI,

} from "@/config/contract"; PLATFORM_TOKEN_ABI,

import { useWallet } from "@/context/WalletContext";} from "@/config/contract";

import { useAppSelector } from "@/store/hooks"; import { useWallet } from "@/context/WalletContext";

import {import { isContractAvailable, formatValueOrNA } from "@/utils/contractUtils";

selectBalanceByAddress,

  selectTokenByAddress,export default function FaucetPage() {

  } from "@/store/selectors"; const { signer, account, isConnected } = useWallet();

import { useRefreshBalances } from "@/hooks/useTokenData"; const [claiming, setClaiming] = useState(false);

import { isContractAvailable, formatValueOrNA } from "@/utils/contractUtils"; const [canClaim, setCanClaim] = useState(false);

const [timeUntilClaim, setTimeUntilClaim] = useState(0);

export default function FaucetPage() {
  const [totalClaimed, setTotalClaimed] = useState("0");

  const { signer, account, isConnected } = useWallet(); const [balance, setBalance] = useState("0");

  const { refreshBalances } = useRefreshBalances(); const [claimAmount, setClaimAmount] = useState("0");

  const [faucetBalance, setFaucetBalance] = useState("0");

  // Get platform token data from Redux  const [contractsAvailable, setContractsAvailable] = useState(false);

  const platformToken = useAppSelector(

    selectTokenByAddress(CONTRACT_ADDRESSES.PlatformToken)  const isFaucetDeployed = isContractAvailable(CONTRACT_ADDRESSES.TokenFaucet);

  ); const isPlatformTokenDeployed = isContractAvailable(

  const platformBalance = useAppSelector(CONTRACT_ADDRESSES.PlatformToken

    selectBalanceByAddress(CONTRACT_ADDRESSES.PlatformToken));

  );

  useEffect(() => {

    const [claiming, setClaiming] = useState(false); setContractsAvailable(isFaucetDeployed && isPlatformTokenDeployed);

    const [canClaim, setCanClaim] = useState(false);
  }, [isFaucetDeployed, isPlatformTokenDeployed]);

  const [timeUntilClaim, setTimeUntilClaim] = useState(0);

  const [totalClaimed, setTotalClaimed] = useState("0"); useEffect(() => {

    const [claimAmount, setClaimAmount] = useState("0"); if (signer && account && contractsAvailable) {

      const [faucetBalance, setFaucetBalance] = useState("0"); void loadFaucetData();

      const [contractsAvailable, setContractsAvailable] = useState(false); const interval = setInterval(() => void loadFaucetData(), 5000);

      return () => clearInterval(interval);

      const isFaucetDeployed = isContractAvailable(CONTRACT_ADDRESSES.TokenFaucet);
    }

    const isPlatformTokenDeployed = isContractAvailable(    // eslint-disable-next-line react-hooks/exhaustive-deps

      CONTRACT_ADDRESSES.PlatformToken  }, [signer, account, contractsAvailable]);

  );

  const loadFaucetData = async () => {

    useEffect(() => {
      try {

        setContractsAvailable(isFaucetDeployed && isPlatformTokenDeployed); const faucetContract = new ethers.Contract(

  }, [isFaucetDeployed, isPlatformTokenDeployed]); CONTRACT_ADDRESSES.TokenFaucet,

      TOKEN_FAUCET_ABI,

      useEffect(() => {
        signer!

        if (signer && account && contractsAvailable) {      );

    void loadFaucetData();

    const interval = setInterval(() => void loadFaucetData(), 5000); const tokenContract = new ethers.Contract(

      return () => clearInterval(interval); CONTRACT_ADDRESSES.PlatformToken,

    }        PLATFORM_TOKEN_ABI,

  // eslint-disable-next-line react-hooks/exhaustive-deps        signer!

}, [signer, account, contractsAvailable]);      );



const loadFaucetData = async () => {
  const canClaimNow = await faucetContract.canClaim(account);

  try {
    setCanClaim(canClaimNow);

    const faucetContract = new ethers.Contract(

      CONTRACT_ADDRESSES.TokenFaucet,      if (!canClaimNow) {

        TOKEN_FAUCET_ABI,        const time = await faucetContract.getTimeUntilNextClaim(account);

        signer!        setTimeUntilClaim(Number(time));

      );      } else {

  setTimeUntilClaim(0);

  const canClaimNow = await faucetContract.canClaim(account);
}

setCanClaim(canClaimNow);

const claimed = await faucetContract.getTotalClaimed(account);

if (!canClaimNow) {
  setTotalClaimed(ethers.formatEther(claimed));

  const time = await faucetContract.getTimeUntilNextClaim(account);

  setTimeUntilClaim(Number(time)); const bal = await tokenContract.balanceOf(account);

} else {
  setBalance(ethers.formatEther(bal));

  setTimeUntilClaim(0);

} const amount = await faucetContract.claimAmount();

setClaimAmount(ethers.formatEther(amount));

const claimed = await faucetContract.getTotalClaimed(account);

setTotalClaimed(ethers.formatEther(claimed)); const faucetBal = await faucetContract.getFaucetBalance();

setFaucetBalance(ethers.formatEther(faucetBal));

const amount = await faucetContract.claimAmount();    } catch (error) {

  setClaimAmount(ethers.formatEther(amount)); console.error("Error loading faucet data:", error);

}

const faucetBal = await faucetContract.getFaucetBalance();  };

setFaucetBalance(ethers.formatEther(faucetBal));

    } catch (error) {
  const handleClaimTokens = async () => {

    console.error("Error loading faucet data:", error); try {

    }      setClaiming(true);

  };

  const faucetContract = new ethers.Contract(

  const handleClaimTokens = async () => {
    CONTRACT_ADDRESSES.TokenFaucet,

    try {
      TOKEN_FAUCET_ABI,

      setClaiming(true); signer!

      );

  const faucetContract = new ethers.Contract(

    CONTRACT_ADDRESSES.TokenFaucet,      const tx = await faucetContract.claimTokens();

  TOKEN_FAUCET_ABI, console.log("Transaction sent:", tx.hash);

  signer!

      ); await tx.wait();

  console.log("Transaction confirmed!");

  const tx = await faucetContract.claimTokens();

  console.log("Transaction sent:", tx.hash); alert("Tokens claimed successfully! 🎉");

  await loadFaucetData();

  await tx.wait();
} catch (error) {

  console.log("Transaction confirmed!"); console.error("Error claiming tokens:", error);

  const errorMessage =

    alert("Tokens claimed successfully! 🎉"); error instanceof Error ? error.message : "Unknown error";

  alert("Failed to claim tokens: " + errorMessage);

  // Refresh balance from Redux store    } finally {

  await refreshBalances(); setClaiming(false);

  await loadFaucetData();
}

    } catch (error) { };

console.error("Error claiming tokens:", error);

const errorMessage =  const formatTime = (seconds: number) => {

  error instanceof Error ? error.message : "Unknown error"; const hours = Math.floor(seconds / 3600);

  alert("Failed to claim tokens: " + errorMessage); const minutes = Math.floor((seconds % 3600) / 60);

} finally {
  const secs = seconds % 60;

  setClaiming(false); return `${hours}h ${minutes}m ${secs}s`;

}  };

  };

if (!isConnected) {

  const formatTime = (seconds: number) => {
    return (

    if (seconds === 0) return "Now!"; <div className="connect-prompt">

      <div className="connect-card">

        const hours = Math.floor(seconds / 3600);          <h1>👋 Welcome to DeFi + NFT Ecosystem</h1>

        const minutes = Math.floor((seconds % 3600) / 60);          <p>Connect your MetaMask wallet to get started</p>

        const secs = seconds % 60;        </div>

    </div>

    if (hours > 0) {    );

      return `${hours}h ${minutes}m ${secs}s`;
    }

  } else if (minutes > 0) {

    return `${minutes}m ${secs}s`; return (

    }    <div className="page-container">

    return `${secs}s`;      <div className="page-header">

  };        <h1>💧 Token Faucet</h1>

        <p>Claim free CLAW tokens every 24 hours</p>

  if (!isConnected) {      </div>

    return (

      <div className="connect-prompt">      <div className="card-grid">

        <div className="connect-card">        <div className="card claim-card">

          <h1>👋 Connect your wallet</h1>          <h2>Claim Tokens</h2>

          <p>Please connect MetaMask to access the faucet</p>          <div className="claim-amount">

        </div>            <span className="amount">

      </div>              {formatValueOrNA(claimAmount, 2, contractsAvailable)}

    );            </span>

  }            <span className="token-symbol">CLAW</span>

          </div>

  if (!contractsAvailable) {

    return (          {canClaim ? (

      <div className="page-container">            <button

        <div className="card">              onClick={handleClaimTokens}

          <h2>⚠️ Contracts Not Deployed</h2>              disabled={claiming}

          <p>              className="btn-primary btn-large"

            The faucet and token contracts have not been deployed yet. Please            >

            deploy them first.              {claiming ? "Claiming..." : "🎁 Claim Tokens"}

          </p>            </button>

        </div>          ) : (

      </div>            <div className="cooldown-info">

    );              <p className="cooldown-text">⏰ Next claim available in:</p>

  }              <p className="cooldown-timer">{formatTime(timeUntilClaim)}</p>

            </div>

  return (          )}

    <div className="page-container">        </div>

      <div className="page-header">

        <h1>💧 Token Faucet</h1>        <div className="card stats-card">

        <p>Get free {platformToken?.symbol || "CLAW"} tokens for testing</p>          <h2>Your Statistics</h2>

      </div>          <div className="stat-row">

            <span className="stat-label">Your Balance:</span>

      <div className="faucet-container">            <span className="stat-value">

        <div className="card faucet-card">              {formatValueOrNA(

          <div className="faucet-icon">💎</div>                parseFloat(balance).toFixed(2),

          <h2>Claim {platformToken?.symbol || "CLAW"} Tokens</h2>                2,

          <p className="faucet-description">                contractsAvailable

            Claim {claimAmount} {platformToken?.symbol || "CLAW"} tokens every 24 hours              )}{" "}

          </p>              CLAW

            </span>

          <div className="faucet-stats">          </div>

            <div className="stat-item">          <div className="stat-row">

              <span className="stat-label">Your Balance</span>            <span className="stat-label">Total Claimed:</span>

              <span className="stat-value">            <span className="stat-value">

                {formatValueOrNA(              {formatValueOrNA(

                  platformBalance                parseFloat(totalClaimed).toFixed(2),

                    ? parseFloat(platformBalance.formattedBalance)                2,

                    : 0,                contractsAvailable

                  4,              )}{" "}

                  contractsAvailable              CLAW

                )}{" "}            </span>

                {platformToken?.symbol || "CLAW"}          </div>

              </span>          <div className="stat-row">

            </div>            <span className="stat-label">Faucet Balance:</span>

            <span className="stat-value">

            <div className="stat-item">              {formatValueOrNA(

              <span className="stat-label">Claim Amount</span>                parseFloat(faucetBalance).toFixed(2),

              <span className="stat-value">                2,

                {claimAmount} {platformToken?.symbol || "CLAW"}                contractsAvailable

              </span>              )}{" "}

            </div>              CLAW

            </span>

            <div className="stat-item">          </div>

              <span className="stat-label">Total Claimed</span>        </div>

              <span className="stat-value">      </div>

                {totalClaimed} {platformToken?.symbol || "CLAW"}

              </span>      <div className="info-section">

            </div>        <h3>ℹ️ How it works</h3>

        <ul>

            <div className="stat-item">          <li>

              <span className="stat-label">Faucet Balance</span>            Click &quot;Claim Tokens&quot; to receive{" "}

              <span className="stat-value">            {formatValueOrNA(claimAmount, 2, contractsAvailable)} CLAW tokens

                {parseFloat(faucetBalance).toFixed(2)} {platformToken?.symbol || "CLAW"}          </li>

              </span>          <li>You can claim once every 24 hours</li>

            </div>          <li>Use CLAW tokens to trade on the DEX or buy NFTs</li>

          </div > <li>Free tokens for testing the platform!</li>

        </ul >

    {!canClaim && timeUntilClaim > 0 && (      </div >

            <div className="cooldown-notice">    </div>

              <span className="cooldown-icon">⏳</span>  );

  <p>}

    Next claim available in:{" "}
    <strong>{formatTime(timeUntilClaim)}</strong>
  </p>
            </div >
          )
}

<button
  onClick={() => void handleClaimTokens()}
  disabled={claiming || !canClaim}
  className="btn-primary btn-large faucet-btn"
>
  {claiming
    ? "Claiming..."
    : canClaim
      ? `💧 Claim ${claimAmount} ${platformToken?.symbol || "CLAW"}`
      : `⏳ Wait ${formatTime(timeUntilClaim)}`}
</button>
        </div >

  <div className="card info-card">
    <h3>ℹ️ How It Works</h3>
    <ul className="info-list">
      <li>
        <strong>Free Tokens:</strong> Get {claimAmount} {platformToken?.symbol || "CLAW"} tokens
        every 24 hours
      </li>
      <li>
        <strong>No Cost:</strong> Claiming is completely free (only gas
        fees apply)
      </li>
      <li>
        <strong>Testing Purpose:</strong> Use these tokens to test the DEX
        and NFT marketplace
      </li>
      <li>
        <strong>Cooldown:</strong> You must wait 24 hours between claims
      </li>
    </ul>

    <div className="tips-section">
      <h4>💡 Quick Tips</h4>
      <p>After claiming tokens, you can:</p>
      <ul>
        <li>Trade them on the DEX</li>
        <li>Buy NFTs in the marketplace</li>
        <li>View your balance in the portfolio</li>
      </ul>
    </div>
  </div>
      </div >
    </div >
  );
}
