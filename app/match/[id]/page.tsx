import { CalendarClock, MapPin, Trophy } from "lucide-react";
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
      <section className="panel panel-glow relative mb-5 overflow-hidden p-4 md:p-8">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="eyebrow text-sm text-white/70">{match.group}</span>
            <div className="text-sm text-white/75 mt-2 sm:mt-0">
              <span className="flex items-center gap-2">
                <CalendarClock size={16} color="#FFD700" />
                <span className="text-sm">{formatKickoff(match.kickoff)}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm muted">
            <span className="flex items-center gap-2">
              <MapPin size={16} color="#00b36b" />
              <span className="text-sm">{match.city}</span>
            </span>
          </div>
        </div>

        <div className="scoreboard relative z-10 mt-6 flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-4">
          <div className="team-stack flex-1 flex items-center gap-3">
            <img className="country-flag w-12 h-12 sm:w-20 sm:h-20 object-cover rounded" src={`https://flagcdn.com/w80/${match.homeFlag}.png`} alt={match.home} />
            <h1 className="team-name text-lg sm:text-2xl font-semibold truncate">{match.home}</h1>
          </div>

          <div className="score-box text-lg sm:text-2xl font-extrabold px-4 py-2 bg-white/5 rounded">VS</div>

          <div className="team-stack team-stack-right flex-1 flex items-center justify-end gap-3">
            <h2 className="team-name text-lg sm:text-2xl font-semibold text-right truncate">{match.away}</h2>
            <img className="country-flag w-12 h-12 sm:w-20 sm:h-20 object-cover rounded" src={`https://flagcdn.com/w80/${match.awayFlag}.png`} alt={match.away} />
          </div>
        </div>

        <div className="relative z-10 mt-6">
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <Trophy className="mb-2" color="#FFD700" />
            <p className="text-xs font-black uppercase text-white/45">Stadium</p>
            <p className="font-score text-sm mt-1 truncate">{match.stadium}</p>
          </div>
        </div>
      </section>

      <MatchMintPanel match={match} />
    </main>
  );
}
