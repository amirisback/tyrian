import React from "react";
import episodesData from "@/data/episodes.json";
import { ArcadeCard } from "../ui/arcade-card";
import { Badge } from "../ui/badge";

interface EpisodesSectionProps {
  dict: {
    episodes: {
      badge: string;
      title: string;
      subtitle: string;
      levels: string;
      primaryBoss: string;
      destination: string;
    };
  };
}

export function EpisodesSection({ dict }: EpisodesSectionProps) {
  return (
    <section id="episodes" className="scroll-mt-20 py-16 border-b border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="amber">{dict.episodes.badge}</Badge>
          <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
            {dict.episodes.title}
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            {dict.episodes.subtitle}
          </p>
        </div>

        {/* Episode Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodesData.map((ep) => (
            <ArcadeCard
              key={ep.id}
              title={ep.title}
              badge={`EPISODE ${ep.id}`}
              variant={ep.id % 2 === 0 ? "purple" : "cyan"}
            >
              <span className="block font-mono text-xs text-amber-400 font-bold mb-2">
                {ep.subtitle}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed min-h-[60px] mb-4">
                {ep.description}
              </p>

              <div className="pt-3 border-t border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">{dict.episodes.destination}:</span>
                  <span className="font-bold text-cyan-300">{ep.planet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{dict.episodes.levels}:</span>
                  <span className="font-bold text-emerald-400">{ep.levels} SEKTOR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{dict.episodes.primaryBoss}:</span>
                  <span className="font-bold text-red-400">{ep.boss}</span>
                </div>
              </div>
            </ArcadeCard>
          ))}
        </div>
      </div>
    </section>
  );
}
