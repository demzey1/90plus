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
  kickoff: string;  // ISO 8601 UTC
};

export const fixtures: Fixture[] = [
  {
    id: 1,
    home: "Mexico",
    away: "South Africa",
    homeFlag: "mx",
    awayFlag: "za",
    group: "Group A",
    stadium: "Estadio Azteca",
    city: "Mexico City",
    kickoff: "2026-06-11T19:00:00Z",
  },
  {
    id: 2,
    home: "USA",
    away: "Paraguay",
    homeFlag: "us",
    awayFlag: "py",
    group: "Group D",
    stadium: "SoFi Stadium",
    city: "Los Angeles",
    kickoff: "2026-06-13T01:00:00Z",
  },
  {
    id: 3,
    home: "Brazil",
    away: "Morocco",
    homeFlag: "br",
    awayFlag: "ma",
    group: "Group C",
    stadium: "MetLife Stadium",
    city: "New York / New Jersey",
    kickoff: "2026-06-13T22:00:00Z",
  },
  {
    id: 4,
    home: "Germany",
    away: "Curaçao",
    homeFlag: "de",
    awayFlag: "cw",
    group: "Group E",
    stadium: "NRG Stadium",
    city: "Houston",
    kickoff: "2026-06-14T17:00:00Z",
  },
  {
    id: 5,
    home: "Netherlands",
    away: "Japan",
    homeFlag: "nl",
    awayFlag: "jp",
    group: "Group F",
    stadium: "AT&T Stadium",
    city: "Dallas",
    kickoff: "2026-06-14T20:00:00Z",
  },
  {
    id: 6,
    home: "France",
    away: "Senegal",
    homeFlag: "fr",
    awayFlag: "sn",
    group: "Group I",
    stadium: "MetLife Stadium",
    city: "New York / New Jersey",
    kickoff: "2026-06-16T19:00:00Z",
  },
  {
    id: 7,
    home: "Argentina",
    away: "Algeria",
    homeFlag: "ar",
    awayFlag: "dz",
    group: "Group J",
    stadium: "Arrowhead Stadium",
    city: "Kansas City",
    kickoff: "2026-06-17T01:00:00Z",
  },
  {
    id: 8,
    home: "England",
    away: "Croatia",
    homeFlag: "gb",
    awayFlag: "hr",
    group: "Group L",
    stadium: "AT&T Stadium",
    city: "Dallas",
    kickoff: "2026-06-17T20:00:00Z",
  },
];

export type LeaderboardSeed = {
  name: string;
  address: `0x${string}`;
  tickets: number;
  form: string;
};

export const leaderboardSeeds: LeaderboardSeed[] = [];

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
