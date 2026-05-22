"use client";

import { useAccount } from "wagmi";
import { WalletButton } from "@/components/WalletButton";
import { AdminPanel } from "@/components/AdminPanel";

const ADMIN_ADDRESS = "0x23E258ce31e96cf32249cD75B2127677ac23c47D".toLowerCase();

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const connected = address?.toLowerCase() ?? null;

  if (!isConnected) {
    return (
      <main className="page-wrap pb-20">
        <section className="panel p-8 text-center">
          <h2 className="font-heading text-2xl">Admin</h2>
          <p className="muted mt-2">Connect the owner wallet to access admin controls.</p>
          <div className="mt-4">
            <WalletButton />
          </div>
        </section>
      </main>
    );
  }

  if (connected !== ADMIN_ADDRESS) {
    return (
      <main className="page-wrap pb-20">
        <section className="panel p-8 text-center">
          <h2 className="font-heading text-2xl">Not Found</h2>
          <p className="muted mt-2">The admin panel is not available for this wallet.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-wrap pb-20">
      <section className="section-head">
        <div>
          <span className="eyebrow">Control Room</span>
          <h1 className="section-title">Admin</h1>
        </div>
        <p className="section-copy">Owner controls for fixtures and finalizing outcomes.</p>
      </section>

      <AdminPanel />
    </main>
  );
}
