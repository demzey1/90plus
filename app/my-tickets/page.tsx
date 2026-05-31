"use client";

import { CalendarClock, MapPin, RefreshCcw, ShieldCheck, Ticket, Trophy, Wallet } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo } from "react";
import { zeroAddress } from "viem";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import {
  type ContractMatch,
  type ContractPrediction,
  type PickChoice,
  fixtures,
  NINETY_PLUS_ADDRESS,
  ninetyPlusAbi,
  pickLabels,
} from "@/lib/contract";
import { xLayerTestnet } from "@/lib/wagmi";
import { WalletButton } from "@/components/WalletButton";

type TicketMatch = {
  id: number;
  home: string;
  away: string;
  homeFlag?: string;
  awayFlag?: string;
  group: string;
  stadium: string;
  city: string;
  kickoff: string;
  finalized: boolean;
  homeScore: number;
  awayScore: number;
};

type TicketRecord = {
  match: TicketMatch;
  prediction: ContractPrediction;
};

const formatKickoff = (value: string) => {
  try {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return value;
  }
};

const normalizeName = (value: string) => value.trim().toLowerCase();

const findFixtureForMatch = (matchId: number, onchainMatch?: ContractMatch) => {
  const byId = fixtures.find((fixture) => fixture.id === matchId);

  if (!onchainMatch) {
    return byId;
  }

  const home = normalizeName(onchainMatch[0]);
  const away = normalizeName(onchainMatch[1]);

  return (
    fixtures.find(
      (fixture) =>
        normalizeName(fixture.home) === home &&
        normalizeName(fixture.away) === away,
    ) ?? byId
  );
};

const toIsoKickoff = (kickoffSeconds?: bigint, fallback?: string) => {
  if (!kickoffSeconds || kickoffSeconds === 0n) {
    return fallback ?? "";
  }

  return new Date(Number(kickoffSeconds) * 1000).toISOString();
};

const buildTicketMatch = (matchId: number, onchainMatch?: ContractMatch): TicketMatch => {
  const fixture = findFixtureForMatch(matchId, onchainMatch);

  return {
    id: matchId,
    home: onchainMatch?.[0] || fixture?.home || `Match ${matchId}`,
    away: onchainMatch?.[1] || fixture?.away || "Opponent",
    homeFlag: fixture?.homeFlag,
    awayFlag: fixture?.awayFlag,
    group: fixture?.group || "On-chain fixture",
    stadium: fixture?.stadium || "On-chain venue",
    city: fixture?.city || "",
    kickoff: toIsoKickoff(onchainMatch?.[2], fixture?.kickoff),
    finalized: Boolean(onchainMatch?.[4]),
    homeScore: onchainMatch?.[5] ?? 0,
    awayScore: onchainMatch?.[6] ?? 0,
  };
};

const initials = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

function TeamIcon({ flag, name }: { flag?: string; name: string }) {
  if (flag) {
    return (
      <img
        className="h-10 w-10 rounded-full object-cover"
        src={`https://flagcdn.com/w80/${flag}.png`}
        alt={name}
      />
    );
  }

  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-black text-white/70">
      {initials(name)}
    </span>
  );
}

const formatVenue = (match: TicketMatch) => {
  if (match.stadium && match.city) {
    return `${match.stadium}, ${match.city}`;
  }

  return match.stadium || match.city || "On-chain fixture";
};

function TicketCard({ ticket }: { ticket: TicketRecord }) {
  const { match, prediction } = ticket;
  const pick = pickLabels[prediction[1] as PickChoice];
  const points = prediction[3];

  return (
    <article className="overflow-hidden rounded-sm border border-white/10 bg-[#0d0d0d] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888]">
            Ticket #{prediction[4].toString()}
          </p>
          <h2 className="mt-2 break-words font-heading text-2xl uppercase leading-none text-[#f5f5f5]">
            {match.home} vs {match.away}
          </h2>
        </div>
        <Trophy className="shrink-0 text-[#FFD700]" size={24} />
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <div className={`flex flex-col items-center ${pick === "HOME" ? "font-black text-[#00FF85] scale-110" : "opacity-60"}`}>
          <TeamIcon flag={match.homeFlag} name={match.home} />
          <span className="mt-2 text-[10px] uppercase tracking-tighter">Home</span>
        </div>
        <div className={`flex flex-col items-center ${pick === "DRAW" ? "font-black text-[#FFD700] scale-110" : "opacity-60"}`}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-black">
            D
          </span>
          <span className="mt-2 text-[10px] uppercase tracking-tighter">Draw</span>
        </div>
        <div className={`flex flex-col items-center ${pick === "AWAY" ? "font-black text-[#FF3B5C] scale-110" : "opacity-60"}`}>
          <TeamIcon flag={match.awayFlag} name={match.away} />
          <span className="mt-2 text-[10px] uppercase tracking-tighter">Away</span>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm leading-6 text-white/60">
        <p className="flex min-w-0 items-center gap-2">
          <CalendarClock className="shrink-0 text-[#FFD700]" size={15} />
          <span className="min-w-0 break-words">{formatKickoff(match.kickoff)}</span>
        </p>
        <p className="flex min-w-0 items-center gap-2">
          <MapPin className="shrink-0 text-[#00FF85]" size={15} />
          <span className="min-w-0 break-words">{formatVenue(match)}</span>
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-white/40">Group</p>
          <p className="mt-1 text-sm text-white/70">{match.group}</p>
        </div>
        <div className="flex items-center gap-3">
          {match.finalized ? (
            <span className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-black text-white/65">
              {match.homeScore}-{match.awayScore}
            </span>
          ) : null}
          {points > 0 ? (
            <span className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#FFD700]/40 bg-[#FFD700]/10 px-4 text-sm font-black text-[#FFD700]">
              {points.toString()} PTS
            </span>
          ) : null}
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#00FF85]/40 bg-[#00FF85]/10 px-4 text-sm font-black text-[#00FF85] transition hover:bg-[#00FF85] hover:text-[#04100B]"
            href={`/match/${match.id}`}
          >
            View Match
          </Link>
        </div>
      </div>
    </article>
  );
}

function ConnectState() {
  return (
    <section className="rounded-lg border border-white/10 bg-[#0c1210]/90 p-6 text-center shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:p-8">
      <Wallet className="mx-auto text-[#00FF85]" size={40} />
      <h2 className="mt-4 font-heading text-4xl uppercase leading-none text-white">Connect Wallet</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/70">
        Your minted prediction tickets appear here as soon as your wallet is connected on X Layer.
      </p>
      <div className="mt-6 flex justify-center">
        <WalletButton />
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="rounded-lg border border-white/10 bg-[#0c1210]/90 p-6 text-center shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:p-8">
      <Ticket className="mx-auto text-[#FFD700]" size={40} />
      <h2 className="mt-4 font-heading text-4xl uppercase leading-none text-white">No Tickets Yet</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/70">
        Mint a match prediction ticket and it will show here after the transaction confirms.
      </p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg border border-[#00FF85]/50 bg-[#00FF85] px-5 text-sm font-black text-[#04100B] shadow-[0_0_24px_rgba(0,255,133,0.22)]"
        href="/matches"
      >
        Browse Matches
      </Link>
    </section>
  );
}

export default function MyTicketsPage() {
  const { address, isConnected } = useAccount();

  const {
    data: nextMatchId,
    isLoading: isLoadingNextMatchId,
    error: nextMatchIdError,
    refetch: refetchNextMatchId,
  } = useReadContract({
    address: NINETY_PLUS_ADDRESS,
    abi: ninetyPlusAbi,
    functionName: "nextMatchId",
    chainId: xLayerTestnet.id,
    query: {
      enabled: Boolean(address),
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
    },
  });

  const matchIds = useMemo(() => {
    const createdMatchCount =
      typeof nextMatchId === "bigint" && nextMatchId > 1n
        ? Number(nextMatchId - 1n)
        : fixtures.length;

    return Array.from({ length: createdMatchCount }, (_, index) => BigInt(index + 1));
  }, [nextMatchId]);

  const ticketReadContracts = useMemo(
    () =>
      matchIds.flatMap((matchId) => [
        {
          address: NINETY_PLUS_ADDRESS,
          abi: ninetyPlusAbi,
          functionName: "predictions",
          args: [matchId, address ?? zeroAddress] as const,
          chainId: xLayerTestnet.id,
        } as const,
        {
          address: NINETY_PLUS_ADDRESS,
          abi: ninetyPlusAbi,
          functionName: "matches",
          args: [matchId] as const,
          chainId: xLayerTestnet.id,
        } as const,
      ]),
    [address, matchIds],
  );

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch: refetchTicketReads,
  } = useReadContracts({
    contracts: ticketReadContracts,
    query: {
      enabled: Boolean(address) && matchIds.length > 0,
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      refetchInterval: isConnected ? 4000 : false,
    },
  });

  const refetch = useCallback(() => {
    void refetchNextMatchId();
    void refetchTicketReads();
  }, [refetchNextMatchId, refetchTicketReads]);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    refetch();
  }, [isConnected, address, refetch]);

  useEffect(() => {
    if (!isConnected) {
      return undefined;
    }

    const refresh = () => {
      refetch();
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "ninety-plus-ticket-refresh") {
        refresh();
      }
    };

    window.addEventListener("ninety-plus-ticket-refresh", refresh);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("ninety-plus-ticket-refresh", refresh);
      window.removeEventListener("storage", handleStorage);
    };
  }, [isConnected, refetch]);

  const tickets = useMemo<TicketRecord[]>(() => {
    if (!data) {
      return [];
    }

    return matchIds
      .map((matchId, index) => {
        const predictionResult = data[index * 2];
        const matchResult = data[index * 2 + 1];

        if (predictionResult?.status !== "success") return null;
        const prediction = predictionResult.result as unknown as ContractPrediction;

        if (!prediction[0]) {
          return null;
        }

        const onchainMatch =
          matchResult?.status === "success"
            ? (matchResult.result as unknown as ContractMatch)
            : undefined;

        return {
          match: buildTicketMatch(Number(matchId), onchainMatch),
          prediction,
        };
      })
      .filter((ticket): ticket is TicketRecord => Boolean(ticket))
      .sort((a, b) => Number(b.prediction[4] - a.prediction[4]));
  }, [data, matchIds]);

  const partialReadFailure = data?.some((result) => result.status === "failure") ?? false;
  const readError = error ?? nextMatchIdError;
  const isReadingTickets = isLoadingNextMatchId || isLoading;

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 pb-24 text-[#f5f5f5] sm:px-6">
      <section className="mx-auto w-full max-w-6xl pt-8 md:pt-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00FF85]">
              Prediction Vault
            </span>
            <h1 className="mt-3 font-heading text-4xl uppercase leading-none md:text-6xl">
              My Tickets
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
              Fresh on-chain reads from the deployed 90+ contract. Newly confirmed mints are refetched
              immediately and continue polling while this page is open.
            </p>
          </div>

          <button
            type="button"
            disabled={!isConnected || isFetching}
            onClick={refetch}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#00FF85]/40 bg-[#00FF85]/10 px-4 text-sm font-black text-[#00FF85] transition hover:bg-[#00FF85] hover:text-[#04100B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCcw className={isFetching ? "animate-spin" : ""} size={16} />
            {isFetching ? "Refreshing" : "Refresh"}
          </button>
        </div>
      </section>

      <section className="mx-auto mt-7 w-full max-w-6xl">
        {!isConnected ? <ConnectState /> : null}

        {isConnected && isReadingTickets ? (
          <div className="rounded-lg border border-white/10 bg-[#0c1210]/90 p-5 text-sm text-white/70">
            Scanning X Layer tickets...
          </div>
        ) : null}

        {isConnected && readError ? (
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
            Unable to read tickets from the contract right now. Try the refresh button after the RPC
            responds.
          </div>
        ) : null}

        {isConnected && !isReadingTickets && !readError && partialReadFailure ? (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-[#FFD700]/25 bg-[#FFD700]/10 p-3 text-sm leading-6 text-white/70">
            <ShieldCheck className="mt-0.5 shrink-0 text-[#FFD700]" size={17} />
            Some match reads failed, but any successfully loaded tickets are shown below.
          </div>
        ) : null}

        {isConnected && !isReadingTickets && !readError && tickets.length === 0 ? <EmptyState /> : null}

        {isConnected && tickets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tickets.map((ticket) => (
              <TicketCard key={`${ticket.match.id}-${ticket.prediction[4].toString()}`} ticket={ticket} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
