import React from "react";
import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { abstract } from "viem/chains";
import WalletConnect from "./components/WalletConnect";
import "./App.css";

function App() {
  return (
    <AbstractWalletProvider chain={abstract}>
      <div className="App">
        <WalletConnect />
      </div>
    </AbstractWalletProvider>
  );
}

export default App;