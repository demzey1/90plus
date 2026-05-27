"use client";

import { Trophy, Wallet, User } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { NINETY_PLUS_ADDRESS, ninetyPlusAbi } from "@/lib/contract";
import { xLayerTestnet } from "@/lib/wagmi";
import { WalletButton } from "@/components/WalletButton";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: points } = useReadContract({
    address: NINETY_PLUS_ADDRESS,
    abi: ninetyPlusAbi,
    functionName: "totalPoints",
    args: [address || "0x0000000000000000000000000000000000000000"],
    chainId: xLayerTestnet.id,
    query: {
      enabled: !!address,
    },
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 pb-24 text-[#f5f5f5] sm:px-6">
      <section className="mx-auto w-full max-w-4xl pt-8 md:pt-12">
        <div className="mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00FF85]">
            World Rankings
          </span>
          <h1 className="mt-3 font-heading text-4xl uppercase leading-none md:text-6xl">
            Leaderboard
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
            Real-time standings based on on-chain prediction accuracy. Points are awarded when matches are finalized by the contract owner.
          </p>
        </div>

        {!isConnected ? (
          <div className="flex flex-col items-center justify-center rounded-sm border border-white/5 bg-white/[0.02] py-20 text-center">
            <Wallet className="mb-4 text-[#444]" size={40} />
            <h2 className="font-heading text-2xl uppercase text-white">Identity Required</h2>
            <p className="mt-2 max-w-xs text-xs text-white/40 uppercase tracking-widest leading-loose">
              Connect your wallet to see your ranking and global points.
            </p>
            <div className="mt-8">
              <WalletButton />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-sm border border-[#00FF85]/20 bg-[#00FF85]/5 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00FF85]/10">
                  <User className="text-[#00FF85]" size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#00FF85]">Your Standing</p>
                  <p className="font-mono text-xs text-white/60">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Points</p>
                <p className="font-heading text-4xl text-white">{mounted ? points?.toString() || "0" : "---"}</p>
              </div>
            </div>

            <div className="rounded-sm border border-white/5 bg-white/[0.01] p-12 text-center">
              <Trophy className="mx-auto mb-4 text-[#222]" size={32} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#444]">
                Global rankings are being indexed
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}