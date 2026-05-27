"use client";

import { CalendarClock, MapPin, RefreshCcw, ShieldCheck, Ticket, Trophy, Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { zeroAddress } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import {
  type ContractPrediction,
  type Fixture,
  type PickChoice,
  fixtures,
  NINETY_PLUS_ADDRESS,
  ninetyPlusAbi,
  pickLabels,
} from "@/lib/contract";
import { xLayerTestnet } from "@/lib/wagmi";
import { WalletButton } from "@/components/WalletButton";

const TICKET_REFRESH_KEY = "ninety-plus-ticket-refresh";
const TICKET_REFRESH_EVENT = "ninety-plus-ticket-refresh";

type TicketRecord = {
  match: Fixture;
  prediction: ContractPrediction;
};

const formatKickoff = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));

function TeamLine({
  label,
  name,
  flag,
}: {
  label: string;
  name: string;
  flag: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
      <img
        className="h-11 w-11 shrink-0 rounded-full border border-white/20 object-cover shadow-[0_0_18px_rgba(0,255,133,0.14)]"
        src={`https://flagcdn.com/w80/${flag}.png`}
        alt={name}
      />
      <div className="min-w-0">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-white/40">{label}</p>
        <h2 className="mt-1 break-words font-heading text-2xl uppercase leading-[0.95] text-white">
          {name}
        </h2>
      </div>
    </div>
  );
}

function Metric({ label, value, accent = "white" }: { label: string; value: string; accent?: "white" | "green" | "gold" }) {
  const valueClass =
    accent === "green" ? "text-[#00FF85]" : accent === "gold" ? "text-[#FFD700]" : "text-white";

  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-center">
      <p className="text-[0.66rem] font-black uppercase tracking-[0.16em] text-white/40">{label}</p>
      <p className={`mt-1 break-words font-score text-base ${valueClass}`}>{value}</p>
    </div>
  );
}

function TicketCard({ ticket }: { ticket: TicketRecord }) {
  const { match, prediction } = ticket;
  const pick = pickLabels[prediction[1] as PickChoice];
  let pickClass = "ticket-pick-home";
  if (pick === "DRAW") pickClass = "ticket-pick-draw";
  if (pick === "AWAY") pickClass = "ticket-pick-away";
  return (
    <article className={`overflow-hidden rounded-lg border bg-[#0c1210]/90 p-4 ${pickClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-[#00FF85]">
            Ticket #{prediction[6].toString()}
          </p>
          <h2 className="mt-2 break-words font-heading text-3xl uppercase leading-none text-white">
            {match.home} vs {match.away}
          </h2>
        </div>
        <Trophy className="shrink-0 text-[#FFD700]" size={24} />
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className={`flex flex-col items-center ${pick === "HOME" ? "font-black text-[#00FF85] scale-110" : "opacity-60"}`}>
          <img className="country-flag-large" src={`https://flagcdn.com/w80/${match.homeFlag}.png`} alt={match.home} />
          <span className="mt-2 text-lg uppercase">Home</span>
        </div>
        <div className={`flex flex-col items-center ${pick === "DRAW" ? "font-black text-[#FFD700] scale-110" : "opacity-60"}`}>
          <span className="country-flag-large" style={{ fontSize: 48 }}>⚪</span>
          <span className="mt-2 text-lg uppercase">Draw</span>
        </div>
        <div className={`flex flex-col items-center ${pick === "AWAY" ? "font-black text-[#FF3B5C] scale-110" : "opacity-60"}`}>
          <img className="country-flag-large" src={`https://flagcdn.com/w80/${match.awayFlag}.png`} alt={match.away} />
          <span className="mt-2 text-lg uppercase">Away</span>
        </div>
      </div>
      <div className="mt-4 grid gap-2 text-sm leading-6 text-white/60">
        <p className="flex min-w-0 items-center gap-2">
          <CalendarClock className="shrink-0 text-[#FFD700]" size={15} />
          <span className="min-w-0 break-words">{formatKickoff(match.kickoff)}</span>
        </p>
        <p className="flex min-w-0 items-center gap-2">
          <MapPin className="shrink-0 text-[#00FF85]" size={15} />
          <span className="min-w-0 break-words">{match.stadium}, {match.city}</span>
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-white/40">Group</p>
          <p className="mt-1 text-sm text-white/70">{match.group}</p>
        </div>
        <Link className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#00FF85]/40 bg-[#00FF85]/10 px-4 text-sm font-black text-[#00FF85] transition hover:bg-[#00FF85] hover:text-[#04100B]" href={`/match/${match.id}`}>View Match</Link>
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
  const predictionContracts = useMemo(
    () =>
      fixtures.map(
        (match) =>
          ({
            address: NINETY_PLUS_ADDRESS,
            abi: ninetyPlusAbi,
            functionName: "predictions",
            args: [BigInt(match.id), address ?? zeroAddress] as const,
            chainId: xLayerTestnet.id,
          }) as const,
      ),
    [address],
  );

  const { data, isLoading, isFetching, error, refetch } = useReadContracts({
    contracts: predictionContracts,
    query: {
      enabled: Boolean(address),
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      refetchInterval: isConnected ? 4000 : false,
    },
  });

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    void refetch();
  }, [isConnected, address, refetch]);

  useEffect(() => {
    if (!isConnected) {
      return undefined;
    }

    const refresh = () => {
      void refetch();
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === TICKET_REFRESH_KEY) {
        refresh();
      }
    };

    window.addEventListener(TICKET_REFRESH_EVENT, refresh);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(TICKET_REFRESH_EVENT, refresh);
      window.removeEventListener("storage", handleStorage);
    };
  }, [isConnected, refetch]);

  const tickets = useMemo<TicketRecord[]>(() => {
    return (
      data
        ?.map((result, index) => {
          const prediction =
            result.status === "success" ? (result.result as unknown as ContractPrediction) : undefined;

          if (!prediction?.[0]) {
            return null;
          }

          return {
            match: fixtures[index],
            prediction,
          };
        })
        .filter((ticket): ticket is TicketRecord => Boolean(ticket)) ?? []
    );
  }, [data]);

  const partialReadFailure = data?.some((result) => result.status === "failure") ?? false;

  return (
    <main className="min-h-screen bg-[#080A0A] px-4 pb-24 sm:px-6">
      <section className="mx-auto w-full max-w-6xl pt-8 md:pt-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-[#00FF85]">
              NFT Ticket Vault
            </span>
            <h1 className="mt-3 font-heading text-4xl uppercase leading-[0.92] text-white drop-shadow-[0_0_16px_rgba(0,255,133,0.36)] md:text-6xl">
              My Tickets
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
              Fresh on-chain reads from the deployed 90+ contract. Newly confirmed mints are refetched
              immediately and continue polling while this page is open.
            </p>
          </div>

          <button
            type="button"
            disabled={!isConnected || isFetching}
            onClick={() => void refetch()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#00FF85]/40 bg-[#00FF85]/10 px-4 text-sm font-black text-[#00FF85] transition hover:bg-[#00FF85] hover:text-[#04100B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCcw className={isFetching ? "animate-spin" : ""} size={16} />
            {isFetching ? "Refreshing" : "Refresh"}
          </button>
        </div>
      </section>

      <section className="mx-auto mt-7 w-full max-w-6xl">
        {!isConnected ? <ConnectState /> : null}

        {isConnected && isLoading ? (
          <div className="rounded-lg border border-white/10 bg-[#0c1210]/90 p-5 text-sm text-white/70">
            Scanning X Layer tickets...
          </div>
        ) : null}

        {isConnected && error ? (
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
            Unable to read tickets from the contract right now. Try the refresh button after the RPC
            responds.
          </div>
        ) : null}

        {isConnected && !isLoading && !error && partialReadFailure ? (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-[#FFD700]/25 bg-[#FFD700]/10 p-3 text-sm leading-6 text-white/70">
            <ShieldCheck className="mt-0.5 shrink-0 text-[#FFD700]" size={17} />
            Some match reads failed, but any successfully loaded tickets are shown below.
          </div>
        ) : null}

        {isConnected && !isLoading && !error && tickets.length === 0 ? <EmptyState /> : null}

        {isConnected && tickets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tickets.map((ticket) => (
              <TicketCard key={`${ticket.match.id}-${ticket.prediction[6].toString()}`} ticket={ticket} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
