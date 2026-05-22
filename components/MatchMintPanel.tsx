"use client";

import { Share2, ShieldCheck, Ticket } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
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
  type Fixture,
  type PickChoice,
  NINETY_PLUS_ADDRESS,
  ninetyPlusAbi,
  pickLabels,
} from "@/lib/contract";
import { xLayerTestnet } from "@/lib/wagmi";

const confettiPieces = Array.from({ length: 24 }, (_, index) => ({
  left: `${(index * 17) % 100}%`,
  delay: `${(index % 8) * 90}ms`,
  duration: `${1400 + (index % 5) * 180}ms`,
  size: `${8 + (index % 4) * 3}px`,
  hue: index % 3 === 0 ? "#00b36b" : index % 3 === 1 ? "#ffd700" : "#f6fff9",
}));

function OutcomeButton({
  label,
  pick,
  active,
  disabled,
  onClick,
}: {
  label: string;
  pick: PickChoice;
  active: boolean;
  disabled: boolean;
  onClick: (pick: PickChoice) => void;
}) {
  return (
    <button
      className={`pick-button pick-button-call ${active ? "pick-button-active" : ""}`}
      type="button"
      disabled={disabled}
      onClick={() => onClick(pick)}
    >
      <span className="block text-xs tracking-[0.3em] text-white/45">SUBMIT</span>
      {label}
    </button>
  );
}

export function MatchMintPanel({ match }: { match: Fixture }) {
  const [selectedPick, setSelectedPick] = useState<PickChoice>(0);
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [celebrate, setCelebrate] = useState(false);
  const [submittedPick, setSubmittedPick] = useState<PickChoice | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { openConnectModal } = useConnectModal();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync, isPending } = useWriteContract();

  const {
    data: predictionData,
    refetch,
    isLoading: isPredictionLoading,
    error: predictionError,
  } = useReadContract({
    address: NINETY_PLUS_ADDRESS,
    abi: ninetyPlusAbi,
    functionName: "predictions",
    args: [BigInt(match.id), address ?? zeroAddress],
    chainId: xLayerTestnet.id,
    query: {
      enabled: Boolean(address),
    },
  });

  const prediction = predictionData as ContractPrediction | undefined;
  const alreadyMinted = Boolean(prediction?.[0]);
  const mintedPick = (prediction?.[1] ?? submittedPick ?? selectedPick) as PickChoice;

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    chainId: xLayerTestnet.id,
  });

  useEffect(() => {
    if (isConfirmed) {
      setCelebrate(true);
      void refetch();

      try {
        localStorage.setItem("ticketMinted", String(Date.now()));
        window.dispatchEvent(
          new CustomEvent("ticket:minted", { detail: { matchId: match.id, tokenId: prediction?.[4]?.toString() } }),
        );
      } catch (e) {
        // ignore
      }
    }
  }, [isConfirmed, refetch, match.id, prediction]);

  useEffect(() => {
    if (!celebrate) return undefined;
    const timer = window.setTimeout(() => setCelebrate(false), 3600);
    return () => window.clearTimeout(timer);
  }, [celebrate]);

  const explorerUrl = useMemo(() => (hash ? `${xLayerTestnet.blockExplorers.default.url}/tx/${hash}` : null), [hash]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const status = prediction?.[0] ? "locked" : "submitted";
    const token = prediction?.[4] ? `Token #${prediction[4].toString()}` : "Ticket";
    const tweet = `I just ${status} my ${token} for ${match.home} vs ${match.away} on 90+. Pick: ${pickLabels[mintedPick]}.`;
    return `https://x.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(window.location.href)}`;
  }, [match.away, match.home, mintedPick, prediction]);

  async function handleSubmit(pick: PickChoice) {
    setLocalError(null);
    setSelectedPick(pick);
    setSubmittedPick(pick);

    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    try {
      if (chainId !== xLayerTestnet.id) {
        await switchChainAsync({ chainId: xLayerTestnet.id });
      }

      // No score prediction UX: pass zeros for score args
      const txHash = await writeContractAsync({
        address: NINETY_PLUS_ADDRESS,
        abi: ninetyPlusAbi,
        functionName: "submitPrediction",
        args: [BigInt(match.id), pick],
        chainId: xLayerTestnet.id,
      });

      setHash(txHash);
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "Transaction failed");
    }
  }

  return (
    <section className="panel panel-glow relative overflow-hidden p-5 md:p-7">
      {celebrate ? (
        <div className="confetti-layer" aria-hidden="true">
          {confettiPieces.map((piece, index) => (
            <span
              key={`${piece.left}-${index}`}
              className="confetti-piece"
              style={{
                left: piece.left,
                animationDelay: piece.delay,
                animationDuration: piece.duration,
                background: piece.hue,
                width: piece.size,
                height: `calc(${piece.size} * 0.45)`,
              } as CSSProperties}
            />
          ))}
        </div>
      ) : null}

      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="eyebrow text-sm text-white/70">NFT Prediction Ticket</span>
            <h2 className="mt-3 font-heading text-2xl md:text-3xl uppercase leading-none">Lock Your Call</h2>
          </div>
          <Ticket size={34} color="#FFD700" />
        </div>

        <div className="pick-grid">
          {pickLabels.map((label, index) => (
            <OutcomeButton
              key={label}
              label={label}
              pick={index as PickChoice}
              active={selectedPick === index}
              disabled={isPending || isConfirming || alreadyMinted || isPredictionLoading}
              onClick={handleSubmit}
            />
          ))}
        </div>

        <div className="grid gap-3 border-t border-white/10 pt-4">
          <div>
            <p className="text-xs font-black uppercase text-white/45">Pick</p>
            <p className="font-score text-xl text-pitch">{pickLabels[selectedPick]}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-white/45">Match ID</p>
            <p className="font-score text-xl text-white">#{match.id}</p>
          </div>
        </div>

        {isPredictionLoading ? <div className="loading-banner">Reading on-chain ticket state...</div> : null}

        {predictionError ? (
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">Unable to read this ticket from X Layer.</div>
        ) : null}

        {isPending || isConfirming ? (
          <div className="loading-banner">{isPending ? "Sending transaction..." : "Waiting for X Layer confirmation..."}</div>
        ) : null}

        {alreadyMinted && prediction ? (
          <div className="success-panel">
            <div className="flex items-start gap-3">
              <ShieldCheck size={24} color="#00b36b" />
              <div>
                <p className="text-sm font-black uppercase text-pitch">Minted</p>
                <p className="font-heading text-2xl uppercase leading-none">Ticket locked on-chain</p>
                <p className="mt-2 text-sm text-white/70">Token #{prediction[4].toString()} recorded for {pickLabels[prediction[1] as PickChoice]}.</p>
              </div>
            </div>
            <div className="success-actions">
              {explorerUrl ? (
                <a className="secondary-action w-full" href={explorerUrl} target="_blank" rel="noreferrer">View on X Layer Explorer</a>
              ) : null}
              {shareUrl ? (
                <a className="primary-action w-full" href={shareUrl} target="_blank" rel="noreferrer"><Share2 size={18} />Share on X</a>
              ) : null}
            </div>
          </div>
        ) : null}

        {isConfirmed && !alreadyMinted ? (
          <div className="success-panel">
            <div className="flex items-start gap-3">
              <ShieldCheck size={24} color="#00b36b" />
              <div>
                <p className="text-sm font-black uppercase text-pitch">Success</p>
                <p className="font-heading text-2xl uppercase leading-none">Prediction minted</p>
                <p className="mt-2 text-sm text-white/70">Your {pickLabels[(prediction?.[1] as PickChoice | undefined) ?? submittedPick ?? selectedPick]} call is live on X Layer testnet.</p>
              </div>
            </div>
            <div className="success-actions">
              {explorerUrl ? (
                <a className="secondary-action w-full" href={explorerUrl} target="_blank" rel="noreferrer">View on X Layer Explorer</a>
              ) : null}
              {shareUrl ? (
                <a className="primary-action w-full" href={shareUrl} target="_blank" rel="noreferrer"><Share2 size={18} />Share on X</a>
              ) : null}
            </div>
          </div>
        ) : null}

        {localError ? <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{localError}</div> : null}
      </div>
    </section>
  );
}
