import "dotenv/config";
import { ethers } from "ethers";

const contractAddress = process.env.NINETY_PLUS_ADDRESS ?? "0x7cB475c494a44913dB55319a0BbB0C3583c8DBAd";
const rpcUrl = process.env.XLAYER_RPC_URL ?? "https://testrpc.xlayer.tech/terigon";

const fixtures = [
  ["Mexico", "South Africa", "2026-06-11T19:00:00Z", "Mexico looking strong"],
  ["USA", "Paraguay", "2026-06-13T01:00:00Z", "USA home energy"],
  ["Brazil", "Morocco", "2026-06-13T22:00:00Z", "Brazil flair against Morocco pressure"],
  ["Germany", "Curaçao", "2026-06-14T17:00:00Z", "Germany control"],
  ["Netherlands", "Japan", "2026-06-14T20:00:00Z", "Japan tempo, Netherlands structure"],
  ["France", "Senegal", "2026-06-16T19:00:00Z", "France edge a physical test"],
  ["Argentina", "Algeria", "2026-06-17T01:00:00Z", "Argentina experience"],
  ["England", "Croatia", "2026-06-17T20:00:00Z", "England versus Croatia midfield battle"],
];

const seedStartMatchId = Number(process.env.SEED_START_MATCH_ID ?? "1");

const abi = [
  "function owner() view returns (address)",
  "function nextMatchId() view returns (uint256)",
  "function createMatch(string homeTeam,string awayTeam,uint256 kickoffTime,string aiPrediction) returns (uint256)",
  "function matches(uint256) view returns (string homeTeam,string awayTeam,uint256 kickoffTime,bool exists,bool finalized,uint8 homeScore,uint8 awayScore,string aiPrediction,bool isHidden)",
];

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is not set.");
}

const provider = new ethers.JsonRpcProvider(rpcUrl, {
  name: "xlayer-testnet",
  chainId: 1952,
});
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

const owner = await contract.owner();
if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
  throw new Error(`PRIVATE_KEY wallet ${wallet.address} is not owner ${owner}.`);
}

const firstMatchId = Number(await contract.nextMatchId());
console.log(`Current nextMatchId is ${firstMatchId}. Seed start is ${seedStartMatchId}.`);

for (let index = 0; index < fixtures.length; index += 1) {
  const [home, away, kickoffIso, aiPrediction] = fixtures[index];
  const expectedMatchId = seedStartMatchId + index;
  const kickoffTime = BigInt(Math.floor(new Date(kickoffIso).getTime() / 1000));

  if (expectedMatchId < firstMatchId) {
    const existing = await contract.matches(expectedMatchId);
    if (
      existing.exists &&
      existing.homeTeam === home &&
      existing.awayTeam === away &&
      existing.kickoffTime === kickoffTime &&
      existing.isHidden === false
    ) {
      console.log(`${home} vs ${away}: already exists at match ID ${expectedMatchId}`);
      continue;
    }

    throw new Error(`Match ID ${expectedMatchId} exists but does not match the expected fixture.`);
  }

  const tx = await contract.createMatch(home, away, kickoffTime, aiPrediction);
  const receipt = await tx.wait();
  console.log(`${home} vs ${away}: ${tx.hash} (${receipt.status === 1 ? "confirmed" : "failed"})`);
}

const nextMatchId = Number(await contract.nextMatchId());
console.log(`nextMatchId is now ${nextMatchId}`);

for (let matchId = seedStartMatchId; matchId < nextMatchId; matchId += 1) {
  const match = await contract.matches(matchId);
  console.log(
    JSON.stringify({
      id: matchId,
      home: match.homeTeam,
      away: match.awayTeam,
      kickoff: new Date(Number(match.kickoffTime) * 1000).toISOString(),
      exists: match.exists,
      finalized: match.finalized,
      isHidden: match.isHidden,
    }),
  );
}
