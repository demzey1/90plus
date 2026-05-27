import "@rainbow-me/rainbowkit/styles.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Providers } from "./providers";
import { TopNav } from "@/components/TopNav";

export const metadata: Metadata = {
  title: "90+ | World Cup Prediction Vault",
  description: "Secure your World Cup predictions on-chain. Mint NFT tickets and prove your expertise on X Layer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <TopNav />
          <div className="site-shell">{children}</div>
          <Analytics />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
