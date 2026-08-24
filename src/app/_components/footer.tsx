import React from "react";
import Link from "next/link";

interface FooterProps {
  dict: {
    footer: {
      copyright: string;
      originalCredits: string;
      openTyrianCredits: string;
      pwaReady: string;
    };
    nav: {
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
  };
}

export function Footer({ dict }: FooterProps) {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-900">
          {/* Col 1: About Tyrian */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded border border-cyan-400/60 bg-slate-900 text-cyan-400 font-mono font-black text-sm">
                TY
              </div>
              <span className="font-mono text-base font-black text-white tracking-wider">
                TYRIAN DOS ARCADE
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-md">
              {dict.footer.originalCredits}
            </p>
            <p className="text-xs leading-relaxed text-slate-500 max-w-md">
              {dict.footer.openTyrianCredits}
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2 font-mono text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3">
              KONTEN ARCADE
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/#game-arena" className="hover:text-cyan-300 transition-colors">
                  {dict.nav.play}
                </Link>
              </li>
              <li>
                <Link href="/#hangar" className="hover:text-cyan-300 transition-colors">
                  {dict.nav.hangar}
                </Link>
              </li>
              <li>
                <Link href="/#weapons" className="hover:text-cyan-300 transition-colors">
                  {dict.nav.weapons}
                </Link>
              </li>
              <li>
                <Link href="/#episodes" className="hover:text-cyan-300 transition-colors">
                  {dict.nav.episodes}
                </Link>
              </li>
              <li>
                <Link href="/#soundtrack" className="hover:text-cyan-300 transition-colors">
                  {dict.nav.soundtrack}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tech & Source Docs */}
          <div className="space-y-2 font-mono text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3">
              ENGINE & DOCS
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/source" className="hover:text-cyan-300 transition-colors">
                  {dict.nav.source}
                </Link>
              </li>
              <li>
                <Link href="/manual" className="hover:text-cyan-300 transition-colors">
                  {dict.nav.manual}
                </Link>
              </li>
              <li>
                <Link href="/#leaderboard" className="hover:text-cyan-300 transition-colors">
                  {dict.nav.leaderboard}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/opentyrian/opentyrian"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                >
                  GitHub Repository ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>{dict.footer.copyright}</div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-[10px]">
              {dict.footer.pwaReady}
            </span>
            <span className="px-2 py-0.5 rounded border border-purple-500/30 bg-purple-950/20 text-purple-400 text-[10px]">
              NEXT.JS 16 • REACT 19
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
