"use client";

import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WagmiProvider } from "wagmi";
import { NetworkAutoSwitch } from "@/components/NetworkAutoSwitch";
import { wagmiConfig, xLayerTestnet } from "@/lib/wagmi";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={xLayerTestnet}
          theme={darkTheme({
            accentColor: "#00FF85",
            accentColorForeground: "#04100B",
            borderRadius: "small",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          {children}
          <NetworkAutoSwitch />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
