"use client";

import { useState } from "react";
import { Ticket, Loader2, CheckCircle2, ExternalLink, Share2 } from "lucide-react";
import { zeroAddress } from "viem";
import {
  useAccount,
  useChainId,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  type ContractPrediction,
  type PickChoice,
  NINETY_PLUS_ADDRESS,
  ninetyPlusAbi,
  pickLabels,
} from "@/lib/contract";
import { xLayerTestnet } from "@/lib/wagmi";

export function MatchMintPanel({ match }: { match: any }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { openConnectModal } = useConnectModal();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync, isPending } = useWriteContract();

  const [selectedPick, setSelectedPick] = useState<PickChoice>(0);
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [localError, setLocalError] = useState<string | null>(null);

  const { data: predictionData } = useReadContract({
    address: NINETY_PLUS_ADDRESS,
    abi: ninetyPlusAbi,
    functionName: "predictions",
    args: [BigInt(match.id), address ?? zeroAddress],
    chainId: xLayerTestnet.id,
  });

  const prediction = predictionData as ContractPrediction | undefined;
  const alreadyMinted = Boolean(prediction?.[0]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    chainId: xLayerTestnet.id,
  });

  async function handleSubmit(pick: PickChoice) {
    if (!match) return;
    setLocalError(null);
    setSelectedPick(pick);

    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    try {
      if (chainId !== xLayerTestnet.id) {
        await switchChainAsync({ chainId: xLayerTestnet.id });
      }

      const txHash = await writeContractAsync({
        address: NINETY_PLUS_ADDRESS,
        abi: ninetyPlusAbi,
        functionName: "submitPrediction",
        args: [BigInt(match.id), pick],
        chainId: xLayerTestnet.id,
      });

      setHash(txHash);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Transaction failed.";
      setLocalError(msg);
    }
  }

  const busy = isPending || isConfirming;
  const mintDisabled = busy || alreadyMinted;

  return (
    <section className="mt-5 rounded-lg border border-white/10 bg-[#111] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase text-[#00FF85]">NFT Prediction Ticket</p>
          <h2 className="mt-1 text-3xl font-bold">Lock Your Call</h2>
        </div>
        <Ticket className="text-[#FFD700]" size={32} />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {pickLabels.map((label, index) => (
          <button
            key={label}
            onClick={() => handleSubmit(index as PickChoice)}
            disabled={mintDisabled}
            className={`h-28 rounded-2xl border-2 text-3xl font-bold transition-all hover:scale-105 ${
              selectedPick === index 
                ? "border-[#00FF85] bg-[#00FF85]/10 text-[#00FF85]" 
                : "border-white/20 hover:border-white/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {busy && (
        <div className="mt-6 flex items-center gap-3 text-sm text-white/70">
          <Loader2 className="animate-spin" size={18} />
          {isPending ? "Sending transaction..." : "Confirming..."}
        </div>
      )}

      {isConfirmed && (
        <div className="mt-6 flex items-center gap-3 text-[#00FF85]">
          <CheckCircle2 size={22} />
          <span className="font-bold">Ticket Minted Successfully!</span>
        </div>
      )}

      {localError && (
        <div className="mt-6 rounded border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {localError}
        </div>
      )}
    </section>
  );
}
