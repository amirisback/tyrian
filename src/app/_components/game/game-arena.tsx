"use client";

import React, { useState } from "react";
import { TyrianWebPlayer } from "./tyrian-web-player";
import { JdosPlayer } from "./jdos-player";
import { ControlsGuide } from "./controls-guide";

interface GameArenaProps {
  dict: {
    common: {
      launchGame: string;
      restart: string;
      soundOn: string;
      soundOff: string;
      fullscreen: string;
      loading: string;
    };
    game: {
      readyPrompt: string;
      arenaTitle: string;
      arenaSubtitle: string;
      virtualController: string;
      controlsHint: string;
      touchNote: string;
    };
  };
}

export function GameArena({ dict }: GameArenaProps) {
  const [engineMode, setEngineMode] = useState<"web" | "dos">("web");

  return (
    <section id="game-arena" className="w-full scroll-mt-20 space-y-6">
      {/* Engine Mode Toggle Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-cyan-500/20 bg-slate-950/70 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              PILIHAN ENGINE GAME
            </span>
            <span className="text-xs font-mono text-slate-400">
              {engineMode === "web" ? "Direct Web Engine (No .EXE)" : "DOSBox WASM (.EXE Emulation)"}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-mono text-white">
            {engineMode === "web" ? "TYRIAN WEB ENGINE" : dict.game.arenaTitle}
          </h2>
        </div>

        {/* Engine Switcher Buttons */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setEngineMode("web")}
            className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
              engineMode === "web"
                ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ⚡ DIRECT WEB ENGINE <span className="text-[10px] opacity-80">(NO .EXE)</span>
          </button>

          <button
            type="button"
            onClick={() => setEngineMode("dos")}
            className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
              engineMode === "dos"
                ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.6)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            💾 DOSBOX EMULATOR <span className="text-[10px] opacity-80">(.EXE)</span>
          </button>
        </div>
      </div>

      {/* Active Game Player Mount */}
      {engineMode === "web" ? (
        <TyrianWebPlayer dict={dict} />
      ) : (
        <JdosPlayer dict={dict} />
      )}

      {/* Controls & Tactics Guide */}
      <ControlsGuide dict={dict} />
    </section>
  );
}
