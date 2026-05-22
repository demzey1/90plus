"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDown, Wallet, Zap } from "lucide-react";

export function WalletButton({ compact = false }: { compact?: boolean }) {
  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted, openAccountModal, openChainModal, openConnectModal }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        if (!connected) {
          return (
            <button className="wallet-pill" type="button" onClick={openConnectModal}>
              <Wallet size={18} />
              {compact ? "Connect" : "Connect Wallet"}
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button className="wallet-pill" type="button" onClick={openChainModal}>
              <Zap size={18} />
              Switch X Layer
            </button>
          );
        }

        return (
          <button className="wallet-pill" type="button" onClick={openAccountModal}>
            <span>{account.displayName}</span>
            <ChevronDown size={16} />
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}
