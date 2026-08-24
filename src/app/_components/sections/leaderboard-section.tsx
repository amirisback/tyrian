import React from "react";
import leaderboardData from "@/data/leaderboard.json";
import { Badge } from "../ui/badge";

interface LeaderboardSectionProps {
  dict: {
    leaderboard: {
      badge: string;
      title: string;
      subtitle: string;
      colRank: string;
      colPilot: string;
      colScore: string;
      colShip: string;
      colEpisode: string;
      colDifficulty: string;
    };
  };
}

export function LeaderboardSection({ dict }: LeaderboardSectionProps) {
  return (
    <section id="leaderboard" className="scroll-mt-20 py-16 border-b border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="amber">{dict.leaderboard.badge}</Badge>
          <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
            {dict.leaderboard.title}
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            {dict.leaderboard.subtitle}
          </p>
        </div>

        {/* Arcade Leaderboard Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 shadow-[0_0_30px_rgba(0,0,0,0.7)]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5 text-center">{dict.leaderboard.colRank}</th>
                <th className="px-4 py-3.5">{dict.leaderboard.colPilot}</th>
                <th className="px-4 py-3.5">{dict.leaderboard.colScore}</th>
                <th className="px-4 py-3.5 hidden sm:table-cell">{dict.leaderboard.colShip}</th>
                <th className="px-4 py-3.5 hidden md:table-cell">{dict.leaderboard.colEpisode}</th>
                <th className="px-4 py-3.5 text-right">{dict.leaderboard.colDifficulty}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leaderboardData.map((row) => {
                const isTop3 = row.rank <= 3;
                const rankColor =
                  row.rank === 1
                    ? "text-amber-400 font-black"
                    : row.rank === 2
                    ? "text-slate-300 font-bold"
                    : row.rank === 3
                    ? "text-amber-600 font-bold"
                    : "text-slate-500";

                return (
                  <tr
                    key={row.rank}
                    className={`hover:bg-slate-900/60 transition-colors ${
                      row.rank === 1 ? "bg-amber-950/20" : ""
                    }`}
                  >
                    <td className={`px-4 py-3.5 text-center ${rankColor}`}>
                      #{row.rank}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-100 flex items-center gap-2">
                          {row.pilot}
                          {row.rank === 1 && (
                            <span className="text-xs">👑</span>
                          )}
                        </span>
                        <span className="text-[10px] text-cyan-400">
                          {row.callsign}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-amber-400 text-sm tracking-wider">
                      {row.score}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300 hidden sm:table-cell">
                      {row.ship}
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 hidden md:table-cell">
                      {row.episode}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isTop3
                            ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {row.difficulty}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
