import "dotenv/config";
import { ethers } from "ethers";
import artifact from "../artifacts/contracts/NinetyPlus.sol/NinetyPlus.json" with { type: "json" };

const rpcUrl = process.env.XLAYER_RPC_URL ?? "https://testrpc.xlayer.tech/terigon";

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is not set.");
}

const provider = new ethers.JsonRpcProvider(rpcUrl, {
  name: "xlayer-testnet",
  chainId: 1952,
});
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

console.log(`Deploying NinetyPlus from ${wallet.address}...`);
const contract = await factory.deploy();
console.log(`Deployment tx: ${contract.deploymentTransaction().hash}`);

await contract.waitForDeployment();
console.log(`NinetyPlus deployed to: ${await contract.getAddress()}`);
