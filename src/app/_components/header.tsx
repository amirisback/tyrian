"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArcadeButton } from "./ui/arcade-button";
// import { LanguageSwitcher } from "./language-switcher";
// import { ThemeSwitcher } from "./theme-switcher";

interface HeaderProps {
  navLabels: {
    home: string;
    play: string;
    hangar: string;
    weapons: string;
    episodes: string;
    soundtrack: string;
    leaderboard: string;
    source: string;
    manual: string;
  };
  playLabel: string;
}

export function Header({ navLabels, playLabel }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#game-arena", label: navLabels.play },
    { href: "/#hangar", label: navLabels.hangar },
    { href: "/#weapons", label: navLabels.weapons },
    { href: "/#episodes", label: navLabels.episodes },
    { href: "/#soundtrack", label: navLabels.soundtrack },
    { href: "/#leaderboard", label: navLabels.leaderboard },
    { href: "/source", label: navLabels.source },
    { href: "/manual", label: navLabels.manual },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/60 bg-slate-900 shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:border-cyan-300 group-hover:shadow-[0_0_22px_rgba(0,240,255,0.7)] transition-all">
            <span className="font-mono text-base font-black text-cyan-400 group-hover:scale-110 transition-transform">
              TY
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-lg font-black tracking-widest text-white group-hover:text-cyan-300 transition-colors">
              TYRIAN
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400/80 -mt-1">
              DOS RETRO ARCADE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5 font-mono text-xs font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded text-slate-300 hover:text-cyan-300 hover:bg-slate-900/80 border border-transparent hover:border-slate-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Button & Status */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 font-mono text-[11px] font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ONLINE • 60 FPS</span>
          </div>

          <Link href="/#game-arena">
            <ArcadeButton variant="cyan" size="sm" className="hidden sm:inline-flex shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              {playLabel}
            </ArcadeButton>
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden flex items-center justify-center p-2 rounded-md border border-slate-700 bg-slate-900 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-2 font-mono text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded text-slate-200 hover:text-cyan-300 hover:bg-slate-900"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link href="/#game-arena" onClick={() => setMobileMenuOpen(false)}>
              <ArcadeButton variant="cyan" size="sm" className="w-full">
                {playLabel}
              </ArcadeButton>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
