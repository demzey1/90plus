'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  useAccount,
  useChainId,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from "wagmi";

import { zeroAddress } from "viem";

import {
  ArrowLeft,
  CalendarClock,
  MapPin,
} from "lucide-react";

import { MatchMintPanel } from "@/components/MatchMintPanel";

import {
  type ContractPrediction,
  type PickChoice,
  fixtures,
  NINETY_PLUS_ADDRESS,
  ninetyPlusAbi,
  pickLabels,
} from "@/lib/contract";
import { xLayerTestnet } from "@/lib/wagmi";

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

        <MatchMintPanel match={match} />
      </section>
    </main>
  );
}