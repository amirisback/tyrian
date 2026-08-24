import { getCurrentDictionary } from "@/lib/i18n-server";
import { generateWebsiteJsonLd } from "@/lib/seo";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import { HeroSection } from "./_components/sections/hero-section";
import { JdosPlayer } from "./_components/game/jdos-player";
import { ControlsGuide } from "./_components/game/controls-guide";
import { HangarSection } from "./_components/sections/hangar-section";
import { WeaponsSection } from "./_components/sections/weapons-section";
import { EpisodesSection } from "./_components/sections/episodes-section";
import { SoundtrackJukebox } from "./_components/sections/soundtrack-jukebox";
import { LeaderboardSection } from "./_components/sections/leaderboard-section";
import { LoreSection } from "./_components/sections/lore-section";

export default async function Home() {
  const { locale, dict } = await getCurrentDictionary();
  const websiteJsonLd = generateWebsiteJsonLd(locale);

  // VideoGame JSON-LD for Tyrian
  const videoGameJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Tyrian",
    alternateName: ["Tyrian 2000", "OpenTyrian"],
    description: dict.metadata.description,
    genre: ["Scrolling shooter", "Arcade", "Action"],
    gamePlatform: ["DOS", "Web Browser", "PC"],
    author: {
      "@type": "Organization",
      name: "Eclipse Software",
    },
    publisher: {
      "@type": "Organization",
      name: "Epic MegaGames",
    },
    inLanguage: locale === "id" ? "id-ID" : "en-US",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050711] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoGameJsonLd),
        }}
      />

      {/* Retro Arcade Header */}
      <Header navLabels={dict.nav} playLabel={dict.common.playNow} />

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <HeroSection dict={dict} />

        {/* Game Arena Section */}
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <JdosPlayer dict={dict} />
          <ControlsGuide dict={dict} />
        </div>

        {/* Ship Hangar Section */}
        <HangarSection dict={dict} />

        {/* Weapons Catalog Section */}
        <WeaponsSection dict={dict} />

        {/* Episodes Campaign Section */}
        <EpisodesSection dict={dict} />

        {/* Alexander Brandon Soundtrack Jukebox */}
        <SoundtrackJukebox dict={dict} />

        {/* Leaderboard High Scores */}
        <LeaderboardSection dict={dict} />

        {/* Tyrian Universe Lore */}
        <LoreSection dict={dict} />
      </main>

      {/* Arcade Footer */}
      <Footer dict={dict} />
    </div>
  );
}
