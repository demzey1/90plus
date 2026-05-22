import { AdminPanel } from "@/components/AdminPanel";

export default function AdminPage() {
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
