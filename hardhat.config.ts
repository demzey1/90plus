import "dotenv/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import { defineConfig } from "hardhat/config";

const xlayerRpcUrl =
  process.env.XLAYER_RPC_URL ?? "https://xlayertestrpc.okx.com/terigon";
const privateKey = process.env.PRIVATE_KEY;

export default defineConfig({
  plugins: [hardhatEthers],
  solidity: {
    version: "0.8.24",
  },
  networks: {
    xlayerTestnet: {
      type: "http",
      chainType: "generic",
      url: xlayerRpcUrl,
      chainId: 1952,
      accounts: privateKey ? [privateKey] : [],
    },
  },
});
