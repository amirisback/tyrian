"use client";

import React, { useState } from "react";
import shipsData from "@/data/ships.json";
import { ArcadeCard } from "../ui/arcade-card";
import { Badge } from "../ui/badge";

interface HangarSectionProps {
  dict: {
    hangar: {
      badge: string;
      title: string;
      subtitle: string;
      armor: string;
      shield: string;
      power: string;
      speed: string;
      specialAbility: string;
    };
  };
}

export function HangarSection({ dict }: HangarSectionProps) {
  const [selectedShipId, setSelectedShipId] = useState<string>(shipsData[0].id);

  const activeShip = shipsData.find((s) => s.id === selectedShipId) || shipsData[0];

  const getStatPercentage = (val: number) => {
    return Math.min(100, Math.round((val / 160) * 100));
  };

  return (
    <section id="hangar" className="scroll-mt-20 py-16 border-b border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <Badge variant="cyan">{dict.hangar.badge}</Badge>
          <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
            {dict.hangar.title}
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            {dict.hangar.subtitle}
          </p>
        </div>

        {/* Ship Selector Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {shipsData.map((ship) => {
            const isSelected = ship.id === selectedShipId;
            return (
              <button
                key={ship.id}
                type="button"
                onClick={() => setSelectedShipId(ship.id)}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500 text-black border-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.5)] scale-105"
                    : "bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
                }`}
              >
                {ship.name}
              </button>
            );
          })}
        </div>

        {/* Ship Active Inspector Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Ship Hologram / Visualizer */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/90 relative overflow-hidden group">
            <div className="absolute inset-0 scanlines-overlay opacity-40 pointer-events-none" />
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
                HOLOGRAPHIC SCHEMATIC
              </span>
            </div>

            {/* Glowing Tech Vessel Icon */}
            <div className="my-8 relative flex items-center justify-center w-44 h-44 rounded-full border border-cyan-500/30 bg-cyan-950/20 shadow-[0_0_40px_rgba(0,240,255,0.2)]">
              <div className="text-6xl animate-pulse">🚀</div>
              <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 animate-spin" style={{ animationDuration: "20s" }} />
            </div>

            <div className="text-center space-y-1">
              <span className="font-mono text-lg font-black text-white">
                {activeShip.name}
              </span>
              <span className="block text-xs font-mono text-cyan-400">
                {activeShip.manufacturer}
              </span>
              <span className="inline-block px-2 py-0.5 mt-2 text-[10px] font-mono font-bold uppercase rounded bg-slate-800 text-slate-300 border border-slate-700">
                {activeShip.class}
              </span>
            </div>
          </div>

          {/* Right: Detailed Engineering Specifications */}
          <div className="lg:col-span-7 space-y-6">
            <ArcadeCard
              title={activeShip.name}
              badge={activeShip.class}
              variant="cyan"
              glow
            >
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                {activeShip.description}
              </p>

              {/* Stat Progress Bars */}
              <div className="space-y-4 font-mono text-xs">
                {/* Armor */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>{dict.hangar.armor}</span>
                    <span className="font-bold text-red-400">{activeShip.armor} HP</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-red-500 shadow-[0_0_8px_#ef4444] transition-all duration-300"
                      style={{ width: `${getStatPercentage(activeShip.armor)}%` }}
                    />
                  </div>
                </div>

                {/* Shield */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>{dict.hangar.shield}</span>
                    <span className="font-bold text-cyan-400">{activeShip.shield} GW</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] transition-all duration-300"
                      style={{ width: `${getStatPercentage(activeShip.shield)}%` }}
                    />
                  </div>
                </div>

                {/* Power */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>{dict.hangar.power}</span>
                    <span className="font-bold text-purple-400">{activeShip.power} MeV</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-purple-500 shadow-[0_0_8px_#a855f7] transition-all duration-300"
                      style={{ width: `${getStatPercentage(activeShip.power)}%` }}
                    />
                  </div>
                </div>

                {/* Speed */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>{dict.hangar.speed}</span>
                    <span className="font-bold text-emerald-400">{activeShip.speed} KPS</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-emerald-400 shadow-[0_0_8px_#10b981] transition-all duration-300"
                      style={{ width: `${getStatPercentage(activeShip.speed)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Special Ability Box */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  {dict.hangar.specialAbility}:
                </span>
                <span className="px-3 py-1 rounded bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
                  ⚡ {activeShip.special}
                </span>
              </div>
            </ArcadeCard>
          </div>
        </div>
      </div>
    </section>
  );
}
