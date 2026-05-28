import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-32 md:px-6 md:pt-36">
        <div className="max-w-3xl">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#888]">
            World Cup 2026
          </span>
          <h1 className="mt-4 font-heading text-[clamp(6rem,20vw,14rem)] leading-[0.8] tracking-tighter text-[#f5f5f5]">
            90+
          </h1>
          <h2 className="mt-6 font-heading text-3xl uppercase leading-tight text-[#f5f5f5] md:text-5xl">
            Predict. Mint.{" "}
            <span className="text-[#00ff85]">Prove it.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/45 md:text-base">
            Lock your World Cup calls as ERC-721 NFT tickets on X Layer.
            Your predictions live on-chain — permanent, verifiable, yours.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/matches"
              className="inline-flex h-11 items-center justify-center rounded-sm bg-[#f5f5f5] px-8 text-xs font-black uppercase tracking-widest text-black transition-opacity hover:opacity-80 active:scale-95"
            >
              Browse Matches
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#333]">
              X Layer Testnet · Chain 1952
            </span>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 border-t border-white/5 pt-16 sm:grid-cols-3">
          {[
            { label: "Standard", value: "ERC-721", sub: "Prediction ticket NFTs" },
            { label: "Network",  value: "1952",    sub: "X Layer testnet chain ID" },
            { label: "Points",   value: "10",      sub: "Awarded per correct call" },
          ].map(({ label, value, sub }) => (
            <div key={label}>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#444]">{label}</p>
              <p className="mt-2 font-heading text-4xl text-[#f5f5f5]">{value}</p>
              <p className="mt-1 text-xs text-[#555]">{sub}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
