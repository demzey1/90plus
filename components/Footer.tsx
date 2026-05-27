import { ArrowUpRight, ExternalLink, Fuel } from "lucide-react";
import Link from "next/link";
import { NINETY_PLUS_ADDRESS } from "@/lib/contract";

const faucetUrl = "https://web3.okx.com/xlayer/faucet";
const contractUrl = `https://www.oklink.com/xlayer-test/address/${NINETY_PLUS_ADDRESS}`;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-wrap footer-inner">
        <div>
          <p className="footer-brand">90+</p>
          <p className="footer-copy">
            Built on X Layer
          </p>
        </div>

        <div className="footer-actions">
          <Link className="secondary-action footer-link" href={contractUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={18} />
            Contract
          </Link>
          <Link className="secondary-action footer-link" href={faucetUrl} target="_blank" rel="noreferrer">
            <Fuel size={18} />
            Get Free Test OKB
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
