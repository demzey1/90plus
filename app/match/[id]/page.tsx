'use client';

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Loader2,
  MapPin,
  Ticket,
} from "lucide-react";
import {
  fixtures,
  NINETY_PLUS_ADDRESS,
  ninetyPlusAbi,
  pickLabels,
  type ContractMatch,
  type ContractPrediction,
} from "@/lib/contract";
import { useAccount, useChainId, useReadContract, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { xLayerTestnet } from "@/lib/wagmi";
import { zeroAddress } from "viem";

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
        className="h-14 w-14 shrink-0 rounded-full border border-white/20 object-cover"
        src={`https://flagcdn.com/w80/${flag}.png`}
        alt={name}
      />
      <div className="min-w-0">
        <p className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-white/50">{label}</p>
        <h1 className="mt-1 break-words font-heading text-2xl uppercase leading-none text-white md:text-3xl">
          {name}
        </h1>
      </div>
    </div>
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

export default function MatchPage() {
  const params = useParams<{ id: string }>();
  const routeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const match = useMemo(() => fixtures.find((fixture) => String(fixture.id) === routeId), [routeId]);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync, isPending } = useWriteContract();

  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    data: matchData,
    isLoading: isLoadingOnchainMatch,
    isError: isMatchReadError,
  } = useReadContract({
    address: NINETY_PLUS_ADDRESS,
    abi: ninetyPlusAbi,
    functionName: "matches",
    args: [BigInt(match?.id ?? 0)],
    chainId: xLayerTestnet.id,
    query: { enabled: !!match },
  });

  // Read existing prediction from on-chain
  const { data: predictionData, refetch } = useReadContract({
    address: NINETY_PLUS_ADDRESS,
    abi: ninetyPlusAbi,
    functionName: "predictions",
    args: [BigInt(match?.id ?? 0), address ?? zeroAddress],
    chainId: xLayerTestnet.id,
    query: { enabled: !!address && !!match },
  });

  const prediction = predictionData as ContractPrediction | undefined;
  const onchainMatch = matchData as ContractMatch | undefined;
  const alreadyMinted = Boolean(prediction?.[0]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    chainId: xLayerTestnet.id,
  });

  const matchExists = Boolean(onchainMatch?.[3]);
  const matchFinalized = Boolean(onchainMatch?.[4]);
  const matchHidden = Boolean(onchainMatch?.[8]);
  const kickoffPassed =
    typeof onchainMatch?.[2] === "bigint" &&
    onchainMatch[2] > 0n &&
    BigInt(Math.floor(Date.now() / 1000)) >= onchainMatch[2];

  const mintUnavailableReason = isMatchReadError
    ? "Unable to verify this match on-chain right now."
    : !isLoadingOnchainMatch && !matchExists
      ? "This match is not available on-chain."
      : matchHidden
        ? "This on-chain match is currently hidden, so predictions are disabled."
        : matchFinalized
          ? "This match has already been finalized."
          : kickoffPassed
            ? "Prediction window closed at kickoff."
            : null;

  const mintDisabled =
    isPending ||
    isConfirming ||
    alreadyMinted ||
    isLoadingOnchainMatch ||
    Boolean(mintUnavailableReason);

  // Refresh the data once the transaction is confirmed
  useEffect(() => {
    if (isConfirmed) refetch();
  }, [isConfirmed, refetch]);

  async function handleMint(pick: number) {
    if (!isConnected || mintDisabled) return;
    setLocalError(null);
    try {
      if (chainId !== xLayerTestnet.id) {
        await switchChainAsync({ chainId: xLayerTestnet.id });
      }
      const txHash = await writeContractAsync({
        address: NINETY_PLUS_ADDRESS,
        abi: ninetyPlusAbi,
        functionName: "submitPrediction",
        args: [BigInt(match?.id ?? 0), pick],
      });
      setHash(txHash);
    } catch (e: any) { setLocalError(e.message || "Transaction failed"); }
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

  return (
    <main className="min-h-screen bg-[#080A0A] px-4 pb-24 sm:px-6">

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
              <h1 className="mt-4 break-words font-heading text-4xl uppercase leading-[0.92] text-white md:text-6xl">
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
            <div className="grid min-h-14 place-items-center rounded-lg border border-white/10 bg-white/5 px-4 font-score text-sm font-bold tracking-[0.18em] text-[#00FF85]">
              VS
            </div>
            <TeamPanel label="Away" name={match.away} flag={match.awayFlag} align="right" />
          </div>
        </div>

        <section className="mt-5 rounded-lg border border-white/10 bg-[#111] p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#00FF85]">NFT Prediction Ticket</p>
              <h2 className="mt-1 font-heading text-3xl uppercase text-white">Lock Your Call</h2>
            </div>
            <Ticket className="text-[#FFD700]" size={32} />
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {pickLabels.map((label, i) => (
              <button
                key={label}
                onClick={() => handleMint(i)}
                disabled={mintDisabled}
                className={`h-28 rounded-2xl border-2 text-3xl font-bold transition-all hover:scale-105 ${
                  alreadyMinted && prediction?.[1] === i
                    ? "border-[#00FF85] bg-[#00FF85]/10 text-[#00FF85]"
                    : "border-white/10 text-white/40 hover:border-white/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {mintUnavailableReason && !alreadyMinted ? (
            <div className="mt-4 rounded-lg border border-[#FFD700]/25 bg-[#FFD700]/10 p-4 text-center text-sm font-bold text-[#FFD700]">
              {mintUnavailableReason}
            </div>
          ) : null}

          {alreadyMinted && (
             <div className="mt-8 flex items-center justify-center gap-3 text-[#00FF85] text-2xl font-bold uppercase">
               <CheckCircle2 size={28} />
               Ticket Locked (#{prediction?.[4].toString()})
             </div>
          )}

          {(isPending || isConfirming) && (
            <div className="mt-6 flex items-center justify-center gap-3 text-white/70">
              <Loader2 className="animate-spin" size={20} />
              {isPending ? "Check your wallet..." : "Minting ticket on-chain..."}
            </div>
          )}

          {localError && <div className="mt-4 text-center text-sm text-red-500">{localError}</div>}
        </section>
      </section>
    </main>
  );
}
