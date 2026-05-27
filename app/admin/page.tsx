"use client";
import { AdminPanel } from "@/components/AdminPanel";
import { useAccount } from "wagmi";

const ADMIN_OWNER = "0x23E258ce31e96cf32249cD75B2127677ac23c47D";

export default function AdminPage() {
  const { address } = useAccount();
  const isOwner = address?.toLowerCase() === ADMIN_OWNER.toLowerCase();
  if (!isOwner) {
    return (
      <main className="page-wrap pb-20">
        <section className="section-head">
          <div>
            <span className="eyebrow">Access Denied</span>
            <h1 className="section-title">Admin</h1>
          </div>
          <p className="section-copy">You do not have permission to view this page.</p>
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
        <p className="section-copy">
          Create fixtures and finalize scores from the tunnel. The contract still enforces owner-only writes.
        </p>
      </section>
      <AdminPanel />
    </main>
  );
}
