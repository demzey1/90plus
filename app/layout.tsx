import "@rainbow-me/rainbowkit/styles.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Providers } from "./providers";
import { TopNav } from "@/components/TopNav";

export const metadata: Metadata = {
  title: "90+ | X Cup Prediction Tickets",
  description: "Predict World Cup matches, mint NFT tickets, and prove you know ball on X Layer.",
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
