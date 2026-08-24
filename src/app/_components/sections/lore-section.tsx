import React from "react";
import { ArcadeCard } from "../ui/arcade-card";
import { Badge } from "../ui/badge";

interface LoreSectionProps {
  dict: {
    lore: {
      badge: string;
      title: string;
      subtitle: string;
      microsolTitle: string;
      microsolDesc: string;
      trentTitle: string;
      trentDesc: string;
      zinglonTitle: string;
      zinglonDesc: string;
    };
  };
}

export function LoreSection({ dict }: LoreSectionProps) {
  return (
    <section id="lore" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="purple">{dict.lore.badge}</Badge>
          <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
            {dict.lore.title}
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            {dict.lore.subtitle}
          </p>
        </div>

        {/* 3 Lore Dossier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ArcadeCard
            title={dict.lore.microsolTitle}
            badge="CONGLOMERATE"
            variant="purple"
          >
            <p className="text-xs text-slate-300 leading-relaxed">
              {dict.lore.microsolDesc}
            </p>
          </ArcadeCard>

          <ArcadeCard
            title={dict.lore.trentTitle}
            badge="PROTAGONIST"
            variant="cyan"
          >
            <p className="text-xs text-slate-300 leading-relaxed">
              {dict.lore.trentDesc}
            </p>
          </ArcadeCard>

          <ArcadeCard
            title={dict.lore.zinglonTitle}
            badge="ANOMALY"
            variant="amber"
          >
            <p className="text-xs text-slate-300 leading-relaxed">
              {dict.lore.zinglonDesc}
            </p>
          </ArcadeCard>
        </div>
      </div>
    </section>
  );
}
