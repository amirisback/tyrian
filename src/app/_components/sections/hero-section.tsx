import React from "react";
import Link from "next/link";
import { ArcadeButton } from "../ui/arcade-button";

interface HeroSectionProps {
  dict: {
    hero: {
      badge: string;
      title: string;
      subtitle: string;
      description: string;
      ctaPlay: string;
      ctaSource: string;
      stat1Label: string;
      stat1Value: string;
      stat2Label: string;
      stat2Value: string;
      stat3Label: string;
      stat3Value: string;
    };
  };
}

export function HeroSection({ dict }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-800/80 space-grid-bg">
      {/* Glow Orbs in Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 font-mono text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.25)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          {dict.hero.badge}
        </div>

        {/* Title */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-500 drop-shadow-[0_0_35px_rgba(0,240,255,0.7)]">
            {dict.hero.title}
          </h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono text-slate-200 tracking-wide">
            {dict.hero.subtitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {dict.hero.description}
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="#game-arena" className="w-full sm:w-auto">
            <ArcadeButton
              variant="cyan"
              size="lg"
              className="w-full sm:w-auto shadow-[0_0_25px_rgba(0,240,255,0.5)] font-black text-base"
            >
              ▶ {dict.hero.ctaPlay}
            </ArcadeButton>
          </Link>
          <Link href="/source" className="w-full sm:w-auto">
            <ArcadeButton
              variant="outline"
              size="lg"
              className="w-full sm:w-auto font-bold text-base"
            >
              ⌨ {dict.hero.ctaSource}
            </ArcadeButton>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-10 border-t border-slate-800/80">
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
              {dict.hero.stat1Label}
            </span>
            <span className="text-base font-mono font-black text-cyan-400">
              {dict.hero.stat1Value}
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
              {dict.hero.stat2Label}
            </span>
            <span className="text-base font-mono font-black text-purple-400">
              {dict.hero.stat2Value}
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
              {dict.hero.stat3Label}
            </span>
            <span className="text-base font-mono font-black text-emerald-400">
              {dict.hero.stat3Value}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
