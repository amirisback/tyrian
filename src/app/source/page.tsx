import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentDictionary } from "@/lib/i18n-server";
import { Header } from "../_components/header";
import { Footer } from "../_components/footer";
import { ArcadeCard } from "../_components/ui/arcade-card";
import { ArcadeButton } from "../_components/ui/arcade-button";
import { Badge } from "../_components/ui/badge";
import opentyrianData from "@/data/opentyrian-repo.json";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getCurrentDictionary();
  return {
    title: `OpenTyrian Source Code — ${dict.metadata.title}`,
    description: dict.source.subtitle,
  };
}

export default async function SourcePage() {
  const { dict } = await getCurrentDictionary();

  // Key C source files in opentyrian/src
  const sampleSourceFiles = [
    { name: "opentyr.c", desc: "Main entry point, command-line arguments parsing, and game initialization." },
    { name: "tyrian2.c", desc: "Core gameplay state machine, mission runner, and episode logic." },
    { name: "mainint.c", desc: "Interrupt handlers, timer clock synchronization, and frame timing." },
    { name: "video.c", desc: "SDL2 video surface management, palette cycling, and scaling filters." },
    { name: "opl.c", desc: "AdLib OPL2/OPL3 FM sound synthesis emulator for Roland/Sound Blaster." },
    { name: "destruct.c", desc: "Secret 2-player artillery mini-game engine implementation." },
    { name: "shots.c", desc: "Weapon firing algorithms, ballistic physics, and laser collision detection." },
    { name: "player.c", desc: "Player ship controls, generator recharge, shield absorption, and score tally." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050711] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Header navLabels={dict.nav} playLabel={dict.common.playNow} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="cyan">{dict.source.badge}</Badge>
          <h1 className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
            {dict.source.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            {dict.source.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <a
              href="https://github.com/opentyrian/opentyrian"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ArcadeButton variant="cyan" size="md">
                ↗ {dict.source.githubButton}
              </ArcadeButton>
            </a>
            <Link href="/#game-arena">
              <ArcadeButton variant="outline" size="md">
                🎮 {dict.common.playNow}
              </ArcadeButton>
            </Link>
          </div>
        </div>

        {/* Embedded Repo Notice Card */}
        <ArcadeCard
          title={dict.source.sourceEmbeddedTitle}
          badge="LOCAL DIRECTORY: /opentyrian"
          variant="cyan"
          glow
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            <div className="space-y-2">
              <p className="text-slate-300 leading-relaxed">
                {dict.source.sourceEmbeddedDesc}
              </p>
              <div className="p-3 rounded bg-black/70 border border-slate-800 text-cyan-300">
                📁 /opentyrian/src/ (104 files C & Header)
              </div>
            </div>
            <div className="space-y-1.5 text-slate-400 border-l border-slate-800 pl-4">
              <div><strong className="text-slate-200">Repository:</strong> {opentyrianData.repository.name}</div>
              <div><strong className="text-slate-200">License:</strong> {opentyrianData.repository.license}</div>
              <div><strong className="text-slate-200">Language:</strong> {opentyrianData.repository.language}</div>
              <div><strong className="text-slate-200">Original Dev:</strong> {opentyrianData.repository.originalDevelopers}</div>
            </div>
          </div>
        </ArcadeCard>

        {/* Architecture Modules */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black font-mono tracking-wide text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            {dict.source.architectureTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opentyrianData.architecture.map((mod) => (
              <ArcadeCard
                key={mod.module}
                title={mod.module}
                badge="C MODULE"
                variant="purple"
              >
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {mod.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {mod.files.map((file) => (
                    <span
                      key={file}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400 font-bold"
                    >
                      {file}
                    </span>
                  ))}
                </div>
              </ArcadeCard>
            ))}
          </div>
        </div>

        {/* Source File Directory Showcase */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black font-mono tracking-wide text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            EKSPLORASI FILE UTAMA OPENTYRIAN
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleSourceFiles.map((file) => (
              <div
                key={file.name}
                className="p-4 rounded-lg border border-slate-800 bg-slate-950/80 space-y-2 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-center justify-between font-mono text-xs font-bold text-cyan-300">
                  <span>📄 {file.name}</span>
                  <span className="text-[10px] text-slate-500">C CODE</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {file.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Compilation Guide */}
        <ArcadeCard
          title={dict.source.compilationTitle}
          badge="BUILD INSTRUCTIONS"
          variant="amber"
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-bold">1. Kebutuhan Dependensi:</span>
              <p className="text-amber-300 p-2 rounded bg-black/60 border border-slate-800">
                {opentyrianData.buildGuide.dependencies}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-bold">2. Linux / macOS Compile:</span>
              <pre className="text-emerald-400 p-3 rounded bg-black/80 border border-slate-800 overflow-x-auto">
                {opentyrianData.buildGuide.linuxCompile}
              </pre>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-bold">3. Windows MinGW Compile:</span>
              <pre className="text-emerald-400 p-3 rounded bg-black/80 border border-slate-800 overflow-x-auto">
                {opentyrianData.buildGuide.windowsCompile}
              </pre>
            </div>
          </div>
        </ArcadeCard>
      </main>

      <Footer dict={dict} />
    </div>
  );
}
