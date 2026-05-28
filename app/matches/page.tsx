import { ArrowRight, CalendarClock, MapPin } from "lucide-react";
import Link from "next/link";
import { fixtures, type Fixture } from "@/lib/contract";

const formatKickoff = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));

function TeamRow({
  label,
  name,
  flag,
}: {
  label: string;
  name: string;
  flag: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3">
      <img
        className="h-10 w-10 shrink-0 rounded-full border border-white/20 object-cover"
        src={`https://flagcdn.com/w80/${flag}.png`}
        alt={name}
      />
      <div className="min-w-0">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/50">{label}</p>
        <h2 className="mt-1 break-words font-heading text-2xl uppercase leading-[0.95] text-white md:text-[1.7rem]">
          {name}
        </h2>
      </div>
    </div>
  );
}

function MatchTile({ match }: { match: Fixture }) {
  return (
    <Link
      className="group flex min-h-[360px] flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0c1210]/90 p-4 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-white/20 sm:p-5"
      href={`/match/${match.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full border border-[#00FF85]/25 bg-[#00FF85]/10 px-3 py-1.5 text-[0.7rem] font-black uppercase tracking-[0.18em] text-[#00FF85]">
          {match.group}
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        <TeamRow label="Home" name={match.home} flag={match.homeFlag} />
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-1">
          <span className="h-px bg-white/10" />
          <span className="rounded-full border border-[#00FF85]/25 bg-[#00FF85]/10 px-3 py-1 font-score text-xs font-bold tracking-[0.16em] text-[#00FF85]">
            VS
          </span>
          <span className="h-px bg-white/10" />
        </div>
        <TeamRow label="Away" name={match.away} flag={match.awayFlag} />
      </div>

      <div className="mt-5 grid gap-2 text-sm text-white/70">
        <p className="flex min-w-0 items-center gap-2">
          <CalendarClock className="shrink-0 text-[#FFD700]" size={15} />
          <span className="min-w-0 break-words">{formatKickoff(match.kickoff)}</span>
        </p>
        <p className="flex min-w-0 items-center gap-2">
          <MapPin className="shrink-0 text-[#00FF85]" size={15} />
          <span className="min-w-0 break-words">
            {match.stadium}, {match.city}
          </span>
        </p>
      </div>

      <div className="mt-auto pt-5">

        <div className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#00FF85]/30 bg-[#00FF85]/10 px-4 text-sm font-black text-[#00FF85] transition group-hover:bg-[#00FF85] group-hover:text-[#04100B]">
          Open Match
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}

export default function MatchesPage() {
  return (
    <main className="min-h-screen bg-[#080A0A] px-4 pb-24 sm:px-6">
      <section className="mx-auto w-full max-w-6xl pt-8 md:pt-12">
        <div className="max-w-3xl">
          <span className="text-xs font-black uppercase tracking-[0.24em] text-[#00FF85]">
            2026 World Cup Board
          </span>
          <h1 className="mt-3 font-heading text-4xl uppercase leading-[0.92] text-white md:text-6xl">
            Pick Your Match
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            Clean fixtures, readable odds, and one on-chain NFT ticket per prediction. Choose a match
            to lock your result and score call.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-7 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {fixtures.map((match) => (
          <MatchTile key={match.id} match={match} />
        ))}
      </section>
    </main>
  );
}
