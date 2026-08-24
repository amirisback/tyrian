"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArcadeButton } from "../ui/arcade-button";
import { VirtualGamepad } from "./virtual-gamepad";

interface JdosPlayerProps {
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

// Tyrian 2000 .jsdos bundle via local proxy (bypass CORS dari cdn.dos.zone)
const TYRIAN_BUNDLE = "/api/dos-bundle?game=tyrian-2000";
const JSDOS_JS = "https://v8.js-dos.com/latest/js-dos.js";
const JSDOS_CSS = "https://v8.js-dos.com/latest/js-dos.css";

export function JdosPlayer({ dict }: JdosPlayerProps) {
  const [phase, setPhase] = useState<"idle" | "loading" | "running">("idle");
  const [loadMsg, setLoadMsg] = useState<string>("");
  const [showGamepad, setShowGamepad] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [scriptReady, setScriptReady] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);   // outer wrapper (fullscreen target)
  const dosBoxRef = useRef<HTMLDivElement>(null);       // js-dos mounts here
  const dosRef = useRef<any>(null);

  // Load js-dos v8 CSS + JS dynamically once
  useEffect(() => {
    // CSS
    if (!document.getElementById("jsdos-css")) {
      const link = document.createElement("link");
      link.id = "jsdos-css";
      link.rel = "stylesheet";
      link.href = JSDOS_CSS;
      document.head.appendChild(link);
    }
    // JS
    if (!document.getElementById("jsdos-js")) {
      const script = document.createElement("script");
      script.id = "jsdos-js";
      script.src = JSDOS_JS;
      script.async = true;
      script.onload = () => setScriptReady(true);
      script.onerror = () => console.error("js-dos v8 script failed to load");
      document.head.appendChild(script);
    } else {
      // Already loaded in a previous mount
      setScriptReady(true);
    }

    return () => {
      // Cleanup dos instance on unmount
      if (dosRef.current) {
        try { dosRef.current.stop(); } catch (_) {}
        dosRef.current = null;
      }
    };
  }, []);

  const launchGame = async () => {
    if (!dosBoxRef.current) return;

    setPhase("loading");
    setLoadMsg("Menyiapkan DOSBox WASM engine...");

    const Dos = (window as any).Dos;
    if (!Dos) {
      setLoadMsg("Menunggu js-dos runtime...");
      // Wait for script ready
      const wait = setInterval(() => {
        if ((window as any).Dos) {
          clearInterval(wait);
          mountDos();
        }
      }, 200);
      return;
    }
    mountDos();
  };

  const mountDos = () => {
    const Dos = (window as any).Dos;
    if (!Dos || !dosBoxRef.current) return;

    setLoadMsg("Memuat Tyrian 2000 (bundle ~30MB)...");

    try {
      // js-dos v8: mount to div, load bundle
      const ci = Dos(dosBoxRef.current, {
        url: TYRIAN_BUNDLE,
        onEvent: (event: string, ci2: any) => {
          if (event === "emu-ready") {
            setPhase("running");
            setLoadMsg("");
            // Auto-focus the canvas so keyboard works immediately
            const canvas = dosBoxRef.current?.querySelector("canvas");
            if (canvas) (canvas as HTMLCanvasElement).focus();
          }
          if (event === "bnd-play") {
            setLoadMsg("Menjalankan TYRIAN.EXE...");
          }
        },
      });
      dosRef.current = ci;
    } catch (e) {
      console.error("js-dos mount error:", e);
      setLoadMsg("Error memuat emulator. Coba refresh.");
    }
  };

  const restartGame = () => {
    if (dosRef.current) {
      try { dosRef.current.stop(); } catch (_) {}
      dosRef.current = null;
    }
    // Clear the div and remount
    if (dosBoxRef.current) {
      dosBoxRef.current.innerHTML = "";
    }
    setPhase("idle");
    setTimeout(() => launchGame(), 200);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return (
    <div id="game-arena" className="w-full scroll-mt-20 space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
              ⚡ JS-DOS v8 • DOSBOX TURBO • AUTO SPEED MAX
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {phase === "running" ? "BERJALAN" : phase === "loading" ? "MEMUAT..." : "SIAP"}
            </span>
          </div>
          <h2 className="text-2xl font-black font-mono text-white">{dict.game.arenaTitle}</h2>
          <p className="text-sm text-slate-400">{dict.game.arenaSubtitle}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="px-4 py-2 text-xs font-mono font-black rounded border border-cyan-400 bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.7)] transition-all cursor-pointer"
          >
            {isFullscreen ? "🗗 KELUAR FULLSCREEN" : "🖵 FULLSCREEN 100%"}
          </button>

          <button
            type="button"
            onClick={() => setShowGamepad(!showGamepad)}
            className={`px-3 py-2 text-xs font-mono font-bold rounded border transition-colors cursor-pointer ${
              showGamepad
                ? "bg-purple-600/30 text-purple-300 border-purple-500/50"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            🎮 Gamepad: {showGamepad ? "ON" : "OFF"}
          </button>

          {phase !== "idle" && (
            <button
              type="button"
              onClick={restartGame}
              className="px-3 py-2 text-xs font-mono font-bold rounded border border-amber-500/40 bg-slate-900 text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              🔄 {dict.common.restart}
            </button>
          )}
        </div>
      </div>

      {/* ─── GAME CONTAINER ──────────────────────────────────────── */}
      <div
        ref={containerRef}
        className={`relative w-full bg-black rounded-xl overflow-hidden border border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(0,240,255,0.08)] ${
          isFullscreen ? "fixed inset-0 z-50 rounded-none border-0 w-screen h-screen" : ""
        }`}
        style={{ height: isFullscreen ? "100vh" : "80vh", minHeight: "500px" }}
      >
        {/* Header bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-1.5 bg-black/80 border-b border-slate-800/80 backdrop-blur-sm pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              TYRIAN 2000 • JS-DOS v8 TURBO • {phase === "running" ? "60 FPS" : loadMsg || "IDLE"}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="pointer-events-auto text-[10px] font-mono font-bold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            {isFullscreen ? "✕ EXIT" : "⛶ FULL"}
          </button>
        </div>

        {/* js-dos v8 mounts into this div — fills 100% of parent */}
        <div
          ref={dosBoxRef}
          className="absolute inset-0 top-8 w-full h-[calc(100%-2rem)] [&>*]:w-full [&>*]:h-full [&_canvas]:!w-full [&_canvas]:!h-full [&_canvas]:!object-fill"
          onClick={() => {
            // Re-focus canvas on click (prevents keyboard disconnect)
            const canvas = dosBoxRef.current?.querySelector("canvas");
            if (canvas) (canvas as HTMLCanvasElement).focus();
          }}
        />

        {/* SPLASH: shown while idle */}
        {phase === "idle" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-950 via-black to-slate-950 text-center">
            <div className="space-y-6 max-w-md w-full">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/50 bg-amber-950/30 text-amber-300 font-mono text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  JS-DOS v8 ENGINE • TURBO SPEED • NATIVE WASM
                </div>
                <h3 className="text-5xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-cyan-300 to-purple-400 drop-shadow-[0_0_30px_rgba(0,240,255,0.5)]">
                  TYRIAN 2000
                </h3>
                <p className="text-sm text-slate-400 font-mono">{dict.game.readyPrompt}</p>
              </div>

              <ArcadeButton
                variant="amber"
                size="lg"
                onClick={launchGame}
                className="w-full shadow-[0_0_40px_rgba(245,158,11,0.9)] text-lg font-black text-black"
              >
                ⚡ LUNCURKAN GAME
              </ArcadeButton>

              <div className="grid grid-cols-3 gap-3 text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-4">
                <div>
                  <span className="text-amber-400 font-bold block text-xs">⚡ SPEED</span>
                  Turbo Max (Fastest)
                </div>
                <div>
                  <span className="text-cyan-400 font-bold block text-xs">🖵 DISPLAY</span>
                  100% Full Canvas
                </div>
                <div>
                  <span className="text-emerald-400 font-bold block text-xs">🎮 INPUT</span>
                  Auto-Lock Focus
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOADING overlay */}
        {phase === "loading" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 text-center gap-4">
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-amber-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
              </div>
              <p className="text-amber-300 font-mono text-sm font-bold">{loadMsg || "Memuat..."}</p>
              <p className="text-slate-500 font-mono text-xs">Bundle Tyrian ~30 MB, harap tunggu...</p>
            </div>
          </div>
        )}

        {/* Scanline CRT overlay */}
        {phase === "running" && (
          <div
            className="absolute inset-0 pointer-events-none z-10 top-8"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
            }}
          />
        )}
      </div>
      {/* ────────────────────────────────────────────────────────── */}

      {/* Speed info bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-lg border border-slate-800 bg-slate-950/50 text-xs font-mono">
        <div className="text-slate-400">
          <span className="text-amber-400 font-bold">⚡ Mode Cepat Otomatis aktif.</span>{" "}
          Klik layar untuk mengunci keyboard. Tekan{" "}
          <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Alt+Enter</kbd> untuk fullscreen internal DOSBox.{" "}
          Terlalu cepat? Tekan{" "}
          <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Ctrl+F11</kbd> untuk turunkan kecepatan.
        </div>
        <div className="shrink-0 text-[10px] text-slate-600">
          Engine: js-dos v8 • Bundle: cdn.dos.zone
        </div>
      </div>

      {/* Virtual gamepad */}
      {showGamepad && <VirtualGamepad />}
    </div>
  );
}
