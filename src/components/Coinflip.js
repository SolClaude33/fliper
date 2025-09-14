import React, { useState, useEffect } from "react";
import { parseEther, formatEther } from "viem";
import { useWatchContractEvent } from "wagmi";
import "./Coinflip.css";

const COINFLIP_ADDRESS = "0xcb300ef13a41E27a29674278b4C4D68A506aFf8D";
const COINFLIP_ABI = [
  {
    "inputs": [],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "bool", "name": "choice", "type": "bool" },
      { "indexed": false, "internalType": "bool", "name": "result", "type": "bool" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "bool", "name": "won", "type": "bool" }
    ],
    "name": "FlipResult",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bool", "name": "_choice", "type": "bool" }],
    "name": "flip",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

const Coinflip = ({ client, address }) => {
  const [choice, setChoice] = useState(null);
  const [amount, setAmount] = useState("0.0001");
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [contractBalance, setContractBalance] = useState("0");
  const [pendingTx, setPendingTx] = useState(null);

  // Watch for FlipResult events from the contract
  useWatchContractEvent({
    address: COINFLIP_ADDRESS,
    abi: COINFLIP_ABI,
    eventName: 'FlipResult',
    onLogs: (logs) => {
      console.log('FlipResult event received:', logs);
      
      // Find the log for our address
      const userLog = logs.find(log => 
        log.args.player && 
        log.args.player.toLowerCase() === address?.toLowerCase()
      );
      
      if (userLog) {
        const { choice: eventChoice, result, amount: eventAmount, won } = userLog.args;
        
        const resultData = {
          choice: eventChoice ? "Heads" : "Tails",
          result: result ? "Heads" : "Tails", 
          won: won,
          amount: formatEther(eventAmount)
        };
        
        console.log('Processing result for user:', resultData);
        setLastResult(resultData);
        setIsFlipping(false);
        setPendingTx(null);
        fetchContractBalance();
      }
    },
  });

  useEffect(() => {
    if (client) {
      fetchContractBalance();
    }
  }, [client]);

  const fetchContractBalance = async () => {
    try {
      const balance = await client.readContract({
        address: COINFLIP_ADDRESS,
        abi: COINFLIP_ABI,
        functionName: "getBalance"
      });
      setContractBalance(formatEther(balance));
    } catch (error) {
      console.error("Error fetching contract balance:", error);
      setContractBalance("0");
    }
  };

  const handleFlip = async () => {
    if (!client || choice === null) return;

    try {
      setIsFlipping(true);
      setLastResult(null);

      const amountWei = parseEther(amount);

      console.log("Sending flip transaction...");
      
      // Send the transaction
      const tx = await client.writeContract({
        address: COINFLIP_ADDRESS,
        abi: COINFLIP_ABI,
        functionName: "flip",
        args: [choice],
        value: amountWei
      });

      console.log("Transaction sent:", tx);
      setPendingTx(tx);

      // The result will be handled by the event listener
      // No need to simulate - wait for the actual contract event

    } catch (error) {
      console.error("Error flipping coin:", error);
      setIsFlipping(false);
      setPendingTx(null);
    }
  };

  return (
    <div className="coinflip-container">
      <div className="coinflip-card">
        <h2 className="coinflip-title"> Penguin Fishing Club Coinflip </h2>

        <div className="contract-info">
          <p>Contract Balance: {contractBalance} ETH</p>
        </div>

        <div className="amount-section">
          <label htmlFor="amount">Bet Amount (ETH):</label>
          <input
            id="amount"
            type="number"
            step="0.0001"
            min="0.0001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="amount-input"
            disabled={isFlipping}
          />
        </div>

        <div className="choice-section">
          <h3>Choose your side:</h3>
          <div className="choice-buttons">
            <button
              className={`choice-btn ${choice === true ? "selected" : ""}`}
              onClick={() => setChoice(true)}
              disabled={isFlipping}
            >
              HEADS
            </button>
            <button
              className={`choice-btn ${choice === false ? "selected" : ""}`}
              onClick={() => setChoice(false)}
              disabled={isFlipping}
            >
              TAILS
            </button>
          </div>
        </div>

        <button
          className="flip-button"
          onClick={handleFlip}
          disabled={isFlipping || choice === null}
        >
          {isFlipping ? " FLIPPING..." : " FLIP COIN"}
        </button>

        {isFlipping && pendingTx && (
          <div className="result pending">
            <div className="processing"></div>
            <h3>Transaction Pending...</h3>
            <p>Waiting for contract event...</p>
            <p>Tx: {pendingTx.slice(0, 10)}...</p>
          </div>
        )}

        {lastResult && (
          <div className={`result ${lastResult.won === true ? "win" : lastResult.won === false ? "lose" : "pending"}`}>
            {lastResult.won === true ? (
              <>
                <div className="stars-animation">
                  <div className="star"></div>
                  <div className="star"></div>
                  <div className="star"></div>
                  <div className="star"></div>
                  <div className="star"></div>
                </div>
                <h3> YOU WON! </h3>
              </>
            ) : lastResult.won === false ? (
              <>
                <div className="sad-face"></div>
                <h3>You Lost</h3>
              </>
            ) : (
              <>
                <div className="processing"></div>
                <h3>Processing Transaction...</h3>
              </>
            )}
            <p>Your choice: {lastResult.choice}</p>
            <p>Result: {lastResult.result}</p>
            <p>Amount: {lastResult.amount} ETH</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coinflip;
