"use client"

import { useEffect, useState } from "react";
import { TicketGallery } from "@/components/TicketGallery";

export default function MyTicketsPage() {
  const [refreshKey, setRefreshKey] = useState<number>(() => Date.now());

  // Listen for other tabs or pages signalling a mint (components can set localStorage 'ticketMinted')
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ticketMinted") {
        setRefreshKey(Date.now());
      }
    };
    window.addEventListener("storage", onStorage);

    // also listen for custom in-tab events
    const onMint = () => setRefreshKey(Date.now());
    window.addEventListener("ticket:minted", onMint as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("ticket:minted", onMint as EventListener);
    };
  }, []);

  // short polling to capture mints that might have completed while on the match page
  useEffect(() => {
    let count = 0;
    const id = setInterval(() => {
      setRefreshKey(Date.now());
      count += 1;
      if (count > 6) clearInterval(id); // poll for ~30s then stop
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="page-wrap pb-20">
      <section className="section-head flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <span className="eyebrow text-sm text-white/70">NFT Ticket Vault</span>
          <h1 className="section-title text-2xl md:text-3xl">My Tickets</h1>
        </div>
        <p className="section-copy max-w-xl text-sm text-white/75">
          Your minted prediction receipts, pulled from the deployed 90+ contract on X Layer testnet.
        </p>
      </section>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="text-sm text-white/70">Showing latest on-chain tickets</div>
        <div>
          <button
            onClick={() => setRefreshKey(Date.now())}
            className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gradient-to-r from-[#00FF85] to-[#00E676] text-black text-sm font-semibold"
            aria-label="Refresh tickets"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-4">
        {/* key forces remount so TicketGallery refetches */}
        <TicketGallery key={String(refreshKey)} />
      </div>
    </main>
  );
}
