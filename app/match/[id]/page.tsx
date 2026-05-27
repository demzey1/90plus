'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useQueryClient } from "@tanstack/react-query";

import {
  useAccount,
  useChainId,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import { zeroAddress } from "viem";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  Loader2,
  MapPin,
  Share2,
  ShieldCheck,
  Ticket,
} from "lucide-react";

const ConfettiBurst = dynamic(() => import("@/components/ConfettiBurst"), { ssr: false });

import {
  type ContractPrediction,
  type PickChoice,
  fixtures,
  NINETY_PLUS_ADDRESS,
  ninetyPlusAbi,
  pickLabels,
} from "@/lib/contract";
import { xLayerTestnet } from "@/lib/wagmi";

const TICKET_REFRESH_KEY = "ninety-plus-ticket-refresh";
const TICKET_REFRESH_EVENT = "ninety-plus-ticket-refresh";

const formatKickoff = (value: string) =>
  new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));

function TeamPanel({
  label,
  name,
  flag,
  align = "left",
}: {
  label: string;
  name: string;
  flag: string;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 ${
        align === "right" ? "sm:flex-row-reverse sm:text-right" : ""
      }`}
    >
      <img
        className="h-14 w-14 shrink-0 rounded-full border border-white/20 object-cover shadow-[0_0_22px_rgba(0,255,133,0.16)]"
        src={`https://flagcdn.com/w80/${flag}.png`}
        alt={name}
      />
      <div className="min-w-0">
        <p className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-white/50">{label}</p>
        <h1 className="mt-1 break-words font-heading text-3xl uppercase leading-[0.95] text-white md:text-4xl">
          {name}
        </h1>
      </div>
    </div>
  );
}

function PickButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`pick-button pick-button-call ${active ? "pick-button-active" : ""}`}
      style={{ fontSize: "2.2rem", minHeight: 100 }}
    >
      {label}
    </button>
  );
}

function DetailChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.055]">{icon}</div>
      <div className="min-w-0">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-white/40">{label}</p>
        <p className="mt-1 break-words text-sm text-white/80">{value}</p>
      </div>
    </div>
  );
}

function StatusPanel({
  prediction,
  pick,
  explorerUrl,
  shareUrl,
  justConfirmed,
}: {
  prediction: ContractPrediction | undefined;
  pick: PickChoice;
  explorerUrl: string | null;
  shareUrl: string;
  justConfirmed: boolean;
}) {
  if (!prediction?.[0] && !justConfirmed) {
    return null;
  }
  const token = prediction?.[6]?.toString();
  return (
    <div className="rounded-lg border border-[#00FF85]/25 bg-[#00FF85]/[0.075] p-4 shadow-[inset_0_0_34px_rgba(0,255,133,0.08)]">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 shrink-0 text-[#00FF85]" size={22} />
        <div className="min-w-0">
          <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#00FF85]">
            {prediction?.[0] ? "Ticket Minted" : "Confirmed"}
          </p>
          <h3 className="mt-1 font-heading text-2xl uppercase leading-none text-white">
            {prediction?.[0] ? `Token #${token}` : "Syncing Ticket"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-white/70">
            {pickLabels[pick]} call.{" "}
            {prediction?.[0]
              ? "This NFT ticket is now readable on-chain."
              : "The transaction confirmed; refreshing the on-chain ticket state."}
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {explorerUrl ? (
          <a
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] px-3 text-sm font-black text-white transition hover:border-[#00FF85]/40"
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
          >
            Explorer
            <ExternalLink size={15} />
          </a>
        ) : null}
        {shareUrl ? (
          <a
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] px-3 text-sm font-black text-white transition hover:border-[#00FF85]/40"
            href={shareUrl}
            target="_blank"
            rel="noreferrer"
          >
            Share
            <Share2 size={15} />
          </a>
        ) : null}
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#00FF85]/50 bg-[#00FF85] px-3 text-sm font-black text-[#04100B] shadow-[0_0_24px_rgba(0,255,133,0.22)]"
          href="/my-tickets"
        >
          My Tickets
          <Ticket size={15} />
        </Link>
      </div>
    </div>
  );
}

export default function MatchPage() {
  const params = useParams<{ id: string }>();
  const routeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const match = useMemo(() => fixtures.find((fixture) => String(fixture.id) === routeId), [routeId]);
  const queryClient = useQueryClient();

  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedPick, setSelectedPick] = useState<PickChoice>(0);
  const [submittedPick, setSubmittedPick] = useState<PickChoice | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();
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
    isFetching: isPredictionFetching,
    error: predictionError,
  } = useReadContract({
    address: NINETY_PLUS_ADDRESS,
    abi: ninetyPlusAbi,
    functionName: "predictions",
    args: [BigInt(match?.id ?? 0), address ?? zeroAddress],
    chainId: xLayerTestnet.id,
    query: {
      enabled: Boolean(address && match),
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
    },
  });

  const prediction = predictionData as ContractPrediction | undefined;
  const alreadyMinted = Boolean(prediction?.[0]);
  const currentPick = (alreadyMinted && prediction ? (prediction[1] as PickChoice) : (submittedPick ?? selectedPick)) as PickChoice;

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    chainId: xLayerTestnet.id,
  });

  useEffect(() => {
    if (!isConfirmed) return;

    void refetch();
    void queryClient.invalidateQueries();

    window.localStorage.setItem(TICKET_REFRESH_KEY, String(Date.now()));
    window.dispatchEvent(new Event(TICKET_REFRESH_EVENT));
  }, [isConfirmed, queryClient, refetch]);

  const explorerUrl = useMemo(() => {
    if (!hash) return null;
    return `${xLayerTestnet.blockExplorers.default.url}/tx/${hash}`;
  }, [hash]);

  const shareUrl = useMemo(() => {
    if (!match || typeof window === "undefined") return "";
    const token = prediction?.[6] ? `Token #${prediction[6].toString()}` : "ticket";
    const text =
      `I minted my 90+ ${token} for ${match.home} vs ${match.away}. ` +
      `Pick: ${pickLabels[currentPick]}.`;
    return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
  }, [currentPick, match, prediction]);

  async function handleMint(pick: PickChoice) {
    if (!match) return;
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
      const txHash = await writeContractAsync({
        address: NINETY_PLUS_ADDRESS,
        abi: ninetyPlusAbi,
        functionName: "submitPrediction",
        args: [BigInt(match.id), pick, 0, 0],
        chainId: xLayerTestnet.id,
      });
      setHash(txHash);

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "Transaction failed");
    }
  }

  if (!match) {
    return (
      <main className="min-h-screen bg-[#080A0A] px-4 pb-24 sm:px-6">
        <section className="mx-auto max-w-2xl pt-10">
          <Link className="inline-flex items-center gap-2 text-sm font-black text-[#00FF85]" href="/matches">
            <ArrowLeft size={16} />
            Back to matches
          </Link>
          <div className="mt-6 rounded-lg border border-white/10 bg-[#0c1210]/90 p-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#00FF85]">Match Not Found</p>
            <h1 className="mt-3 font-heading text-4xl uppercase leading-none text-white">Unknown Fixture</h1>
            <p className="mt-3 text-sm leading-6 text-white/70">
              This match is not on the current 90+ board.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const busy = isPending || isConfirming || isPredictionLoading || isPredictionFetching;
  const mintDisabled = busy || alreadyMinted;

  return (
    <main className="min-h-screen bg-[#080A0A] px-4 pb-24 sm:px-6">
      {showConfetti && (
        <>
          <ConfettiBurst />
          <div className="fixed left-1/2 top-20 z-[10000] -translate-x-1/2 rounded-lg bg-[#04100B]/80 px-6 py-2 text-2xl font-black uppercase tracking-widest text-[#00FF85] shadow-lg backdrop-blur-md animate-fade-in-out">
            Minted!
          </div>
        </>
      )}

      <section className="mx-auto w-full max-w-5xl pt-8 md:pt-12">
        <Link className="inline-flex items-center gap-2 text-sm font-black text-[#00FF85]" href="/matches">
          <ArrowLeft size={16} />
          Back to matches
        </Link>

        <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-[#0c1210]/90 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.36)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <span className="rounded-full border border-[#00FF85]/25 bg-[#00FF85]/10 px-3 py-1.5 text-[0.7rem] font-black uppercase tracking-[0.2em] text-[#00FF85]">
                {match.group}
              </span>
              <h1 className="mt-4 break-words font-heading text-4xl uppercase leading-[0.92] text-white drop-shadow-[0_0_16px_rgba(0,255,133,0.34)] md:text-6xl">
                {match.home} vs {match.away}
              </h1>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:w-[360px] lg:grid-cols-1">
              <DetailChip
                icon={<CalendarClock className="text-[#FFD700]" size={17} />}
                label="Kickoff"
                value={formatKickoff(match.kickoff)}
              />
              <DetailChip
                icon={<MapPin className="text-[#00FF85]" size={17} />}
                label="Venue"
                value={`${match.stadium}, ${match.city}`}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
            <TeamPanel label="Home" name={match.home} flag={match.homeFlag} />
            <div className="grid min-h-14 place-items-center rounded-lg border border-[#00FF85]/25 bg-[#00FF85]/10 px-4 font-score text-sm font-bold tracking-[0.18em] text-[#00FF85]">
              VS
            </div>
            <TeamPanel label="Away" name={match.away} flag={match.awayFlag} align="right" />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {(["Home", "Draw", "Away"] as const).map((label, index) => (
              <div key={label} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-white/40">
                  {label} Odds
                </p>
                <p className="mt-1 font-score text-lg text-white">
                  {[match.odds.home, match.odds.draw, match.odds.away][index]}%
                </p>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-5 rounded-lg border border-white/10 bg-[#0c1210]/90 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#00FF85]">
                NFT Prediction Ticket
              </p>
              <h2 className="mt-2 font-heading text-3xl uppercase leading-none text-white md:text-4xl">
                Lock Your Call
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                Pick the outcome and mint a readable on-chain ticket for this fixture.
              </p>
            </div>
            <Ticket className="shrink-0 text-[#FFD700]" size={30} />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {pickLabels.map((label, index) => (
              <PickButton
                key={label}
                label={label}
                active={currentPick === index}
                disabled={mintDisabled}
                onClick={() => void handleMint(index as PickChoice)}
              />
            ))}
          </div>

          {busy ? (
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-[#00FF85]/20 bg-[#00FF85]/[0.055] p-3 text-sm text-white/80">
              <Loader2 className="animate-spin text-[#00FF85]" size={17} />
              {isPending
                ? "Sending transaction..."
                : isConfirming
                  ? "Waiting for X Layer confirmation..."
                  : "Reading ticket state..."}
            </div>
          ) : null}

          {predictionError ? (
            <div className="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm leading-6 text-red-100">
              Unable to read this ticket from X Layer right now. Your wallet can try again after the RPC
              responds.
            </div>
          ) : null}

          <StatusPanel
            prediction={prediction}
            pick={currentPick}
            explorerUrl={explorerUrl}
            shareUrl={shareUrl}
            justConfirmed={isConfirmed && !alreadyMinted}
          />

          {localError ? (
            <div className="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm leading-6 text-red-100">
              {localError}
            </div>
          ) : null}

          {!isConnected ? (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-white/70">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#00FF85]" size={18} />
              Connect your wallet to mint on X Layer testnet.
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}