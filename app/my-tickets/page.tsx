import { TicketGallery } from "@/components/TicketGallery";

export default function MyTicketsPage() {
  return (
    <main className="page-wrap pb-20">
      <section className="section-head">
        <div>
          <span className="eyebrow">NFT Ticket Vault</span>
          <h1 className="section-title">My Tickets</h1>
        </div>
        <p className="section-copy">
          Your minted prediction receipts, pulled from the deployed 90+ contract on X Layer testnet.
        </p>
      </section>

      <TicketGallery />
    </main>
  );
}
