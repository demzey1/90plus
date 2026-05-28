"use client";

import { CalendarClock, MapPin, Ticket, Trophy, Wallet } from "lucide-react";
import { zeroAddress } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import {
  type ContractPrediction,
  fixtures,
  NINETY_PLUS_ADDRESS,
  ninetyPlusAbi,
  pickLabels,
} from "@/lib/contract";
import { xLayerTestnet } from "@/lib/wagmi";
import { WalletButton } from "./WalletButton";

const formatKickoff = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));

export function TicketGallery() {
  const { address, isConnected } = useAccount();

  const { data, isLoading, error } = useReadContracts({
    contracts: fixtures.map((match) => ({
      address: NINETY_PLUS_ADDRESS,
      abi: ninetyPlusAbi,
      functionName: "predictions",
      args: [BigInt(match.id), address ?? zeroAddress],
      chainId: xLayerTestnet.id,
    })),
    query: {
      enabled: Boolean(address),
    },
  });

  if (!isConnected) {
    return (
      <section className="panel p-8 text-center">
        <Wallet className="mx-auto mb-4" color="#00FF85" size={42} />
        <h2 className="font-heading text-5xl uppercase">Connect Wallet</h2>
        <p className="mx-auto mt-3 max-w-xl muted">
          Your minted prediction tickets appear here once your wallet is connected on X Layer.
        </p>
        <div className="mt-6 flex justify-center">
          <WalletButton />
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <div className="panel p-8">
        <p className="font-score text-pitch">Scanning X Layer tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel p-8">
        <p className="font-score text-red-200">Unable to read tickets from the contract right now.</p>
      </div>
    );
  }

  const tickets =
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
      .filter(Boolean) ?? [];

  if (tickets.length === 0) {
    return (
      <section className="panel p-8 text-center">
        <Ticket className="mx-auto mb-4" color="#FFD700" size={42} />
        <h2 className="font-heading text-5xl uppercase">No Tickets Yet</h2>
        <p className="mx-auto mt-3 max-w-xl muted">
          Mint a match prediction ticket and it will land in this gallery.
        </p>
      </section>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tickets.map((ticket) => {
        if (!ticket) {
          return null;
        }

        const { match, prediction } = ticket;
        const pick = pickLabels[prediction[1] as 0 | 1 | 2];

        return (
          <article key={match.id} className={`ticket-card relative overflow-hidden p-5 ticket-pick-${pick.toLowerCase()}`}>
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Ticket #{prediction[4].toString()}</p>
                <div className="mt-4 flex items-center gap-4">
                  <img className="country-flag country-flag-large" src={`https://flagcdn.com/w80/${match.homeFlag}.png`} alt={match.home} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">Home</p>
                    <h2 className="font-heading text-4xl uppercase leading-none">{match.home}</h2>
                  </div>
                  <span className="match-vs-pill">VS</span>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">Away</p>
                    <h2 className="font-heading text-4xl uppercase leading-none">{match.away}</h2>
                  </div>
                  <img className="country-flag country-flag-large" src={`https://flagcdn.com/w80/${match.awayFlag}.png`} alt={match.away} />
                </div>
                <div className="mt-4 space-y-2 text-sm text-white/64">
                  <p className="flex items-center gap-2">
                    <CalendarClock size={14} color="#FFD700" />
                    {formatKickoff(match.kickoff)}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} color="#00FF85" />
                    {match.stadium} · {match.city}
                  </p>
                </div>
              </div>
              <Trophy color="#FFD700" />
            </div>

            <div className="relative z-10 mt-8 grid grid-cols-3 gap-2 text-center font-score">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-white/45">PICK</p>
                <p className="text-pitch">{pick}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-white/45">PTS</p>
                <p>{prediction[3].toString()}</p>
              </div>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.22em] text-white/45">
              <span>Token #{prediction[4].toString()}</span>
              <span>{match.group}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
