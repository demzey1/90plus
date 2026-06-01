"use client";

import { Crown, Medal } from "lucide-react";
import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import {
  leaderboardSeeds,
  NINETY_PLUS_ADDRESS,
  ninetyPlusAbi,
  type ContractUserStats,
} from "@/lib/contract";
import { xLayerTestnet } from "@/lib/wagmi";

type LeaderboardRow = {
  name: string;
  address: `0x${string}`;
  tickets: number;
  form: string;
  points: bigint;
};

export function LeaderboardBoard() {
  const { data, isLoading, isError } = useReadContracts({
    contracts: leaderboardSeeds.map((fan) => ({
      address: NINETY_PLUS_ADDRESS,
      abi: ninetyPlusAbi,
      functionName: "userStats",
      args: [fan.address],
      chainId: xLayerTestnet.id,
    })),
  });

  const rows = useMemo<LeaderboardRow[]>(() => {
    return leaderboardSeeds
      .map((fan, index) => {
        const stats = data?.[index];
        const points =
          stats?.status === "success"
            ? (stats.result as unknown as ContractUserStats)[0]
            : 0n;

        return {
          ...fan,
          points,
        };
      })
      .sort((left, right) => {
        if (left.points === right.points) {
          return 0;
        }

        return left.points > right.points ? -1 : 1;
      });
  }, [data]);

  if (isLoading) {
    return (
      <div className="panel p-6">
        <p className="font-score text-pitch">Reading X Layer points...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="panel p-6">
        <p className="font-score text-red-200">Unable to read leaderboard totals from the contract.</p>
      </div>
    );
  }

  return (
    <section className="panel overflow-x-auto p-4 md:p-6">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th className="px-4">Rank</th>
            <th className="px-4">Fan</th>
            <th className="px-4">Wallet</th>
            <th className="px-4">Tickets</th>
            <th className="px-4">Form</th>
            <th className="px-4 text-right">Points</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((fan, index) => (
            <tr key={fan.address} className={`leaderboard-row leaderboard-rank-${index + 1}`}>
              <td>
                <div className="flex items-center gap-2 font-score">
                  {index === 0 ? <Crown size={18} color="#FFD700" /> : <Medal size={18} color={index === 1 ? "#D4D8E6" : "#C8923E"} />}
                  #{index + 1}
                </div>
              </td>
              <td className="font-black">{fan.name}</td>
              <td className="font-score text-white/62">{fan.address}</td>
              <td className="font-score">{fan.tickets}</td>
              <td className="font-score text-pitch">{fan.form}</td>
              <td className="text-right font-score text-2xl gold-text">{fan.points.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
