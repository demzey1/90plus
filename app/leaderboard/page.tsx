import { Trophy } from "lucide-react";
import { LeaderboardBoard } from "@/components/LeaderboardBoard";

export default function LeaderboardPage() {
  return (
    <main className="page-wrap pb-20">
      <section className="section-head">
        <div>
          <span className="eyebrow">Golden Table</span>
          <h1 className="section-title">Leaderboard</h1>
        </div>
        <p className="section-copy">
          Ranked by prediction points. Exact scores hit hardest, correct outcomes keep you alive.
        </p>
      </section>

      <LeaderboardBoard />

      <section className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="stat-tile">
          <Trophy color="#FFD700" />
          <span className="stat-number">10</span>
          <p className="muted">Correct outcome points</p>
        </div>
        <div className="stat-tile">
          <Trophy color="#FFD700" />
          <span className="stat-number">20</span>
          <p className="muted">Exact score points</p>
        </div>
        <div className="stat-tile">
          <Trophy color="#FFD700" />
          <span className="stat-number">30</span>
          <p className="muted">Perfect match total</p>
        </div>
      </section>
    </main>
  );
}
