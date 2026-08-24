"use client";

import React, { useState } from "react";

interface CrtScreenFrameProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export function CrtScreenFrame({
  children,
  title = "VGA 320x200 • 60Hz TRINITRON TUBE",
  className = "",
  onToggleFullscreen,
  isFullscreen = false,
}: CrtScreenFrameProps) {
  const [scanlinesActive, setScanlinesActive] = useState<boolean>(true);
  const [curvatureActive, setCurvatureActive] = useState<boolean>(true);
  const [stretchMode, setStretchMode] = useState<boolean>(true); // Default true for full screen fill

  return (
    <div
      className={`relative transition-all duration-200 ${
        isFullscreen
          ? "fixed inset-0 z-50 w-screen h-screen bg-black p-1 sm:p-2 flex flex-col justify-between rounded-none border-0"
          : "rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black p-3 sm:p-5 border-4 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(0,240,255,0.1)]"
      } ${className}`}
    >
      {/* Top Bezel Header */}
      <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-slate-800/80 select-none shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          </span>
          <span className="font-mono text-xs font-bold text-slate-300 tracking-wider">
            {title}
          </span>
        </div>

        {/* CRT Controls & Toggles */}
        <div className="flex items-center gap-2">
          {/* Stretch Mode Toggle */}
          <button
            type="button"
            onClick={() => setStretchMode(!stretchMode)}
            className={`px-2 py-1 text-[10px] font-mono font-bold uppercase rounded border transition-colors cursor-pointer ${
              stretchMode
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                : "bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300"
            }`}
            title="Toggle Widescreen Full Fill / 4:3 Ratio"
          >
            Layar: {stretchMode ? "FULL STRETCH 100%" : "RATIO 4:3"}
          </button>

          <button
            type="button"
            onClick={() => setScanlinesActive(!scanlinesActive)}
            className={`px-2 py-1 text-[10px] font-mono font-bold uppercase rounded border transition-colors cursor-pointer ${
              scanlinesActive
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                : "bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300"
            }`}
            title="Toggle Scanlines Effect"
          >
            CRT Scanlines: {scanlinesActive ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            onClick={() => setCurvatureActive(!curvatureActive)}
            className={`hidden sm:inline-flex px-2 py-1 text-[10px] font-mono font-bold uppercase rounded border transition-colors cursor-pointer ${
              curvatureActive
                ? "bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                : "bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300"
            }`}
            title="Toggle CRT Glass Curvature"
          >
            Glass: {curvatureActive ? "ON" : "OFF"}
          </button>

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded border transition-all cursor-pointer ${
                isFullscreen
                  ? "bg-amber-500 text-black border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]"
                  : "border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
              title="Toggle Fullscreen"
            >
              {isFullscreen ? "🗗 KELUAR FULLSCREEN" : "🖵 FULLSCREEN"}
            </button>
          )}
        </div>
      </div>

      {/* CRT Screen Display Container */}
      <div
        className={`relative overflow-hidden bg-black rounded-lg ${
          curvatureActive ? "crt-vignette" : ""
        } ${
          isFullscreen
            ? "flex-1 w-full h-[calc(100vh-70px)] flex items-center justify-center"
            : ""
        }`}
        style={
          isFullscreen
            ? {}
            : {
                aspectRatio: stretchMode ? "16/9" : "4/3",
                minHeight: "380px",
                maxHeight: "720px",
              }
        }
      >
        <div
          className={`w-full h-full flex items-center justify-center transition-all ${
            !stretchMode && isFullscreen
              ? "max-w-[calc(100vh*4/3)] aspect-[4/3]"
              : "w-full h-full"
          }`}
        >
          {children}
        </div>

        {/* Scanlines Overlay */}
        {scanlinesActive && (
          <div className="absolute inset-0 scanlines-overlay crt-flicker pointer-events-none z-10 opacity-70" />
        )}
      </div>

      {/* Bottom Bezel Details */}
      <div className="flex items-center justify-between pt-2 mt-1 px-2 text-[11px] font-mono text-slate-500 border-t border-slate-900 select-none shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-cyan-400/80 font-bold">TYRIAN 2.1 DOS</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">OPL2 / ADLIB FM STEREO</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-amber-400/90 font-bold">
            {stretchMode ? "FULL WIDTH 100%" : "ASPECT 4:3"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-400 font-bold">
            {isFullscreen ? "FULLSCREEN ON" : "READY"}
          </span>
        </div>
      </div>
    </div>
  );
}
