"use client";

import { ArrowUpRight, Fuel, Lock, Medal, Shield, Ticket, Trophy } from "lucide-react";
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
    <header className="stadium-nav">
      <div className="nav-inner">
        <Link className="brand-mark" href="/">
          <Medal size={28} />
          90+
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              className={`nav-link ${pathname === href ? "nav-link-active" : ""}`}
              href={href}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link className="faucet-action" href={faucetUrl} target="_blank" rel="noreferrer">
            <Fuel size={16} />
            Get Free Test OKB
            <ArrowUpRight size={15} />
          </Link>
          <WalletButton compact />
        </div>
      </div>
    </header>
  );
}
