"use client";

import { MatchCard } from "@/components/MatchCard";
import { fixtures } from "@/lib/contract";

export default function MatchesPage() {
  return (
    <main className="page-wrap pb-20">
      <section className="section-head flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <span className="eyebrow text-sm tracking-wider text-white/70">2026 World Cup Board</span>
          <h1 className="section-title text-2xl md:text-3xl">Pick Your Match</h1>
        </div>
        <p className="section-copy max-w-xl text-sm text-white/75">
          Eight high-voltage fixtures, one on-chain ticket per prediction. Every card maps to the matching contract match ID.
        </p>
      </section>

      <section className="matches-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {fixtures.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </section>
    </main>
  );
}
