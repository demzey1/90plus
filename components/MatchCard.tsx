"use client";

import { CalendarClock, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Fixture } from "@/lib/contract";

const formatKickoff = (value: string) => {
  try {
    return new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) { return value; }
};

export function MatchCard({ match }: { match: Fixture }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Link className="group block rounded-sm border border-white/10 bg-[#0d0d0d] p-5 transition-colors hover:border-[#00FF85]/30" href={`/match/${match.id}`}>
      <div className="relative z-10 flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#555]">{match.group}</span>
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

      <div className="relative z-10 mt-6 space-y-2 text-[11px] font-bold uppercase tracking-wider text-[#666]">
        <p className="flex items-center gap-2 group-hover:text-[#888]">
          <CalendarClock size={14} />
          {mounted ? formatKickoff(match.kickoff) : "Loading..."}
        </p>
        <p className="flex items-center gap-2 group-hover:text-[#888]">
          <MapPin size={14} />
          {match.city}
        </p>
      </div>
    </Link>
  );
}
