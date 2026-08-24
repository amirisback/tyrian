import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentDictionary } from "@/lib/i18n-server";
import { Header } from "../_components/header";
import { Footer } from "../_components/footer";
import { ArcadeCard } from "../_components/ui/arcade-card";
import { ArcadeButton } from "../_components/ui/arcade-button";
import { Badge } from "../_components/ui/badge";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getCurrentDictionary();
  return {
    title: `Pilot Flight Manual & Cheats — ${dict.metadata.title}`,
    description: dict.manual.subtitle,
  };
}

export default async function ManualPage() {
  const { dict } = await getCurrentDictionary();

  const secretCheats = [
    {
      code: "DESTRUCT",
      effect: "Membuka minigame rahasia tank duel Scorched Earth 2-player langsung di main menu.",
      category: "Secret Minigame",
    },
    {
      code: "UNKNOWN",
      effect: "Membuka opsi rahasia Lord of the Game difficulty mode pada menu episode.",
      category: "Difficulty Unlock",
    },
    {
      code: "ENGAGE",
      effect: "Membuka kapal tempur rahasia The SuperCarrot dengan persenjataan buah pisang.",
      category: "Secret Ship",
    },
    {
      code: "WEIRD",
      effect: "Mengubah sound effect ledakan kapal musuh menjadi suara chiptune komedi retro.",
      category: "Audio Easter Egg",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050711] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Header navLabels={dict.nav} playLabel={dict.common.playNow} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="amber">{dict.manual.badge}</Badge>
          <h1 className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
            {dict.manual.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            {dict.manual.subtitle}
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <Link href="/#game-arena">
              <ArcadeButton variant="cyan" size="md">
                🎮 {dict.common.playNow}
              </ArcadeButton>
            </Link>
          </div>
        </div>

        {/* Tactical Controls Card */}
        <ArcadeCard
          title={dict.manual.controlsTitle}
          badge="TACTICAL KEYMAP"
          variant="cyan"
          glow
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3.5 rounded bg-black/60 border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold block">↑ ↓ ← → (Arrow Keys)</span>
              <p className="text-slate-300 text-[11px]">Manuver kecepatan dan posisi kapal di layar 360 derajat.</p>
            </div>

            <div className="p-3.5 rounded bg-black/60 border border-slate-800 space-y-1">
              <span className="text-red-400 font-bold block">SPACEBAR</span>
              <p className="text-slate-300 text-[11px]">Tembakan primer meriam depan (Front Weapon).</p>
            </div>

            <div className="p-3.5 rounded bg-black/60 border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">LEFT CTRL</span>
              <p className="text-slate-300 text-[11px]">Tembakan sekunder meriam belakang / rudal buritan.</p>
            </div>

            <div className="p-3.5 rounded bg-black/60 border border-slate-800 space-y-1">
              <span className="text-purple-400 font-bold block">LEFT ALT</span>
              <p className="text-slate-300 text-[11px]">Aktivasi unit drone pendamping (Left/Right Sidekicks).</p>
            </div>

            <div className="p-3.5 rounded bg-black/60 border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold block">ENTER</span>
              <p className="text-slate-300 text-[11px]">Konfirmasi seleksi menu pangkalan dan toko senjata.</p>
            </div>

            <div className="p-3.5 rounded bg-black/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold block">ESC (ESCAPE)</span>
              <p className="text-slate-300 text-[11px]">Jeda simulasi pertempuran atau kembali ke menu opsi.</p>
            </div>
          </div>
        </ArcadeCard>

        {/* Upgrade Tactics */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black font-mono tracking-wide text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            {dict.manual.upgradesTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ArcadeCard
              title="1. Prioritaskan Generator"
              badge="STEP 1"
              variant="purple"
            >
              <p className="text-xs text-slate-300 leading-relaxed">
                Generator adalah jantung kapal tempur Anda. Senjata tingkat tinggi dan perisai energi mengonsumsi daya dalam jumlah masif. Tanpa generator berkapasitas besar, perisai Anda tidak akan mampu mengisi ulang saat dihujani tembakan.
              </p>
            </ArcadeCard>

            <ArcadeCard
              title="2. Kalibrasi Perisai Deflektor"
              badge="STEP 2"
              variant="cyan"
            >
              <p className="text-xs text-slate-300 leading-relaxed">
                Perisai meregenerasi secara otomatis selama daya generator mencukupi. Upgrade perisai ke tingkat <i>Advanced Particle Shield</i> untuk menahan tembakan laser berat tanpa merusak plat armor fisik kapal.
              </p>
            </ArcadeCard>

            <ArcadeCard
              title="3. Kombinasi Front & Rear Gun"
              badge="STEP 3"
              variant="amber"
            >
              <p className="text-xs text-slate-300 leading-relaxed">
                Banyak musuh di episode 2-4 menyerang dari arah belakang. Pasang meriam belakang (Rear Vulcan atau Guided Micro-Missile) agar Anda tidak terkepung saat menghadapi gelombang skuadron serbu MicroSol.
              </p>
            </ArcadeCard>
          </div>
        </div>

        {/* Cheat Codes & Secrets */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black font-mono tracking-wide text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {dict.manual.cheatsTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secretCheats.map((cheat) => (
              <ArcadeCard
                key={cheat.code}
                title={`KODE: ${cheat.code}`}
                badge={cheat.category}
                variant="amber"
              >
                <div className="space-y-2">
                  <div className="p-2.5 rounded bg-black/80 border border-slate-800 font-mono text-sm font-black text-amber-400 tracking-widest">
                    ⌨ {cheat.code}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cheat.effect}
                  </p>
                </div>
              </ArcadeCard>
            ))}
          </div>
        </div>

        {/* Secret Minigame Banner: DESTRUCT */}
        <ArcadeCard
          title={dict.manual.destructTitle}
          badge="RETRO ARTILLERY DUEL"
          variant="green"
          glow
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="font-mono text-base font-bold text-emerald-400">
                Minigame Tank Legendaris 2-Pemain
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {dict.manual.destructDesc} Diciptakan dengan fisika gravitasi peluru artileri, deformasi terrain tanah, serta berbagai jenis hulu ledak seperti MIRV, Dirt Bombs, dan Nuke.
              </p>
            </div>
            <Link href="/#game-arena" className="shrink-0">
              <ArcadeButton variant="green" size="md">
                🎮 COBA DI EMULATOR
              </ArcadeButton>
            </Link>
          </div>
        </ArcadeCard>
      </main>

      <Footer dict={dict} />
    </div>
  );
}
