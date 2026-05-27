import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MatchCard } from "@/components/MatchCard";
import { WalletButton } from "@/components/WalletButton";
import { fixtures } from "@/lib/contract";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-32">
        <div className="max-w-3xl">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#888]">
            World Cup 2026
          </span>
          <h1 className="mt-4 font-heading text-[100px] leading-[0.8] tracking-tighter text-[#f5f5f5] md:text-[140px]">
            90+
          </h1>
          <h2 className="mt-6 font-heading text-4xl uppercase leading-none text-[#f5f5f5] md:text-6xl">
            Predict. Mint. <span className="text-[#00FF85]">Prove it.</span>
          </h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-white/55 md:text-lg">
            On-chain prediction tickets for the world&apos;s greatest stage. 
            Mint your calls as ERC721 receipts and secure your legacy on X Layer.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link 
              href="/matches" 
              className="inline-flex h-12 items-center justify-center rounded-sm bg-[#f5f5f5] px-8 text-xs font-black uppercase tracking-widest text-black transition-transform active:scale-95"
            >
              Browse Matches
            </Link>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#444]">
              Built on X Layer Testnet • Chain 1952
            </p>
          </div>
        </div>
      </section>

      {/* Featured Fixtures */}
      <section className="mx-auto max-w-6xl px-4 pb-32 md:px-6">
        <div className="mb-12 flex items-end justify-between border-b border-white/5 pb-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00FF85]">
              Live Board
            </span>
            <h2 className="mt-2 font-heading text-4xl uppercase text-[#f5f5f5]">
              Featured Fixtures
            </h2>
          </div>
          <Link 
            href="/matches" 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#888] transition-colors hover:text-[#f5f5f5]"
          >
            Full Board
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fixtures.slice(0, 4).map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>
    </main>
  );
}
