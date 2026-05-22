import { ArrowRight, Flame, Shield, Ticket, Trophy } from "lucide-react";
import Link from "next/link";
import { MatchCard } from "@/components/MatchCard";
import { WalletButton } from "@/components/WalletButton";
import { fixtures } from "@/lib/contract";

export default function Home() {
  return (
    <main>
      <section className="page-wrap hero-section">
        <div>
          <span className="hero-kicker">
            <Flame size={16} />
            X Cup Hackathon on X Layer
          </span>
          <h1 className="hero-90">90+</h1>
          <h2 className="hero-title">Predict. Mint. Prove You Know Ball.</h2>
          <p className="hero-copy">
            World Cup predictions become ERC721 ticket receipts on X Layer testnet. Pick the result,
            lock the score, mint the proof, and climb the table when the whistle hits.
          </p>

          <div className="hero-actions">
            <WalletButton />
            <Link className="secondary-action" href="/matches">
              Browse Matches
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="stat-strip">
            <div className="stat-tile">
              <Ticket color="#00FF85" />
              <span className="stat-number">ERC721</span>
              <p className="muted">Prediction ticket NFTs</p>
            </div>
            <div className="stat-tile">
              <Shield color="#00FF85" />
              <span className="stat-number">1952</span>
              <p className="muted">X Layer testnet chain</p>
            </div>
            <div className="stat-tile">
              <Trophy color="#FFD700" />
              <span className="stat-number">30</span>
              <p className="muted">Max points per match</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-wrap pb-20">
        <div className="section-head">
          <div>
            <span className="eyebrow">Featured Fixtures</span>
            <h2 className="section-title">Next Whistles</h2>
          </div>
          <Link className="secondary-action" href="/matches">
            Full Board
            <ArrowRight size={18} />
          </Link>
        </div>
        <div className="matches-grid">
          {fixtures.slice(0, 4).map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>
    </main>
  );
}
