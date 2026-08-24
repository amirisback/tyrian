"use client";

import React, { useState, useEffect } from "react";
import soundtrackData from "@/data/soundtrack.json";
import { ArcadeCard } from "../ui/arcade-card";
import { Badge } from "../ui/badge";

interface SoundtrackJukeboxProps {
  dict: {
    jukebox: {
      badge: string;
      title: string;
      subtitle: string;
      composer: string;
      playing: string;
      paused: string;
      visualizer: string;
      fmEmulation: string;
    };
  };
}

export function SoundtrackJukebox({ dict }: SoundtrackJukeboxProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [synthBars, setSynthBars] = useState<number[]>([40, 60, 25, 85, 90, 45, 70, 30, 80, 50, 95, 65]);

  const activeTrack = soundtrackData[currentTrackIndex] || soundtrackData[0];

  // Randomize equalizer visualizer bars when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSynthBars((prev) =>
        prev.map(() => Math.floor(Math.random() * 80) + 20)
      );
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % soundtrackData.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) =>
      prev === 0 ? soundtrackData.length - 1 : prev - 1
    );
    setIsPlaying(true);
  };

  return (
    <section id="soundtrack" className="scroll-mt-20 py-16 border-b border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="cyan">{dict.jukebox.badge}</Badge>
          <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
            {dict.jukebox.title}
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            {dict.jukebox.subtitle}
          </p>
        </div>

        {/* Jukebox Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Active Track Player & Visualizer */}
          <div className="lg:col-span-6 space-y-6">
            <ArcadeCard
              title={activeTrack.title}
              badge={isPlaying ? dict.jukebox.playing : dict.jukebox.paused}
              variant="cyan"
              glow={isPlaying}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-cyan-400 font-bold">
                    {activeTrack.theme}
                  </span>
                  <span className="text-slate-400">{activeTrack.duration}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeTrack.description}
                </p>

                {/* Animated Graphic Equalizer Waveform */}
                <div className="p-4 rounded-lg bg-black border border-slate-800 flex items-end justify-between gap-1.5 h-28">
                  {synthBars.map((height, idx) => (
                    <div
                      key={idx}
                      className={`w-full rounded-t transition-all duration-100 ${
                        isPlaying
                          ? idx % 2 === 0
                            ? "bg-cyan-400 shadow-[0_0_8px_#00f0ff]"
                            : "bg-purple-500 shadow-[0_0_8px_#a855f7]"
                          : "bg-slate-800"
                      }`}
                      style={{ height: isPlaying ? `${height}%` : "15%" }}
                    />
                  ))}
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-3 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
                    aria-label="Previous Track"
                  >
                    ⏮
                  </button>

                  <button
                    type="button"
                    onClick={togglePlay}
                    className="px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-black text-sm tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all cursor-pointer"
                  >
                    {isPlaying ? "⏸ PAUSE" : "▶ PLAY SYNTH"}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-3 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
                    aria-label="Next Track"
                  >
                    ⏭
                  </button>
                </div>

                <div className="pt-2 text-center text-[10px] font-mono text-slate-500">
                  {dict.jukebox.fmEmulation} • {activeTrack.bpm} BPM
                </div>
              </div>
            </ArcadeCard>
          </div>

          {/* Right: Tracklist Catalog */}
          <div className="lg:col-span-6 space-y-2">
            <h3 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">
              TRACKLIST SELECTION ({soundtrackData.length} TRACKS)
            </h3>
            <div className="space-y-2">
              {soundtrackData.map((track, idx) => {
                const isCurrent = idx === currentTrackIndex;
                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      setCurrentTrackIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-lg border transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                        : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-xs font-bold w-5 ${
                          isCurrent ? "text-cyan-400" : "text-slate-500"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <span
                          className={`font-mono text-sm font-bold block ${
                            isCurrent ? "text-cyan-300" : "text-slate-200"
                          }`}
                        >
                          {track.title}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {track.composer}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-slate-400">
                        {track.duration}
                      </span>
                      {isCurrent && isPlaying && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
