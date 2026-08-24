import React from "react";
import { ArcadeCard } from "../ui/arcade-card";

interface ControlsGuideProps {
  dict: {
    game: {
      controlsHint: string;
      touchNote: string;
    };
  };
}

export function ControlsGuide({ dict }: ControlsGuideProps) {
  const controls = [
    { key: "↑ ↓ ← →", action: "Navigasi & Manuver Pesawat", color: "cyan" },
    { key: "SPASI", action: "Tembakan Utama (Front Gun)", color: "red" },
    { key: "LEFT CTRL", action: "Senjata Belakang (Rear Gun)", color: "amber" },
    { key: "LEFT ALT", action: "Unit Pendamping / Sidekick", color: "purple" },
    { key: "ENTER", action: "Konfirmasi Menu / Toko Upgrade", color: "green" },
    { key: "ESC", action: "Pause Game / Menu Opsi", color: "slate" },
  ];

  return (
    <ArcadeCard title="PANDUAN KONTROL & INSTRUKSI TEMPUR" badge="KEYMAP & PERFORMANCE" variant="cyan">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-2">
        {controls.map((ctrl) => (
          <div
            key={ctrl.key}
            className="flex flex-col p-2.5 rounded border border-slate-800 bg-slate-900/60"
          >
            <span className="font-mono text-xs font-black text-cyan-300 mb-1">
              {ctrl.key}
            </span>
            <span className="text-[11px] text-slate-400 leading-tight">
              {ctrl.action}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono text-slate-400">
        <div className="space-y-1">
          <p>💡 {dict.game.controlsHint}</p>
          <p className="text-cyan-400/90 font-semibold">📱 {dict.game.touchNote}</p>
        </div>
        <div className="space-y-1 p-2 rounded bg-amber-950/20 border border-amber-500/30 text-amber-300">
          <p className="font-bold">⚡ Tips Performa & Layar Lebar:</p>
          <p className="text-[10px] text-slate-300">
            • Tekan <strong>Ctrl + F12</strong> di keyboard untuk menambah kecepatan/kehalusan FPS DOSBox jika terasa lambat.<br />
            • Tekan <strong>Alt + Enter</strong> di dalam area game untuk mode Fullscreen internal DOSBox.
          </p>
        </div>
      </div>
    </ArcadeCard>
  );
}
