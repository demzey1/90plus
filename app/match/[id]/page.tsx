import { CalendarClock, MapPin, Radar, Trophy } from "lucide-react";
import { notFound } from "next/navigation";
import { MatchMintPanel } from "@/components/MatchMintPanel";
import { fixtures } from "@/lib/contract";

type MatchPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return fixtures.map((match) => ({ id: String(match.id) }));
}

const formatKickoff = (value: string) =>
  new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  const match = fixtures.find((fixture) => fixture.id === Number(id));

  if (!match) {
    notFound();
  }

  return (
    <main className="page-wrap pb-20">
      <section className="panel panel-glow relative mb-5 overflow-hidden p-5 md:p-8">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <span className="eyebrow">{match.group}</span>
          <div className="flex flex-wrap gap-3 text-sm muted">
            <span className="flex items-center gap-2">
              <CalendarClock size={16} color="#FFD700" />
              {formatKickoff(match.kickoff)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} color="#00FF85" />
              {match.city}
            </span>
          </div>
        </div>

        <div className="scoreboard relative z-10 mt-10">
          <div className="team-stack">
            <img className="country-flag country-flag-large" src={`https://flagcdn.com/w80/${match.homeFlag}.png`} alt={match.home} />
            <h1 className="team-name">{match.home}</h1>
          </div>
          <div className="score-box">0-0</div>
          <div className="team-stack team-stack-right">
            <img className="country-flag country-flag-large" src={`https://flagcdn.com/w80/${match.awayFlag}.png`} alt={match.away} />
            <h2 className="team-name text-right">{match.away}</h2>
          </div>
        </div>

        <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <Trophy className="mb-3" color="#FFD700" />
            <p className="text-sm font-black uppercase text-white/45">Stadium</p>
            <p className="font-score text-lg">{match.stadium}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <Radar className="mb-3" color="#00FF85" />
            <p className="text-sm font-black uppercase text-white/45">Pulse</p>
            <p className="font-score text-lg">{match.pulse}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <Radar className="mb-3" color="#FFD700" />
            <p className="text-sm font-black uppercase text-white/45">AI Lean</p>
            <p className="font-score text-lg">{match.aiLean}</p>
          </div>
        </div>
      </section>

      <MatchMintPanel match={match} />
    </main>
  );
}
