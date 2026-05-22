"use client";

import { ShieldAlert, Zap } from "lucide-react";
import { useChainId, useSwitchChain } from "wagmi";
import { xLayerTestnet } from "@/lib/wagmi";

export function NetworkAutoSwitch() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (chainId === xLayerTestnet.id) {
    return null;
  }

  return (
    <div className="network-banner">
      <div className="network-banner-copy">
        <ShieldAlert size={22} color="#FFD700" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/45">Wrong network</p>
          <p className="font-heading text-2xl uppercase leading-none md:text-3xl">X Layer testnet required</p>
        </div>
      </div>
      <button
        className="primary-action network-switch-button"
        type="button"
        disabled={isPending}
        onClick={() => switchChain?.({ chainId: xLayerTestnet.id })}
      >
        <Zap size={18} />
        {isPending ? "Switching..." : "Switch to X Layer"}
      </button>
    </div>
  );
}
