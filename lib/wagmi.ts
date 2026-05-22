import { createConfig, http, injected } from "wagmi";
import { defineChain } from "viem";

export const xLayerTestnet = defineChain({
  id: 1952,
  name: "X Layer Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "OKB",
    symbol: "OKB",
  },
  rpcUrls: {
    default: {
      http: ["https://xlayertestrpc.okx.com/terigon"],
    },
    public: {
      http: ["https://xlayertestrpc.okx.com/terigon"],
    },
  },
  blockExplorers: {
    default: {
      name: "OKLink",
      url: "https://www.oklink.com/xlayer-test",
    },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [xLayerTestnet],
  connectors: [injected({ shimDisconnect: true })],
  multiInjectedProviderDiscovery: true,
  ssr: true,
  syncConnectedChain: true,
  transports: {
    [xLayerTestnet.id]: http(xLayerTestnet.rpcUrls.default.http[0]),
  },
});
