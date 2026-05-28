"use client";

import { Fuel, Shield, Ticket, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { WalletButton } from "./WalletButton";

const ADMIN_OWNER = "0x23E258ce31e96cf32249cD75B2127677ac23c47D";

const publicNav = [
  { href: "/matches",     label: "Matches",     icon: Shield },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/my-tickets",  label: "Tickets",     icon: Ticket },
];

const faucetUrl = "https://web3.okx.com/xlayer/faucet";

export function TopNav() {
  const pathname = usePathname();
  const { address } = useAccount();
  const isOwner = address?.toLowerCase() === ADMIN_OWNER.toLowerCase();

  return (
    <header className="sticky top-0 z-[100] border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-heading text-3xl tracking-tighter text-[#f5f5f5]">
          90+
        </Link>

        <nav className="hidden items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-[#888] md:flex">
          {publicNav.map(({ href, label }) => (
            <Link
              key={href}
              className={`transition-colors hover:text-[#f5f5f5] ${pathname === href ? "text-[#00FF85]" : ""}`}
              href={href}
            >
              {label}
            </Link>
          ))}
          {isOwner && (
            <Link
              className={`transition-colors hover:text-[#f5f5f5] ${pathname === "/admin" ? "text-[#00FF85]" : ""}`}
              href="/admin"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Link className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#555] transition-colors hover:text-[#888] lg:flex" href={faucetUrl} target="_blank" rel="noreferrer">
            <Fuel size={16} />
            Faucet
          </Link>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
