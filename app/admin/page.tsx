"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminPanel } from "@/components/AdminPanel";

const ADMIN_OWNER = "0x23E258ce31e96cf32249cD75B2127677ac23c47D";

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const isOwner = address?.toLowerCase() === ADMIN_OWNER.toLowerCase();

  useEffect(() => {
    if (isConnected && !isOwner) {
      router.replace("/");
    }
  }, [isConnected, isOwner, router]);

  if (!isConnected || !isOwner) return null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 pb-24 text-[#f5f5f5] sm:px-6">
      <section className="mx-auto max-w-4xl pt-12">
        <div className="mb-8">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00ff85]">
            Control Room
          </span>
          <h1 className="mt-2 font-heading text-4xl uppercase text-[#f5f5f5] md:text-6xl">
            Admin
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/45">
            Create fixtures and declare final scores. The contract enforces owner-only writes on-chain regardless of this UI.
          </p>
        </div>

        <div className="mb-6 rounded-sm border border-[#FFD700]/20 bg-[#FFD700]/5 p-4 text-sm leading-6 text-white/70">
          <strong className="font-black text-[#FFD700]">Current board:</strong> The public fixtures are mapped
          to the deployed contract match IDs in the frontend. Use the controls below only for future fixtures
          or final score updates.
        </div>

        <AdminPanel />
      </section>
    </main>
  );
}
