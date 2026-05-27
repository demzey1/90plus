"use client";

import { ArrowUpRight, Fuel, Lock, Shield, Ticket, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "./WalletButton";

const nav = [
  { href: "/matches", label: "Matches", icon: Shield },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/my-tickets", label: "Tickets", icon: Ticket },
  { href: "/admin", label: "Admin", icon: Lock },
];

const faucetUrl = "https://web3.okx.com/xlayer/faucet";

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-[100] border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-heading text-3xl tracking-tighter text-[#f5f5f5]">
          90+
        </Link>

        <nav className="hidden items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-[#888] md:flex">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              className={`transition-colors hover:text-[#f5f5f5] ${pathname === href ? "text-[#00FF85]" : ""}`}
              href={href}
            >
              {label}
            </Link>
          ))}
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
