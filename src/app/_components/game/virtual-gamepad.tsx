"use client";

import React, { useCallback } from "react";

interface VirtualGamepadProps {
  onKeyPress?: (key: string) => void;
  className?: string;
}

export function VirtualGamepad({ className = "" }: VirtualGamepadProps) {
  const triggerKeyEvent = useCallback((key: string, code: string, type: "keydown" | "keyup") => {
    const event = new KeyboardEvent(type, {
      key: key,
      code: code,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
    document.dispatchEvent(event);
  }, []);

  const handleTouch = (key: string, code: string) => {
    return {
      onTouchStart: (e: React.TouchEvent) => {
        e.preventDefault();
        triggerKeyEvent(key, code, "keydown");
      },
      onTouchEnd: (e: React.TouchEvent) => {
        e.preventDefault();
        triggerKeyEvent(key, code, "keyup");
      },
      onMouseDown: () => triggerKeyEvent(key, code, "keydown"),
      onMouseUp: () => triggerKeyEvent(key, code, "keyup"),
      onMouseLeave: () => triggerKeyEvent(key, code, "keyup"),
    };
  };

  return (
    <div
      className={`select-none rounded-xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <span className="font-mono text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          VIRTUAL ARCADE TOUCHPAD
        </span>
        <span className="font-mono text-[10px] text-slate-500">TOUCH / MOUSE ENABLED</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* D-PAD (Movement) */}
        <div className="flex flex-col items-center justify-center">
          <span className="font-mono text-[10px] font-bold text-slate-400 mb-2 uppercase">
            MANEUVER (D-PAD)
          </span>
          <div className="relative w-36 h-36 bg-slate-900/90 rounded-full border-2 border-slate-700 p-2 shadow-inner flex items-center justify-center">
            {/* UP */}
            <button
              type="button"
              {...handleTouch("ArrowUp", "ArrowUp")}
              className="absolute top-1 w-11 h-11 rounded-t-lg bg-slate-800 hover:bg-cyan-500 hover:text-black active:bg-cyan-400 text-slate-300 font-bold border border-slate-600 flex items-center justify-center transition-colors touch-none"
              aria-label="Up"
            >
              ▲
            </button>

            {/* LEFT */}
            <button
              type="button"
              {...handleTouch("ArrowLeft", "ArrowLeft")}
              className="absolute left-1 w-11 h-11 rounded-l-lg bg-slate-800 hover:bg-cyan-500 hover:text-black active:bg-cyan-400 text-slate-300 font-bold border border-slate-600 flex items-center justify-center transition-colors touch-none"
              aria-label="Left"
            >
              ◀
            </button>

            {/* CENTER PIVOT */}
            <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-700 shadow-inner flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-cyan-500/50" />
            </div>

            {/* RIGHT */}
            <button
              type="button"
              {...handleTouch("ArrowRight", "ArrowRight")}
              className="absolute right-1 w-11 h-11 rounded-r-lg bg-slate-800 hover:bg-cyan-500 hover:text-black active:bg-cyan-400 text-slate-300 font-bold border border-slate-600 flex items-center justify-center transition-colors touch-none"
              aria-label="Right"
            >
              ▶
            </button>

            {/* DOWN */}
            <button
              type="button"
              {...handleTouch("ArrowDown", "ArrowDown")}
              className="absolute bottom-1 w-11 h-11 rounded-b-lg bg-slate-800 hover:bg-cyan-500 hover:text-black active:bg-cyan-400 text-slate-300 font-bold border border-slate-600 flex items-center justify-center transition-colors touch-none"
              aria-label="Down"
            >
              ▼
            </button>
          </div>
        </div>

        {/* ACTION BUTTONS (Fire, Missile, Rear, Menu) */}
        <div className="flex flex-col items-center md:items-end justify-center">
          <span className="font-mono text-[10px] font-bold text-slate-400 mb-2 uppercase">
            WEAPON SYSTEMS
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Primary Fire (SPACE) */}
            <button
              type="button"
              {...handleTouch(" ", "Space")}
              className="col-span-2 py-3 px-4 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-400 text-white font-mono font-black text-sm tracking-wider border border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all touch-none"
            >
              FIRE (SPACE)
            </button>

            {/* Rear Gun (CTRL) */}
            <button
              type="button"
              {...handleTouch("Control", "ControlLeft")}
              className="py-3 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 active:bg-amber-400 text-black font-mono font-bold text-xs tracking-wider border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all touch-none"
            >
              REAR (CTRL)
            </button>

            {/* Sidekick / Special (ALT) */}
            <button
              type="button"
              {...handleTouch("Alt", "AltLeft")}
              className="py-2.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 active:bg-purple-400 text-white font-mono font-bold text-xs tracking-wider border border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-all touch-none"
            >
              SPECIAL (ALT)
            </button>

            {/* Enter (CONFIRM) */}
            <button
              type="button"
              {...handleTouch("Enter", "Enter")}
              className="py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 text-black font-mono font-bold text-xs tracking-wider border border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all touch-none"
            >
              ENTER ↵
            </button>

            {/* Menu (ESC) */}
            <button
              type="button"
              {...handleTouch("Escape", "Escape")}
              className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-mono font-bold text-xs tracking-wider border border-slate-600 transition-all touch-none"
            >
              MENU (ESC)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
