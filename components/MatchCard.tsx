import { CalendarClock, MapPin, Shield } from "lucide-react";
import Link from "next/link";
import type { Fixture } from "@/lib/contract";

const formatKickoff = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));

export function MatchCard({ match }: { match: Fixture }) {
  return (
    <Link className="match-card group" href={`/match/${match.id}`}>
      <div className="relative z-10 flex items-center justify-between gap-3">
        <span className="eyebrow">{match.group}</span>
        <Shield size={18} color="#00FF85" />
      </div>

      <div className="relative z-10 mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img className="country-flag" src={`https://flagcdn.com/w40/${match.homeFlag}.png`} alt={match.home} />
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Home</p>
            <h2 className="match-team-inline">{match.home}</h2>
          </div>
        </div>
        <span className="match-vs-pill">VS</span>
        <div className="flex items-center gap-3 justify-end text-right">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Away</p>
            <h2 className="match-team-inline">{match.away}</h2>
          </div>
          <img className="country-flag" src={`https://flagcdn.com/w40/${match.awayFlag}.png`} alt={match.away} />
        </div>
      </div>

      <div className="relative z-10 mt-6 space-y-3 text-sm muted">
        <p className="flex items-center gap-2">
          <CalendarClock size={16} color="#FFD700" />
          {formatKickoff(match.kickoff)}
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={16} color="#00FF85" />
          {match.city}
        </p>
      </div>

      <div className="relative z-10 mt-8 grid grid-cols-3 gap-2 font-score text-xs">
        <span className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">{match.odds.home}%</span>
        <span className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">{match.odds.draw}%</span>
        <span className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">{match.odds.away}%</span>
      </div>
    </Link>
  );
}
