"use client";

import React, { useState } from "react";
import weaponsData from "@/data/weapons.json";
import { ArcadeCard } from "../ui/arcade-card";
import { Badge } from "../ui/badge";

interface WeaponsSectionProps {
  dict: {
    weapons: {
      badge: string;
      title: string;
      subtitle: string;
      frontTab: string;
      rearTab: string;
      sidekickTab: string;
      damage: string;
      fireRate: string;
      powerCost: string;
    };
  };
}

export function WeaponsSection({ dict }: WeaponsSectionProps) {
  const [filterType, setFilterType] = useState<"ALL" | "Front" | "Rear" | "Sidekick">("ALL");

  const filteredWeapons =
    filterType === "ALL"
      ? weaponsData
      : weaponsData.filter((w) => w.type === filterType);

  return (
    <section id="weapons" className="scroll-mt-20 py-16 border-b border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="purple">{dict.weapons.badge}</Badge>
          <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
            {dict.weapons.title}
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            {dict.weapons.subtitle}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setFilterType("ALL")}
            className={`px-4 py-1.5 rounded-md font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
              filterType === "ALL"
                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            SEMUA WEAPON
          </button>
          <button
            type="button"
            onClick={() => setFilterType("Front")}
            className={`px-4 py-1.5 rounded-md font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
              filterType === "Front"
                ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            {dict.weapons.frontTab}
          </button>
          <button
            type="button"
            onClick={() => setFilterType("Rear")}
            className={`px-4 py-1.5 rounded-md font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
              filterType === "Rear"
                ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            {dict.weapons.rearTab}
          </button>
          <button
            type="button"
            onClick={() => setFilterType("Sidekick")}
            className={`px-4 py-1.5 rounded-md font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
              filterType === "Sidekick"
                ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            {dict.weapons.sidekickTab}
          </button>
        </div>

        {/* Weapons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWeapons.map((weapon) => {
            const badgeVariant =
              weapon.type === "Front"
                ? "cyan"
                : weapon.type === "Rear"
                ? "amber"
                : "purple";

            return (
              <ArcadeCard
                key={weapon.id}
                title={weapon.name}
                badge={weapon.type}
                variant={badgeVariant}
              >
                <p className="text-xs text-slate-300 min-h-[50px] leading-relaxed mb-4">
                  {weapon.description}
                </p>

                <div className="pt-3 border-t border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{dict.weapons.damage}:</span>
                    <span className="font-bold text-red-400">
                      {weapon.damage > 0 ? `${weapon.damage} DMG` : "DEFENSIVE"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{dict.weapons.fireRate}:</span>
                    <span className="font-bold text-cyan-400">{weapon.fireRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{dict.weapons.powerCost}:</span>
                    <span className="font-bold text-amber-400">{weapon.powerCost}</span>
                  </div>
                </div>
              </ArcadeCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
