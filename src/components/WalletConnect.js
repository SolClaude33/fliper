import React, { useState } from "react";
import { useLoginWithAbstract, useAbstractClient } from "@abstract-foundation/agw-react";
import { useAccount } from "wagmi";
import Coinflip from "./Coinflip";
import "./WalletConnect.css";

const WalletConnect = () => {
  const { login } = useLoginWithAbstract();
  const { data: client } = useAbstractClient();
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await login();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignMessage = async () => {
    if (!client) return;

    try {
      setIsLoading(true);
      const message = "Welcome to Penguin Fishing Club coinflip";
      
      // Sign the message using Abstract Global Wallet
      const signature = await client.signMessage({
        message: message,
      });
      
      setIsSigned(true);
      console.log("Message signed:", signature);
      console.log("Message:", message);
    } catch (error) {
      console.error("Failed to sign message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    window.location.href = "https://penguin-fishing-club.vercel.app/game";
  };

  return (
    <div className="wallet-container">
      {/* Back button */}
      <button 
        onClick={handleGoBack}
        className="back-button"
        title="Back to Penguin Fishing Club"
      >
      </button>

      {/* Wallet display after signing */}
      {isSigned && address && (
        <div className="wallet-display">
          <div className="wallet-address">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>
      )}

      {/* Show coinflip after signing */}
      {isSigned && client && address ? (
        <Coinflip client={client} address={address} />
      ) : isConnected && !isSigned ? (
        <div className="wallet-connected">
          <button 
            onClick={handleSignMessage}
            disabled={isLoading}
            className="sign-button"
          >
            {isLoading ? "SIGNING..." : "SIGN"}
          </button>
        </div>
      ) : !isConnected ? (
        <div className="wallet-connect">
          <button 
            onClick={handleConnect}
            disabled={isLoading}
            className="connect-button"
          >
            {isLoading ? "Connecting..." : "Connect with Abstract Global Wallet"}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default WalletConnect;
