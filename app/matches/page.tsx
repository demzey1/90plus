import { MatchCard } from "@/components/MatchCard";
import { fixtures } from "@/lib/contract";

export default function MatchesPage() {
  return (
    <main className="page-wrap pb-20">
      <section className="section-head">
        <div>
          <span className="eyebrow">2026 World Cup Board</span>
          <h1 className="section-title">Pick Your Match</h1>
        </div>
        <p className="section-copy">
          Eight high-voltage fixtures, one on-chain ticket per prediction. Every card maps to the
          matching contract match ID.
        </p>
      </section>

      <section className="matches-grid">
        {fixtures.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </section>
    </main>
  );
}
