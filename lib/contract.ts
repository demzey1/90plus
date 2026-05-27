export const NINETY_PLUS_ADDRESS =
  "0x90Fe3B19850E95258414Cb553403c515fd7b63EE" as const;

export type PickChoice = 0 | 1 | 2;

export const ninetyPlusAbi = [
  {
    type: "function",
    name: "owner",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "createMatch",
    stateMutability: "nonpayable",
    inputs: [
      { name: "homeTeam", type: "string" },
      { name: "awayTeam", type: "string" },
      { name: "kickoffTime", type: "uint256" },
      { name: "aiPrediction", type: "string" },
    ],
    outputs: [{ name: "matchId", type: "uint256" }],
  },
  {
    type: "function",
    name: "finalizeMatch",
    stateMutability: "nonpayable",
    inputs: [
      { name: "matchId", type: "uint256" },
      { name: "homeScore", type: "uint8" },
      { name: "awayScore", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "submitPrediction",
    stateMutability: "nonpayable",
    inputs: [
      { name: "matchId", type: "uint256" },
      { name: "pick", type: "uint8" },
      { name: "predictedHomeScore", type: "uint8" },
      { name: "predictedAwayScore", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "hideMatch",
    stateMutability: "nonpayable",
    inputs: [
      { name: "matchId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "predictions",
    stateMutability: "view",
    inputs: [
      { name: "", type: "uint256" },
      { name: "", type: "address" },
    ],
    outputs: [
      { name: "submitted", type: "bool" },
      { name: "pick", type: "uint8" },
      { name: "predictedHomeScore", type: "uint8" },
      { name: "predictedAwayScore", type: "uint8" },
      { name: "submittedAt", type: "uint256" },
      { name: "points", type: "uint256" },
      { name: "tokenId", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "totalPoints",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "predictionCount",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "matches",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "homeTeam", type: "string" },
      { name: "awayTeam", type: "string" },
      { name: "kickoffTime", type: "uint256" },
      { name: "exists", type: "bool" },
      { name: "finalized", type: "bool" },
      { name: "homeScore", type: "uint8" },
      { name: "awayScore", type: "uint8" },
      { name: "aiPrediction", type: "string" },
      { name: "isHidden", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "nextMatchId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export type Fixture = {
  id: number;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  group: string;
  stadium: string;
  city: string;
  kickoff: string;
  pulse: string;
  aiLean: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
};

export const fixtures: Fixture[] = [
  {
    id: 1,
    home: "Mexico",
    away: "Japan",
    homeFlag: "mx",
    awayFlag: "jp",
    group: "Group A",
    stadium: "Estadio Azteca",
    city: "Mexico City",
    kickoff: "2026-06-11T20:00:00Z",
    pulse: "Opening night pressure",
    aiLean: "Mexico press high, Japan break lines",
    odds: { home: 42, draw: 28, away: 30 },
  },
  {
    id: 2,
    home: "USA",
    away: "Ghana",
    homeFlag: "us",
    awayFlag: "gh",
    group: "Group B",
    stadium: "MetLife Stadium",
    city: "New York/New Jersey",
    kickoff: "2026-06-12T22:00:00Z",
    pulse: "Host nation noise",
    aiLean: "USA width, Ghana transitions",
    odds: { home: 45, draw: 25, away: 30 },
  },
  {
    id: 3,
    home: "Canada",
    away: "Croatia",
    homeFlag: "ca",
    awayFlag: "hr",
    group: "Group C",
    stadium: "BMO Field",
    city: "Toronto",
    kickoff: "2026-06-13T20:00:00Z",
    pulse: "Cold-blooded midfield duel",
    aiLean: "Croatia control, Canada pace",
    odds: { home: 31, draw: 30, away: 39 },
  },
  {
    id: 4,
    home: "Brazil",
    away: "Nigeria",
    homeFlag: "br",
    awayFlag: "ng",
    group: "Group D",
    stadium: "Hard Rock Stadium",
    city: "Miami",
    kickoff: "2026-06-14T01:00:00Z",
    pulse: "Skill overload",
    aiLean: "Brazil flair, Nigeria chaos",
    odds: { home: 54, draw: 23, away: 23 },
  },
  {
    id: 5,
    home: "Argentina",
    away: "Morocco",
    homeFlag: "ar",
    awayFlag: "ma",
    group: "Group E",
    stadium: "Mercedes-Benz Stadium",
    city: "Atlanta",
    kickoff: "2026-06-15T00:00:00Z",
    pulse: "Legacy versus steel",
    aiLean: "Argentina control, Morocco block",
    odds: { home: 50, draw: 27, away: 23 },
  },
  {
    id: 6,
    home: "England",
    away: "Senegal",
    homeFlag: "gb",
    awayFlag: "sn",
    group: "Group F",
    stadium: "SoFi Stadium",
    city: "Los Angeles",
    kickoff: "2026-06-16T02:00:00Z",
    pulse: "Knockout energy early",
    aiLean: "England possession, Senegal power",
    odds: { home: 46, draw: 29, away: 25 },
  },
  {
    id: 7,
    home: "France",
    away: "Uruguay",
    homeFlag: "fr",
    awayFlag: "uy",
    group: "Group G",
    stadium: "AT&T Stadium",
    city: "Dallas",
    kickoff: "2026-06-17T01:00:00Z",
    pulse: "Heavyweight collision",
    aiLean: "France speed, Uruguay bite",
    odds: { home: 49, draw: 26, away: 25 },
  },
  {
    id: 8,
    home: "Spain",
    away: "Colombia",
    homeFlag: "es",
    awayFlag: "co",
    group: "Group H",
    stadium: "Lumen Field",
    city: "Seattle",
    kickoff: "2026-06-18T23:00:00Z",
    pulse: "Midfield lasers",
    aiLean: "Spain rhythm, Colombia verticals",
    odds: { home: 44, draw: 28, away: 28 },
  },
];

export type LeaderboardSeed = {
  name: string;
  address: `0x${string}`;
  tickets: number;
  form: string;
};

export const leaderboardSeeds: LeaderboardSeed[] = [
  { name: "Pitch Oracle", address: "0x9F4a7d6e0D3cC21A3a4C95B8dC0dA0C91aE5C21A", tickets: 14, form: "6W" },
  { name: "Last-Minute FC", address: "0x23E18dEeAd9147D0bE6D6a8b6b7e3F3D7D4f47D7", tickets: 13, form: "5W" },
  { name: "VAR Prophet", address: "0x71Bfd9e0C331091Ea2F4A14e0D1c3C8F5a0B091E", tickets: 12, form: "4W" },
  { name: "Neon Ultra", address: "0xA02a10f18eD48eD48eD48eD48eD48eD48eD48eD4", tickets: 11, form: "3W" },
  { name: "Golden Boot DAO", address: "0xDD0b19f8a1A019F8dD0b19f8a1A019F8dD0b19f8", tickets: 9, form: "2W" },
  { name: "Clean Sheet Cartel", address: "0x6C1ab8116C1AB8116c1aB8116c1Ab8116C1ab811", tickets: 8, form: "2W" },
];

export const pickLabels = ["HOME", "DRAW", "AWAY"] as const;

export type ContractPrediction = readonly [
  boolean,
  number,
  number,
  number,
  bigint,
  bigint,
  bigint,
];
