"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { TyrianWebEngine } from "./web-engine/engine";
import { GamePhase, ShipId } from "./web-engine/types";
import { SHIPS } from "./web-engine/ships";
import { ArcadeButton } from "../ui/arcade-button";
import { VirtualGamepad } from "./virtual-gamepad";

interface TyrianWebPlayerProps {
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
    };
  };
}

export function TyrianWebPlayer({ dict }: TyrianWebPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<TyrianWebEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<GamePhase>("menu");
  const [selectedShip, setSelectedShip] = useState<ShipId>("talon");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [scanlines, setScanlines] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showGamepad, setShowGamepad] = useState<boolean>(true);

  // In-game stats updated from engine loop
  const [stats, setStats] = useState({
    score: 0,
    credits: 0,
    wave: 1,
    shield: 100,
    armor: 100,
    weaponLevel: 1,
    superbombs: 2,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current = null;
      }
    };
  }, []);

  const handleStartGame = useCallback(() => {
    if (!canvasRef.current) return;

    if (!engineRef.current) {
      engineRef.current = new TyrianWebEngine(canvasRef.current, selectedShip, {
        onPhaseChange: (newPhase) => setPhase(newPhase),
        onStatsUpdate: (newStats) => setStats(newStats),
      });
      engineRef.current.setScanlines(scanlines);
      engineRef.current.setMuted(isMuted);
    } else {
      engineRef.current.setShip(selectedShip);
      engineRef.current.setScanlines(scanlines);
      engineRef.current.setMuted(isMuted);
    }

    engineRef.current.start();
  }, [selectedShip, scanlines, isMuted]);

  const handleSelectShip = (shipId: ShipId) => {
    setSelectedShip(shipId);
    if (engineRef.current) {
      engineRef.current.setShip(shipId);
    }
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (engineRef.current) {
      engineRef.current.setMuted(nextMuted);
    }
  };

  const toggleScanlines = () => {
    const nextScan = !scanlines;
    setScanlines(nextScan);
    if (engineRef.current) {
      engineRef.current.setScanlines(nextScan);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handlePause = () => {
    if (engineRef.current) {
      engineRef.current.pause();
    }
  };

  const handleSuperbomb = () => {
    if (engineRef.current) {
      engineRef.current.triggerSuperbomb();
    }
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      const code = e.code;
      if (["ArrowUp", "KeyW"].includes(code)) engineRef.current.setInput({ up: true });
      if (["ArrowDown", "KeyS"].includes(code)) engineRef.current.setInput({ down: true });
      if (["ArrowLeft", "KeyA"].includes(code)) engineRef.current.setInput({ left: true });
      if (["ArrowRight", "KeyD"].includes(code)) engineRef.current.setInput({ right: true });
      if (["Space", "KeyZ", "ControlLeft"].includes(code)) {
        e.preventDefault();
        engineRef.current.setInput({ fire: true });
      }
      if (["KeyX", "KeyB"].includes(code)) {
        e.preventDefault();
        engineRef.current.setInput({ superbomb: true });
      }
      if (["ShiftLeft", "ShiftRight"].includes(code)) engineRef.current.setInput({ focus: true });
      if (code === "KeyP" || code === "Escape") {
        e.preventDefault();
        handlePause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      const code = e.code;
      if (["ArrowUp", "KeyW"].includes(code)) engineRef.current.setInput({ up: false });
      if (["ArrowDown", "KeyS"].includes(code)) engineRef.current.setInput({ down: false });
      if (["ArrowLeft", "KeyA"].includes(code)) engineRef.current.setInput({ left: false });
      if (["ArrowRight", "KeyD"].includes(code)) engineRef.current.setInput({ right: false });
      if (["Space", "KeyZ", "ControlLeft"].includes(code)) engineRef.current.setInput({ fire: false });
      if (["KeyX", "KeyB"].includes(code)) engineRef.current.setInput({ superbomb: false });
      if (["ShiftLeft", "ShiftRight"].includes(code)) engineRef.current.setInput({ focus: false });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl border border-cyan-500/30 bg-[#030712] p-4 sm:p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col items-center select-none ${
        isFullscreen ? "h-screen w-screen rounded-none p-2 justify-center" : ""
      }`}
    >
      {/* Top Header Controls Bar */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cyan-900/50">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold">
            TYRIAN DIRECT WEB ENGINE
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
            ZERO .EXE • NATIVE 60 FPS
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${
              !isMuted
                ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
            title="Toggle FM Synthesis Audio"
          >
            {!isMuted ? "🔊 FM AUDIO ON" : "🔇 AUDIO MUTED"}
          </button>

          <button
            onClick={toggleScanlines}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${
              scanlines
                ? "bg-amber-500/10 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
            title="Toggle CRT Scanline Overlay"
          >
            {scanlines ? "⚡ CRT SCANLINES" : "📺 CLEAN DISPLAY"}
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 rounded text-xs font-mono border bg-slate-800 border-slate-700 text-slate-300 hover:border-cyan-400 transition-all"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? "🗗 EXIT FULL" : "⛶ FULLSCREEN"}
          </button>
        </div>
      </div>

      {/* Main Canvas Container with CRT Bezel Framing */}
      <div className="relative mt-4 rounded-xl overflow-hidden border-2 border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-black flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          className="w-[320px] sm:w-[480px] md:w-[640px] lg:w-[720px] aspect-[4/3] max-w-full h-auto block image-render-pixelated cursor-crosshair"
          style={{ imageRendering: "pixelated" }}
        />

        {/* OVERLAY: Menu Screen */}
        {phase === "menu" && (
          <div className="absolute inset-0 bg-[#050711]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-3xl sm:text-5xl font-black font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-600 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                TYRIAN 2000
              </h3>
              <p className="font-mono text-xs sm:text-sm text-cyan-400/90 tracking-wide">
                RECONSTRUCTED WEB ENGINE • NO DOSBOX • NO .EXE REQUIRED
              </p>
            </div>

            {/* Ship Selector Hangar */}
            <div className="w-full max-w-md bg-slate-900/80 border border-cyan-500/30 rounded-xl p-4 space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                PILIH ARMADA KAPAL TEMPUR:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(SHIPS) as ShipId[]).map((id) => {
                  const ship = SHIPS[id];
                  const isSelected = selectedShip === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleSelectShip(id)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? "bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                          : "bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      <div className="font-mono font-bold text-xs text-white">{ship.name}</div>
                      <div className="text-[10px] text-cyan-400 mt-0.5">{ship.manufacturer.split(" ")[0]}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Ship Specs Preview */}
              <div className="text-[11px] font-mono text-slate-300 bg-black/40 rounded p-2 text-left border border-slate-800">
                <span className="text-cyan-400 font-bold">{SHIPS[selectedShip].name}</span>:{" "}
                {SHIPS[selectedShip].description}
                <div className="mt-1 text-[10px] text-amber-400">
                  ★ Kemampuan: {SHIPS[selectedShip].special}
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-2">
              <ArcadeButton variant="cyan" size="lg" onClick={handleStartGame}>
                🚀 LUNCURKAN MISI TEMPUR (START)
              </ArcadeButton>
            </div>

            <p className="text-[11px] font-mono text-slate-400">
              Gunakan <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">WASD / Panah</kbd> untuk Gerak,{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">Spasi</kbd> Menembak, dan{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">X</kbd> Superbomb.
            </p>
          </div>
        )}

        {/* OVERLAY: Paused Screen */}
        {phase === "paused" && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h3 className="text-3xl font-mono font-black text-amber-400 tracking-wider">
              GAME DIJEDA (PAUSED)
            </h3>
            <p className="text-xs font-mono text-slate-300 max-w-xs">
              Tekan tombol di bawah atau tombol <kbd className="px-1 py-0.5 bg-slate-800 rounded">P</kbd> untuk
              melanjutkan pertempuran.
            </p>
            <div className="flex gap-3">
              <ArcadeButton variant="cyan" size="md" onClick={handlePause}>
                LANJUTKAN (RESUME)
              </ArcadeButton>
              <ArcadeButton variant="outline" size="md" onClick={handleStartGame}>
                RESTART
              </ArcadeButton>
            </div>
          </div>
        )}

        {/* OVERLAY: Game Over Screen */}
        {phase === "gameover" && (
          <div className="absolute inset-0 bg-red-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h3 className="text-3xl sm:text-4xl font-mono font-black text-red-500 tracking-widest drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
              KAPAL HANCUR (GAME OVER)
            </h3>
            <div className="bg-black/60 border border-red-500/40 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1.5 min-w-[260px]">
              <div>
                SKOR AKHIR: <span className="text-amber-400 font-bold">{stats.score.toLocaleString()}</span>
              </div>
              <div>
                KREDIT DIKUMPULKAN: <span className="text-yellow-300 font-bold">${stats.credits}</span>
              </div>
              <div>
                WAVE TERTINGGI: <span className="text-cyan-400 font-bold">WAVE {stats.wave}</span>
              </div>
            </div>
            <div className="pt-2">
              <ArcadeButton variant="amber" size="lg" onClick={handleStartGame}>
                🔄 COBA LAGI (RETRY)
              </ArcadeButton>
            </div>
          </div>
        )}

        {/* OVERLAY: Victory Screen */}
        {phase === "victory" && (
          <div className="absolute inset-0 bg-cyan-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h3 className="text-3xl sm:text-4xl font-mono font-black text-cyan-400 tracking-widest drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
              VICTORY! DREADNOUGHT DESTROYED
            </h3>
            <p className="text-xs font-mono text-slate-200 max-w-sm">
              Selamat pilot! Armada MicroSol berhasil dipukul mundur dari sektor ini.
            </p>
            <div className="bg-black/60 border border-cyan-500/40 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1.5 min-w-[260px]">
              <div>
                TOTAL SKOR: <span className="text-amber-400 font-bold">{stats.score.toLocaleString()}</span>
              </div>
              <div>
                KREDIT MISI: <span className="text-yellow-300 font-bold">${stats.credits}</span>
              </div>
            </div>
            <div className="pt-2">
              <ArcadeButton variant="green" size="lg" onClick={handleStartGame}>
                🚀 LANJUTKAN MISI BERIKUTNYA
              </ArcadeButton>
            </div>
          </div>
        )}
      </div>

      {/* Virtual Gamepad for Touch Screen / Mobile Navigation */}
      {showGamepad && phase === "playing" && (
        <div className="w-full max-w-2xl mt-4 sm:hidden">
          <VirtualGamepad className="w-full" />
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div className="w-full max-w-4xl mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400">Papan Skor:</span>
          <span className="text-white font-bold">{stats.score.toLocaleString()}</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">Wave:</span>
          <span className="text-white font-bold">{stats.wave}</span>
        </div>

        <div className="flex items-center gap-2">
          {phase === "playing" && (
            <>
              <button
                onClick={handlePause}
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                ⏸ JEDA (P)
              </button>
              <button
                onClick={handleSuperbomb}
                disabled={stats.superbombs <= 0}
                className="px-2.5 py-1 rounded bg-red-600/80 text-white hover:bg-red-500 disabled:opacity-40 transition-colors"
              >
                💣 SUPERBOMB ({stats.superbombs})
              </button>
            </>
          )}

          <button
            onClick={() => setShowGamepad(!showGamepad)}
            className="sm:hidden px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            {showGamepad ? "Sembunyikan Gamepad" : "Tampilkan Gamepad"}
          </button>
        </div>
      </div>
    </div>
  );
}
